#!/bin/sh
set -e

# ── Директории ────────────────────────────────────────────────────────────────
mkdir -p /data/postgres /data/uploads /data/logs

# ── PostgreSQL: инициализация БД если не существует ───────────────────────────
if [ ! -f /data/postgres/PG_VERSION ]; then
  echo "Initializing PostgreSQL database..."
  chown -R postgres:postgres /data/postgres
  su-exec postgres initdb -D /data/postgres --encoding=UTF8 --locale=C

  # Стартуем временно для создания БД и пользователя
  su-exec postgres pg_ctl start -D /data/postgres -w -t 30

  su-exec postgres psql -c "CREATE DATABASE rocketmind;" 2>/dev/null || true
  su-exec postgres psql -c "CREATE USER rocketmind WITH PASSWORD '${DB_PASSWORD:-rocketmind}';" 2>/dev/null || true
  su-exec postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE rocketmind TO rocketmind;" 2>/dev/null || true
  su-exec postgres psql -d rocketmind -c "GRANT ALL ON SCHEMA public TO rocketmind;" 2>/dev/null || true

  su-exec postgres pg_ctl stop -D /data/postgres -w
  echo "PostgreSQL initialized."
else
  echo "PostgreSQL data directory exists, skipping init."
fi

chown -R postgres:postgres /data/postgres

# ── Prisma: применить миграции ─────────────────────────────────────────────────
# Ждём немного чтобы postgres успел стартовать через supervisord
su-exec postgres pg_ctl start -D /data/postgres -w -t 30

export DATABASE_URL="${DATABASE_URL:-postgresql://rocketmind:${DB_PASSWORD:-rocketmind}@localhost:5432/rocketmind}"
cd /app/apps/site && npx prisma migrate deploy 2>&1 || echo "Migration warning (may be ok on first run)"
cd /app

su-exec postgres pg_ctl stop -D /data/postgres -w

# ── Запускаем все процессы через supervisord ───────────────────────────────────
exec /usr/bin/supervisord -c /etc/supervisord.conf
