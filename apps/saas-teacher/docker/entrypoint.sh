#!/bin/sh
# На PaaS (Amvera) у нас нет shell-доступа в контейнер — Prisma-миграции
# запускаются автоматически при старте. `migrate deploy` идемпотентна:
# применённые миграции пропускаются.
set -e

export PATH="/app/node_modules/.bin:$PATH"

cd /app/apps/saas-teacher

# Накатить ожидающие Prisma-миграции. saas-teacher делит общую Postgres-схему
# с site-admin и saas-admin (apps/site/prisma/schema.prisma). После переезда
# saas-teacher на API Ивана (Mongo) — этот шаг можно будет удалить.
echo "[entrypoint] prisma migrate deploy…"
# prisma.config.ts лежит в apps/saas-teacher — там же должны быть схема и
# .env. Если нет — fallback: явный путь к schema.
if [ -f prisma.config.ts ]; then
  npx prisma migrate deploy || echo "[entrypoint] migrate failed — пропускаем"
else
  npx prisma migrate deploy --schema=/app/apps/site/prisma/schema.prisma \
    || echo "[entrypoint] migrate failed — пропускаем"
fi

echo "[entrypoint] starting next…"
exec next start -p 80
