# ── Stage 1: Build all apps ──
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build UI package, then all three apps
RUN npm run build --workspace=packages/ui
RUN npm run build --workspace=apps/site
RUN npm run build --workspace=apps/saas
RUN npm run build --workspace=apps/internal

# ── Stage 2: Serve via nginx ──
FROM nginx:alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our routing config
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy static builds into separate directories
COPY --from=builder /app/apps/site/out     /var/www/site
COPY --from=builder /app/apps/saas/out     /var/www/saas
COPY --from=builder /app/apps/internal/out /var/www/rplan

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
