# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall

# Build UI package first (apps depend on built dist)
RUN npm run build --workspace=packages/ui

# next.config.ts switches to output:"export" when NODE_ENV=production
ENV NODE_ENV=production
RUN npm run build --workspace=apps/design-system

# ── Stage 2: Runtime (nginx serves static export) ─────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/apps/design-system/out /usr/share/nginx/html
COPY apps/design-system/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
