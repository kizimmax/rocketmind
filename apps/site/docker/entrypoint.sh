#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

cd /app/apps/site
prisma migrate deploy

exec next start -p 80
