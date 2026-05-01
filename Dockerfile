# ── Универсальный Dockerfile для монорепо Rocketmind ─────────────────────────
#
# План Б: один Dockerfile в корне репо, выбирает что собрать через build arg
# APP_NAME ∈ {site | site-admin | design-system | saas | internal}.
#
# В Amvera UI каждого из 5 проектов задайте Build Arg `APP_NAME=<имя>`.
# Все 5 проектов смотрят в один и тот же репозиторий — Amvera видит ОДИН
# Dockerfile в корне, а нужный апп выбирается аргументом.
#
# Для apps/internal дополнительно задайте 8 Firebase build args
# (NEXT_PUBLIC_FIREBASE_*).
# Для apps/site и apps/site-admin задайте runtime ENV: DATABASE_URL,
# JWT_SECRET (только site-admin), S3_* (только site-admin).

# ── Stage 1: общие зависимости + UI пакет ─────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY . .
RUN npm install --ignore-scripts && npm run postinstall
RUN npm run build --workspace=packages/ui

# ── Stage 2: билд выбранного апп ──────────────────────────────────────────────
FROM deps AS builder
ARG APP_NAME

# Firebase build args нужны только internal; остальные апп их игнорируют
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL

ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY \
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN \
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID \
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET \
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID \
    NEXT_PUBLIC_FIREBASE_APP_ID=$NEXT_PUBLIC_FIREBASE_APP_ID \
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=$NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID \
    NEXT_PUBLIC_FIREBASE_DATABASE_URL=$NEXT_PUBLIC_FIREBASE_DATABASE_URL

RUN test -n "$APP_NAME" || (echo "ERROR: build arg APP_NAME is required" >&2; exit 1)

# Prisma client нужен только для site и site-admin
RUN if [ "$APP_NAME" = "site" ] || [ "$APP_NAME" = "site-admin" ]; then \
      npx prisma generate --schema=apps/site/prisma/schema.prisma; \
    fi

# Билд апп. site собирается с SKIP_DB=1 чтобы не дёргать БД при build time.
RUN if [ "$APP_NAME" = "site" ]; then \
      SKIP_DB=1 npm run build --workspace=apps/site; \
    else \
      npm run build --workspace=apps/${APP_NAME}; \
    fi

# ── Stage 3: финальный рантайм (Node + nginx, dispatcher выбирает) ────────────
FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache nginx

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

# Копируем целиком — внутри builder уже собрано только то, что нужно;
# node_modules один на весь монорепо (workspaces hoisting).
COPY --from=builder /app /app

# nginx-конфиги статических апп — диспетчер выберет нужный по APP_NAME
COPY apps/design-system/docker/nginx.conf /app/docker/nginx-design-system.conf
COPY apps/saas/docker/nginx.conf          /app/docker/nginx-saas.conf
COPY apps/internal/docker/nginx.conf      /app/docker/nginx-internal.conf

COPY docker/dispatcher.sh /dispatcher.sh
RUN chmod +x /dispatcher.sh

# Volume для site-admin (uploads). Остальные апп игнорируют.
VOLUME ["/data"]

EXPOSE 80
CMD ["/dispatcher.sh"]
