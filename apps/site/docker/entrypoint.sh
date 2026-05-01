#!/bin/sh
set -e

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL env is not set. Set it in Amvera project settings." >&2
  exit 1
fi

export PATH="/app/node_modules/.bin:$PATH"

cd /app/apps/site
prisma migrate deploy

exec next start -p 80
