#!/bin/sh
# Универсальный dispatcher для монорепо Rocketmind.
# Запускается из корневого Dockerfile (план Б). По ENV APP_NAME решает
# что именно стартовать в этом контейнере.
set -e

export PATH="/app/node_modules/.bin:$PATH"

case "${APP_NAME:-}" in
  site)
    cd /app/apps/site
    prisma migrate deploy
    exec next start -p 80
    ;;

  site-admin)
    mkdir -p /data/uploads
    cd /app/apps/site-admin
    exec next start -p 80
    ;;

  design-system|saas|internal)
    rm -rf /usr/share/nginx/html/*
    mkdir -p /usr/share/nginx/html
    cp -r /app/apps/${APP_NAME}/out/. /usr/share/nginx/html/
    rm -f /etc/nginx/conf.d/default.conf
    cp /app/docker/nginx-${APP_NAME}.conf /etc/nginx/conf.d/default.conf
    exec nginx -g 'daemon off;'
    ;;

  *)
    echo "ERROR: APP_NAME not set or invalid (got '${APP_NAME}')." >&2
    echo "Set build arg APP_NAME to one of: site, site-admin, design-system, saas, internal" >&2
    exit 1
    ;;
esac
