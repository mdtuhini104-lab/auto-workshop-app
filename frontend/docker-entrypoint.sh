#!/bin/sh
set -e

# If an anonymous/empty volume mounted over /app/.next, restore the built assets from Docker image backup
if [ ! -f /app/.next/BUILD_ID ]; then
  if [ -d /app/.next_dist ] && [ -f /app/.next_dist/BUILD_ID ]; then
    echo "[Entrypoint] Initializing /app/.next from image build..."
    cp -r /app/.next_dist/. /app/.next/ 2>/dev/null || true
  fi
fi

exec "$@"
