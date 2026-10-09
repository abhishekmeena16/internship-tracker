import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let isRunning = false;
let lastRunAt = null;
let nextRunAt = null;
let lastResult = null;
let syncIntervalHandle = null;

/**
 * Triggers a live sync cycle across all 210 companies
 */
export async function triggerLiveSync(reason = 'MANUAL') {
  if (isRunning) {
    console.log(`[Scheduler] Live sync already in progress (requested by: ${reason}). Skipping duplicate.`);
    return { status: 'ALREADY_RUNNING', lastRunAt, nextRunAt, isRunning: true };
  }

  isRunning = true;
  console.log(`\n======================================================`);
  console.log(`⏱️ [Scheduler] Starting automated live sync (Trigger: ${reason})...`);
  console.log(`======================================================`);

  try {
    const { syncAllLive } = await import('../../../packages/ingestion/scripts/sync-all-live.js');
    const result = await syncAllLive();
    lastRunAt = new Date();
    lastResult = result;
    console.log(`✅ [Scheduler] Live sync completed successfully. Verified openings: ${result.openInternships}`);
    return { status: 'SUCCESS', result, lastRunAt, nextRunAt, isRunning: false };
  } catch (error) {
    console.error(`❌ [Scheduler] Live sync encountered an error:`, error);
    lastResult = { error: error.message, failedAt: new Date() };
    return { status: 'ERROR', error: error.message, lastRunAt, nextRunAt, isRunning: false };
  } finally {
    isRunning = false;
  }
}

/**
 * Starts background recurring scheduler
 */
export function startScheduler() {
  if (process.env.DISABLE_SCHEDULER === 'true') {
    console.log(`ℹ️ [Scheduler] Automated background crawler disabled by DISABLE_SCHEDULER env var.`);
    return;
  }

  // Determine interval: check minutes first, then hours, default to 30 minutes
  let intervalMinutes = 30;
  if (process.env.SYNC_INTERVAL_MINUTES) {
    intervalMinutes = Number(process.env.SYNC_INTERVAL_MINUTES) || 30;
  } else if (process.env.SYNC_INTERVAL_HOURS) {
    intervalMinutes = (Number(process.env.SYNC_INTERVAL_HOURS) || 1) * 60;
  }

  const intervalMs = intervalMinutes * 60 * 1000;

  console.log(`🚀 [Scheduler] Automated recurring crawler initialized (Runs every ${intervalMinutes} minutes)`);

  nextRunAt = new Date(Date.now() + intervalMs);

  // Set recurring interval
  if (syncIntervalHandle) clearInterval(syncIntervalHandle);
  syncIntervalHandle = setInterval(() => {
    nextRunAt = new Date(Date.now() + intervalMs);
    triggerLiveSync('SCHEDULED_INTERVAL');
  }, intervalMs);

  // Run initial sync 15 seconds after server startup
  setTimeout(() => {
    console.log(`⚡ [Scheduler] Running initial post-startup crawler pass...`);
    triggerLiveSync('STARTUP');
  }, 15000);
}

/**
 * Get current scheduler metrics
 */
export function getSchedulerStatus() {
  let intervalMinutes = 30;
  if (process.env.SYNC_INTERVAL_MINUTES) {
    intervalMinutes = Number(process.env.SYNC_INTERVAL_MINUTES) || 30;
  } else if (process.env.SYNC_INTERVAL_HOURS) {
    intervalMinutes = (Number(process.env.SYNC_INTERVAL_HOURS) || 1) * 60;
  }

  return {
    isRunning,
    lastRunAt,
    nextRunAt,
    lastResult,
    intervalMinutes,
    activeTime: new Date()
  };
}
