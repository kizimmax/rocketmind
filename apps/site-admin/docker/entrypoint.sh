#!/bin/sh
# На PaaS (Amvera) у нас нет shell-доступа в контейнер — все одноразовые
# миграции БД и данных запускаются автоматически при старте. Скрипты
# идемпотентны: повторный запуск на уже мигрированной БД — no-op.
set -e

export PATH="/app/node_modules/.bin:$PATH"

# Persisted volume mounts (Amvera).
mkdir -p /data/uploads /data/config /data/emails

cd /app/apps/site-admin

# 1. Накатить ожидающие Prisma-миграции (например, новую таблицу form_submissions).
# `migrate deploy` идемпотентна: применённые миграции пропускаются.
# || true — не блокируем старт, если БД временно недоступна; ошибка попадёт в логи.
echo "[entrypoint] prisma migrate deploy…"
npx prisma migrate deploy || echo "[entrypoint] migrate failed (см. логи выше) — пропускаем"

# 2. Одноразовые data-миграции — НЕ запускаются на каждом старте.
# pg-pool в этих скриптах вис по 60 сек на connection timeout, добавляя
# ~2 минуты к cold start и давая окно 503 при перезапуске контейнера.
# Миграции уже применены к проду; для повторного прогона — выставить
# RUN_DATA_MIGRATIONS=1 в Amvera UI на один деплой и снять.
if [ "${RUN_DATA_MIGRATIONS:-0}" = "1" ]; then
  echo "[entrypoint] RUN_DATA_MIGRATIONS=1 — enable-bitrix24-on-existing-forms…"
  node /app/scripts/enable-bitrix24-on-existing-forms.mjs || echo "[entrypoint] bitrix24 migration failed — пропускаем"

  echo "[entrypoint] migrate-uploads-to-relative…"
  node /app/scripts/migrate-uploads-to-relative.mjs || echo "[entrypoint] uploads migration failed — пропускаем"
else
  echo "[entrypoint] skip data-migrations (RUN_DATA_MIGRATIONS не выставлен)"
fi

# 3. Старт сервера.
echo "[entrypoint] starting next…"
exec next start -p 80
