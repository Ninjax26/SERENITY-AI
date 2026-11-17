-- Run this once in the Supabase SQL editor after restoring the database backup.
-- It is safe to rerun: policies are replaced with the definitions below.

begin;

-- The frontend stores the detected mood with each chat message, but the old
-- backup predates this column.
alter table public.chat_messages add column if not exists emotion text;

alter table public.chat_messages enable row level security;
alter table public.journal_entries enable row level security;
alter table public.mood_entries enable row level security;
alter table public.posts enable row level security;
alter table public.post_votes enable row level security;

-- Publish only aggregate vote totals. Keep individual voting records private.
alter table public.posts add column if not exists vote_count integer not null default 0;
update public.posts as post
set vote_count = (select count(*) from public.post_votes as vote where vote.post_id = post.id);

create schema if not exists private;

-- Row ownership does not protect the derived vote_count column: the posts
-- UPDATE policy trusts the row's author for every column. Restrict
-- authenticated writers to the user-editable fields so the counter can only
-- change through the trigger below.
revoke insert, update on table public.posts from authenticated;
grant insert (user_id, title, content, author) on public.posts to authenticated;
grant update (title, content, author, updated_at) on public.posts to authenticated;

-- One vote per person per post. The unique backing index also makes the
-- trigger's +/- arithmetic safe against retry duplicates. If the check below
-- reports duplicates, resolve them first (see the deploy notes), then rerun.
do $$
declare duplicate_votes integer;
begin
  select count(*) into duplicate_votes from (
    select post_id, user_id from public.post_votes group by post_id, user_id having count(*) > 1 limit 1
  ) duplicates;
  if duplicate_votes > 0 then
    raise exception 'post_votes has duplicate (post_id, user_id) rows. Inspect them with: select post_id, user_id, count(*) from public.post_votes group by 1, 2 having count(*) > 1; then rerun this migration.';
  end if;
end;
$$;
alter table public.post_votes drop constraint if exists post_votes_post_user_key;
alter table public.post_votes add constraint post_votes_post_user_key unique (post_id, user_id);

-- Atomic per-user quota for provider calls, shared across serverless
-- instances. The server calls this with the user's access token, so
-- auth.uid() is always the verified caller; nobody can spend another
-- account's quota. Hits expire when each user's next check prunes them.
create table if not exists private.model_quota_hits (
  user_id uuid not null,
  hit_at timestamptz not null default now()
);
create index if not exists model_quota_hits_user_idx on private.model_quota_hits (user_id, hit_at);

-- The function lives in the public schema because PostgREST (and therefore
-- supabase.rpc) only exposes public by default; the hits table stays private
-- and ungranted, reachable only through this security-definer function.
create or replace function public.consume_model_quota(
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  hits integer;
  window_start timestamptz;
begin
  if auth.uid() is null or p_limit is null or p_limit < 1 or p_window_seconds is null or p_window_seconds < 1 then
    return false;
  end if;
  window_start := now() - make_interval(secs => p_window_seconds);
  -- Serialize concurrent quota decisions for the same user.
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text, 0));
  delete from private.model_quota_hits where user_id = auth.uid() and hit_at < window_start;
  select count(*) into hits from private.model_quota_hits where user_id = auth.uid() and hit_at >= window_start;
  if hits >= p_limit then
    return false;
  end if;
  insert into private.model_quota_hits (user_id) values (auth.uid());
  return true;
end;
$$;
revoke all on function public.consume_model_quota(integer, integer) from public, anon;
revoke usage on schema private from anon, authenticated;
grant execute on function public.consume_model_quota(integer, integer) to authenticated;

create or replace function private.update_post_vote_count()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    update public.posts set vote_count = vote_count + 1 where id = new.post_id;
    return new;
  end if;
  update public.posts set vote_count = greatest(0, vote_count - 1) where id = old.post_id;
  return old;
end;
$$;
revoke all on function private.update_post_vote_count() from public, anon, authenticated;
drop trigger if exists update_post_vote_count on public.post_votes;
create trigger update_post_vote_count
after insert or delete on public.post_votes
for each row execute function private.update_post_vote_count();

drop policy if exists "Users can access their own chat messages" on public.chat_messages;
drop policy if exists "chat_select_own" on public.chat_messages;
drop policy if exists "chat_insert_own" on public.chat_messages;
drop policy if exists "chat_delete_own" on public.chat_messages;
create policy "chat_select_own" on public.chat_messages for select to authenticated using (auth.uid() = user_id);
create policy "chat_insert_own" on public.chat_messages for insert to authenticated with check (auth.uid() = user_id);
create policy "chat_delete_own" on public.chat_messages for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "Users can access their own journal entries" on public.journal_entries;
drop policy if exists "journal_select_own" on public.journal_entries;
drop policy if exists "journal_insert_own" on public.journal_entries;
drop policy if exists "journal_update_own" on public.journal_entries;
drop policy if exists "journal_delete_own" on public.journal_entries;
create policy "journal_select_own" on public.journal_entries for select to authenticated using (auth.uid() = user_id);
create policy "journal_insert_own" on public.journal_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "journal_update_own" on public.journal_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journal_delete_own" on public.journal_entries for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "mood_select_own" on public.mood_entries;
drop policy if exists "mood_insert_own" on public.mood_entries;
drop policy if exists "mood_update_own" on public.mood_entries;
drop policy if exists "mood_delete_own" on public.mood_entries;
create policy "mood_select_own" on public.mood_entries for select to authenticated using (auth.uid() = user_id);
create policy "mood_insert_own" on public.mood_entries for insert to authenticated with check (auth.uid() = user_id);
create policy "mood_update_own" on public.mood_entries for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "mood_delete_own" on public.mood_entries for delete to authenticated using (auth.uid() = user_id);

-- Community posts are readable by everyone, but only authenticated users can
-- create posts and only their author can change or remove them.
drop policy if exists "posts_read_all" on public.posts;
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own" on public.posts;
drop policy if exists "posts_delete_own" on public.posts;
create policy "posts_read_all" on public.posts for select to anon, authenticated using (true);
create policy "posts_insert_own" on public.posts for insert to authenticated with check (auth.uid() = user_id);
create policy "posts_update_own" on public.posts for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "posts_delete_own" on public.posts for delete to authenticated using (auth.uid() = user_id);

-- Vote totals are public. A signed-in user can only create/remove their vote.
-- Old restores may contain differently named permissive policies.
do $$
declare policy_record record;
begin
  for policy_record in
    select policyname from pg_policies
    where schemaname = 'public' and tablename = 'post_votes'
  loop
    execute format('drop policy %I on public.post_votes', policy_record.policyname);
  end loop;
end;
$$;
create policy "post_votes_select_own" on public.post_votes for select to authenticated using (auth.uid() = user_id);
create policy "post_votes_insert_own" on public.post_votes for insert to authenticated with check (auth.uid() = user_id);
create policy "post_votes_delete_own" on public.post_votes for delete to authenticated using (auth.uid() = user_id);
revoke select on public.post_votes from public, anon;
grant select on public.post_votes to authenticated;

create index if not exists chat_messages_user_created_idx on public.chat_messages (user_id, created_at desc);
create index if not exists journal_entries_user_created_idx on public.journal_entries (user_id, created_at desc);
create index if not exists mood_entries_user_created_idx on public.mood_entries (user_id, created_at desc);
create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists post_votes_post_idx on public.post_votes (post_id);

commit;
