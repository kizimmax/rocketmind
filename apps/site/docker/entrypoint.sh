#!/bin/sh
set -e

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL env is not set. Set it in Amvera project settings." >&2
  exit 1
fi

export PATH="/app/node_modules/.bin:$PATH"

cd /app/apps/site
prisma migrate deploy

# Seed контента из markdown — НЕ запускается на каждом старте, чтобы не
# раздувать cold start (десятки upsert-ов на каждый boot = риск 503-окна).
# Для пересева: выставить RUN_SEED=1 в Amvera UI на один деплой и убрать.
if [ "${RUN_SEED:-0}" = "1" ]; then
  echo "→ RUN_SEED=1 — запускаю seed-from-markdown..."
  cd /app
  node scripts/seed-from-markdown.mjs || echo "⚠ Seed failed, продолжаем со стартом сайта"
  cd /app/apps/site
else
  echo "→ Skip seed (RUN_SEED не выставлен). Чтобы пересеять — выставите RUN_SEED=1."
fi

exec next start -p 80
