#!/bin/sh
# saas-admin работает целиком против API Ивана (BACK_API). Своей БД/Prisma нет —
# миграции не нужны. Просто запускаем Next SSR.
set -e

export PATH="/app/node_modules/.bin:$PATH"
cd /app/apps/saas-admin

echo "[entrypoint] starting next…"
exec next start -p 80
