# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build shared UI package first (saas-admin импортирует @rocketmind/ui).
RUN npm run build --workspace=packages/ui

# Build saas-admin (SSR). Prisma больше не используется — auth/данные на API
# Ивана (BACK_API).
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
COPY --from=builder /app/node_modules                     ./node_modules
COPY --from=builder /app/package.json                     ./package.json

COPY apps/saas-admin/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Uploads persistent volume на Amvera (общая папка для маскотов / файлов).
VOLUME ["/data"]

EXPOSE 80

CMD ["/entrypoint.sh"]
