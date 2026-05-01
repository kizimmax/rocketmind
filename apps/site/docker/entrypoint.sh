#!/bin/sh
set -e

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL env is not set. Set it in Amvera project settings." >&2
  exit 1
fi

export PATH="/app/node_modules/.bin:$PATH"

cd /app/apps/site
prisma migrate deploy

# Seed контента из markdown. Скрипт идемпотентный (upsert по slug/url),
# повторный запуск безопасен. Падение seed не должно блокировать старт.
echo "→ Running seed from markdown..."
cd /app
node scripts/seed-from-markdown.mjs || echo "⚠ Seed failed, продолжаем со стартом сайта"
cd /app/apps/site

exec next start -p 80
