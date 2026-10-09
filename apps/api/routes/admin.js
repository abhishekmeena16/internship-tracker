import { Router } from 'express';
import { triggerLiveSync, getSchedulerStatus } from '../services/scheduler.js';

const router = Router();

/**
 * Trigger live ATS ingestion
 * POST /api/admin/ingest
 */
router.post('/ingest', async (req, res, next) => {
  try {
    // Run in background and return immediate status
    triggerLiveSync('ADMIN_MANUAL_TRIGGER').catch(err => console.error('[Admin Ingest Error]', err));

    res.status(202).json({
      success: true,
      message: 'Automated live ATS crawl started across all 210 companies for verified India openings.',
      status: getSchedulerStatus()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get live crawler status & metrics
 * GET /api/admin/sync-status
 */
router.get('/sync-status', (req, res) => {
  res.json({
    success: true,
    ...getSchedulerStatus()
  });
});

export default router;
