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
VITE_GEMINI_API_KEY=your_gemini_api_key
```

Then in the new Supabase project:

- Enable Google OAuth again if you use Google sign-in.
- Add your app URL to the authentication redirect settings.
- Verify Row Level Security policies on the `public` tables if you add new tables later.

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

