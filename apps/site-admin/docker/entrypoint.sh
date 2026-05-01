#!/bin/sh
set -e

export PATH="/app/node_modules/.bin:$PATH"

# Ensure upload directory exists (persisted volume)
mkdir -p /data/uploads

cd /app/apps/site-admin
exec next start -p 80
