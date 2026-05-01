# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build shared UI package first
RUN npm run build --workspace=packages/ui

# Generate Prisma client (schema lives in apps/site/prisma)
RUN npx prisma generate --schema=apps/site/prisma/schema.prisma

# Build CMS (SSR)
RUN npm run build --workspace=apps/site-admin

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Only CMS runtime artifacts + shared node_modules
COPY --from=builder /app/apps/site-admin/.next          ./apps/site-admin/.next
COPY --from=builder /app/apps/site-admin/public         ./apps/site-admin/public
COPY --from=builder /app/apps/site-admin/package.json   ./apps/site-admin/package.json
COPY --from=builder /app/apps/site-admin/next.config.ts ./apps/site-admin/next.config.ts
COPY --from=builder /app/node_modules                   ./node_modules
COPY --from=builder /app/package.json                   ./package.json

COPY apps/site-admin/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Upload files are persisted via Amvera volume mount at /data/uploads
VOLUME ["/data"]

EXPOSE 80

CMD ["/entrypoint.sh"]
