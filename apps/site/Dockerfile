# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy the full monorepo (filtered by .dockerignore)
COPY . .

# Install all workspace dependencies
RUN npm install --ignore-scripts && npm run postinstall

# Build UI package first, then the app
RUN npm run build --workspace=packages/ui
RUN npm run build --workspace=apps/site

# ---- Stage 2: Serve ----
FROM nginx:alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/site/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
