#!/usr/bin/env bash
set -e

PROJECT_DIR="/Users/abhishekmeena/.gemini/antigravity/scratch/internship-tracker"
cd "$PROJECT_DIR"

echo "Stopping any existing processes on ports 4000 and 3000..."
lsof -ti :4000 | xargs kill -9 2>/dev/null || true
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
sleep 1

echo "Starting Express API on port 4000..."
nohup node apps/api/server.js > /tmp/internship-api.log 2>&1 &
API_PID=$!
echo "API running with PID $API_PID"

echo "Starting Next.js Web on port 3000..."
nohup npm run start --workspace=apps/web -- -p 3000 > /tmp/internship-web.log 2>&1 &
WEB_PID=$!
echo "Web running with PID $WEB_PID"

echo "Waiting for services to become ready..."
for i in {1..15}; do
  if curl -s http://127.0.0.1:4000/health >/dev/null 2>&1 && curl -s http://127.0.0.1:3000/ >/dev/null 2>&1; then
    echo "Both services are healthy and responding!"
    break
  fi
  sleep 1
done

echo "--- Server Status ---"
lsof -i :4000 -i :3000
