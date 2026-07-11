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
drop policy if exists "post_votes_read_all" on public.post_votes;
drop policy if exists "post_votes_insert_own" on public.post_votes;
drop policy if exists "post_votes_delete_own" on public.post_votes;
create policy "post_votes_read_all" on public.post_votes for select to anon, authenticated using (true);
create policy "post_votes_insert_own" on public.post_votes for insert to authenticated with check (auth.uid() = user_id);
create policy "post_votes_delete_own" on public.post_votes for delete to authenticated using (auth.uid() = user_id);

create index if not exists chat_messages_user_created_idx on public.chat_messages (user_id, created_at desc);
create index if not exists journal_entries_user_created_idx on public.journal_entries (user_id, created_at desc);
create index if not exists mood_entries_user_created_idx on public.mood_entries (user_id, created_at desc);
create index if not exists posts_created_idx on public.posts (created_at desc);
create index if not exists post_votes_post_idx on public.post_votes (post_id);

commit;
