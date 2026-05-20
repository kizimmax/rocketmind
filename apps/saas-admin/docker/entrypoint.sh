#!/bin/sh
# На PaaS (Amvera) у нас нет shell-доступа в контейнер — все одноразовые
# миграции БД запускаются автоматически при старте. `migrate deploy`
# идемпотентна: применённые миграции пропускаются.
set -e

export PATH="/app/node_modules/.bin:$PATH"

# Persistent volume на Amvera (общий с другими апами при mount'е).
mkdir -p /data/uploads /data/config

cd /app/apps/saas-admin

# Накатить ожидающие Prisma-миграции. saas-admin делит общую Postgres-схему
# с site-admin и saas-teacher (apps/site/prisma/schema.prisma). После переезда
# saas-admin на API Ивана (Mongo) — этот шаг можно будет удалить.
echo "[entrypoint] prisma migrate deploy…"
npx prisma migrate deploy || echo "[entrypoint] migrate failed (см. логи выше) — пропускаем"

echo "[entrypoint] starting next…"
exec next start -p 80
