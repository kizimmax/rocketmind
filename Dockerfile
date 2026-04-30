# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Firebase config for R-Plan (build args → env)
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ENV NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID
ENV NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ENV NEXT_PUBLIC_FIREBASE_DATABASE_URL=$NEXT_PUBLIC_FIREBASE_DATABASE_URL

RUN npm install --ignore-scripts && npm run postinstall

# Build UI package
RUN npm run build --workspace=packages/ui

# Build site (SSR — no NEXT_STATIC_EXPORT)
# DATABASE_URL not needed at build time — only at runtime
RUN SKIP_DB=1 npm run build --workspace=apps/site

# Build SaaS (static, /app basePath)
ENV NEXT_PUBLIC_BASE_PATH=/app
RUN npm run build --workspace=apps/saas

# Build R-Plan (static, /r-plan route)
ENV NEXT_PUBLIC_BASE_PATH=
RUN npm run build --workspace=apps/internal

# ── Stage 2: Runtime ──────────────────────────────────────────────────────────
FROM node:20-alpine

# Install PostgreSQL, nginx, supervisord
RUN apk add --no-cache \
    postgresql postgresql-client \
    nginx \
    supervisor \
    su-exec

WORKDIR /app

# Copy site for SSR runtime (needs node_modules)
COPY --from=builder /app/apps/site/.next          ./apps/site/.next
COPY --from=builder /app/apps/site/public         ./apps/site/public
COPY --from=builder /app/apps/site/package.json   ./apps/site/package.json
COPY --from=builder /app/apps/site/prisma         ./apps/site/prisma
COPY --from=builder /app/apps/site/next.config.ts ./apps/site/next.config.ts
COPY --from=builder /app/node_modules             ./node_modules
COPY --from=builder /app/package.json             ./package.json

# Copy static builds for nginx
COPY --from=builder /app/apps/saas/out            ./static/saas
COPY --from=builder /app/apps/internal/out/r-plan ./static/site/r-plan
COPY --from=builder /app/apps/internal/out/_next/. ./static/site/_next/

# Copy config files
COPY docker/nginx.conf      /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/entrypoint.sh   /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Persistent volume mount point
VOLUME ["/data"]

EXPOSE 80

CMD ["/entrypoint.sh"]
