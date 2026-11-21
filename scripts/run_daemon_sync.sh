#!/usr/bin/env bash
set -e
PROJECT_DIR="/Users/abhishekmeena/Desktop/internship-tracker"
cd "$PROJECT_DIR"

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

echo "=== [$(date '+%Y-%m-%d %H:%M:%S')] Starting Automated Ingestion Engine ===" >> "$PROJECT_DIR/logs/daemon_refresh.log"
/opt/homebrew/bin/node -r dotenv/config "$PROJECT_DIR/scripts/automated_refresh_engine.js" >> "$PROJECT_DIR/logs/daemon_refresh.log" 2>&1
echo "=== [$(date '+%Y-%m-%d %H:%M:%S')] Finished Automated Ingestion Engine ===" >> "$PROJECT_DIR/logs/daemon_refresh.log"
