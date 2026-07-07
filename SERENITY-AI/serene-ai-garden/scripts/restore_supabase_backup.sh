#!/usr/bin/env bash
set -euo pipefail

BACKUP_PATH="${1:-/Users/apoorvpal/Downloads/db_cluster-27-08-2025@19-15-08.backup.gz}"
SUPABASE_DATABASE_URL="${SUPABASE_DATABASE_URL:-}"

if [[ -z "$SUPABASE_DATABASE_URL" ]]; then
  cat <<'EOF'
Set SUPABASE_DATABASE_URL to the new project's direct Postgres connection string, then rerun:

  SUPABASE_DATABASE_URL='postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require' ./scripts/restore_supabase_backup.sh
EOF
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql is required but was not found on PATH." >&2
  exit 1
fi

if [[ ! -f "$BACKUP_PATH" ]]; then
  echo "Backup file not found: $BACKUP_PATH" >&2
  exit 1
fi

echo "Restoring $BACKUP_PATH into $SUPABASE_DATABASE_URL"
gunzip -c "$BACKUP_PATH" | psql "$SUPABASE_DATABASE_URL"
