# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build shared UI package first (saas-admin импортирует @rocketmind/ui).
RUN npm run build --workspace=packages/ui

# Generate Prisma client (schema лежит в apps/site/prisma — общая на все апы).
RUN npx prisma generate --schema=apps/site/prisma/schema.prisma

# Build saas-admin (SSR).
RUN npm run build --workspace=apps/saas-admin

# Разыменовать симлинки в public (next start не следует за ними).
# apps/saas-admin/public/ai-mascots → ../../site/public/ai-mascots
# → ../../../assets/ai-mascots. `cp -RL` рекурсивно резолвит всю цепочку.
RUN set -eux; \
    cp -RL /app/apps/saas-admin/public /app/apps/saas-admin/public.real; \
    rm -rf /app/apps/saas-admin/public; \
    mv /app/apps/saas-admin/public.real /app/apps/saas-admin/public

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Только runtime-артефакты saas-admin + общие node_modules.
COPY --from=builder /app/apps/saas-admin/.next            ./apps/saas-admin/.next
COPY --from=builder /app/apps/saas-admin/public           ./apps/saas-admin/public
COPY --from=builder /app/apps/saas-admin/package.json     ./apps/saas-admin/package.json
COPY --from=builder /app/apps/saas-admin/next.config.ts   ./apps/saas-admin/next.config.ts
# Prisma config + schema + миграции нужны runtime'у для `prisma migrate deploy`
# при старте контейнера (шаг в entrypoint.sh).
COPY --from=builder /app/apps/saas-admin/prisma.config.ts ./apps/saas-admin/prisma.config.ts
COPY --from=builder /app/apps/site/prisma                 ./apps/site/prisma
COPY --from=builder /app/node_modules                     ./node_modules
COPY --from=builder /app/package.json                     ./package.json

COPY apps/saas-admin/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Uploads persistent volume на Amvera (общая папка для маскотов / файлов).
VOLUME ["/data"]

EXPOSE 80

CMD ["/entrypoint.sh"]
