# New Supabase Restore

This project uses Supabase for auth, realtime, storage, and the app data tables in `public`.

Your backup file contains:

- `auth` schema data, including users and auth state
- `public` tables used by the app
- `realtime` and `storage` schemas
- `vault`/extension setup from the old project

## Recommended restore flow

1. Create a brand-new Supabase project.
2. Copy the new project's direct Postgres connection string.
3. Restore the backup into the blank database with `psql`, not the SQL editor:

```bash
SUPABASE_DATABASE_URL='postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require' \
  ./scripts/restore_supabase_backup.sh
```

The backup is a PostgreSQL cluster dump in gzip form, so it needs `psql` to preserve `COPY`, schema ownership, and auth/storage objects correctly.

## After restore

Set these values in `serene-ai-garden/.env`:

```env
VITE_SUPABASE_URL=your_new_project_url
VITE_SUPABASE_ANON_KEY=your_new_project_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Then in the new Supabase project:

- Enable Google OAuth again if you use Google sign-in.
- Add your app URL to the authentication redirect settings.
- Open **SQL Editor**, paste `supabase/secure_app_tables.sql`, and run it once.
  This adds the missing `chat_messages.emotion` column, a public vote counter,
  and owner-only access to individual vote records.
- In **Table Editor**, verify Row Level Security is enabled for `chat_messages`,
  `journal_entries`, `mood_entries`, `posts`, and `post_votes`.
- Add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values to your
  deployment provider. Add `GEMINI_API_KEY` as a **server-only** environment
  variable. Never give it a `VITE_` prefix. A local `.env` is not uploaded to
  GitHub or automatically copied to Vercel/Netlify.

## Security rollout for an existing project

1. Run the updated `supabase/secure_app_tables.sql` in the Supabase SQL Editor
   before deploying the new frontend. It is safe to rerun and backfills vote
   totals from existing votes.
2. Create a new Gemini API key and save it as `GEMINI_API_KEY` in Vercel's
   Production environment. Keep the Supabase URL and publishable/anon key in
   their existing `VITE_` variables.
3. Deploy the app and verify a signed-in chat reply, a public vote total, and
   an authenticated upvote. The `/api/ai` endpoint requires a Supabase session.
4. Remove the old `VITE_GEMINI_API_KEY` from Vercel and revoke that old key in
   Google AI Studio. Earlier public JavaScript bundles may still contain it.

The explicit crisis-response path is a safeguard, not a clinical risk detector.
It does not replace professional help, moderation, or comprehensive safety testing.
For local AI testing, run the function harness with `node --experimental-strip-types
scripts/ai-dev-server.mjs` alongside `npm run dev` (Vite proxies `/api` to it);
`GEMINI_API_KEY` must be set in `.env`. Plain `vite` alone serves the frontend
but not the `/api/ai` function.

## App tables restored from the backup

- `chat_messages`
- `journal_entries`
- `mood_entries`
- `post_likes`
- `post_votes`
- `posts`
- `replies`
- `reply_likes`
- `user_insights`
