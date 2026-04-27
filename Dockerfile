# ── Stage 1: Build all apps ──
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

# Firebase config (passed as build args → env for Next.js)
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

# Build site (static export for nginx)
ENV NEXT_STATIC_EXPORT=1
RUN npm run build --workspace=apps/site

# Build SaaS (served at /app)
ENV NEXT_PUBLIC_BASE_PATH=/app
RUN npm run build --workspace=apps/saas

# Build R-Plan (merged into site root, route = /r-plan)
ENV NEXT_PUBLIC_BASE_PATH=
RUN npm run build --workspace=apps/internal

# ── Stage 2: Serve via nginx ──
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Site as base
COPY --from=builder /app/apps/site/out /var/www/site

# Merge R-Plan into site (routes don't conflict)
COPY --from=builder /app/apps/internal/out/r-plan /var/www/site/r-plan
COPY --from=builder /app/apps/internal/out/_next/. /var/www/site/_next/

# SaaS separate (has /app basePath)
COPY --from=builder /app/apps/saas/out /var/www/saas

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
