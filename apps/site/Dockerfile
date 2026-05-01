# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build shared UI package first
RUN npm run build --workspace=packages/ui

# Generate Prisma client
RUN npx prisma generate --schema=apps/site/prisma/schema.prisma

# Build site (SSR; DATABASE_URL not needed at build time)
RUN SKIP_DB=1 npm run build --workspace=apps/site

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Only site runtime artifacts + shared node_modules
COPY --from=builder /app/apps/site/.next            ./apps/site/.next
COPY --from=builder /app/apps/site/public           ./apps/site/public
COPY --from=builder /app/apps/site/package.json     ./apps/site/package.json
COPY --from=builder /app/apps/site/next.config.ts   ./apps/site/next.config.ts
COPY --from=builder /app/apps/site/prisma           ./apps/site/prisma
COPY --from=builder /app/apps/site/prisma.config.ts ./apps/site/prisma.config.ts
COPY --from=builder /app/node_modules               ./node_modules
COPY --from=builder /app/package.json               ./package.json

COPY apps/site/docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

CMD ["/entrypoint.sh"]
