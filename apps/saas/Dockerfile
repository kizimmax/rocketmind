# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install --ignore-scripts && npm run postinstall
RUN npm run build --workspace=packages/ui

# basePath не задаём — на Amvera SaaS получит свой домен (корень = /)
ENV NODE_ENV=production
RUN npm run build --workspace=apps/saas

# ── Stage 2: Runtime (nginx serves static export) ─────────────────────────────
FROM nginx:alpine

COPY --from=builder /app/apps/saas/out /usr/share/nginx/html
COPY apps/saas/docker/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
