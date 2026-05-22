# ── Stage 1: Build ────────────────────────────────────────────────────────────
# rebuild marker 2026-05-22: Prisma полностью убран (auth/данные на BACK_API).
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build shared UI package first.
RUN npm run build --workspace=packages/ui

# Build saas-teacher. Браузер ходит к API Ивана НАПРЯМУЮ (без BFF) —
# базовый URL вшивается на сборке (NEXT_PUBLIC_*). Prisma не используется.
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=https://api.rocketmind.ru/api/v1
RUN npm run build --workspace=apps/saas-teacher

# Разыменовать симлинки в public/. apps/saas-teacher/public/ai-mascots →
# ../../../assets/ai-mascots. `cp -RL` рекурсивно резолвит цепочку.
RUN set -eux; \
    cp -RL /app/apps/saas-teacher/public /app/apps/saas-teacher/public.real; \
    rm -rf /app/apps/saas-teacher/public; \
    mv /app/apps/saas-teacher/public.real /app/apps/saas-teacher/public

# ── Stage 2: Runtime (Next SSR, не nginx — без SSR не работают /api/* и /join) ─
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/apps/saas-teacher/.next            ./apps/saas-teacher/.next
COPY --from=builder /app/apps/saas-teacher/public           ./apps/saas-teacher/public
COPY --from=builder /app/apps/saas-teacher/package.json     ./apps/saas-teacher/package.json
COPY --from=builder /app/apps/saas-teacher/next.config.ts   ./apps/saas-teacher/next.config.ts
COPY --from=builder /app/node_modules                     ./node_modules
COPY --from=builder /app/package.json                     ./package.json

COPY apps/saas-teacher/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
