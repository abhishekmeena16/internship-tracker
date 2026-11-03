import { Router } from 'express';
import { triggerLiveSync, getSchedulerStatus } from '../services/scheduler.js';

const router = Router();

/**
 * Trigger a full refresh cycle
 * POST /api/admin/ingest
 */
router.post('/ingest', async (req, res, next) => {
  try {
    const status = getSchedulerStatus();
    if (status.isRunning) {
      return res.status(409).json({
        success: false,
        message: 'A refresh cycle is already running. Wait for it to complete.',
        status,
      });
    }

    // Run in background and return immediate 202
    triggerLiveSync('ADMIN_MANUAL_TRIGGER').catch(err =>
      console.error('[Admin Ingest Error]', err)
    );

    res.status(202).json({
      success: true,
      message: 'Automated refresh engine started. Deep-verifying all links via ATS APIs.',
      status: getSchedulerStatus(),
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get live scheduler status, run history, and metrics
 * GET /api/admin/sync-status
 */
router.get('/sync-status', (req, res) => {
  res.json({
    success: true,
    ...getSchedulerStatus(),
  });
});

/**
 * Force-refresh a single internship's link
 * POST /api/admin/verify-link
 * Body: { internshipId: number }
 */
router.post('/verify-link', async (req, res, next) => {
  try {
    const { internshipId } = req.body;
    if (!internshipId) {
      return res.status(400).json({ success: false, message: 'internshipId is required' });
    }

    // Dynamically import the deep verifier from the engine
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: { company: true },
    });

    if (!internship) {
      await prisma.$disconnect();
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }

    // Quick HTTP check
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html',
    };

    let isLive = false;
    let verifyReason = '';
    try {
      const r = await fetch(internship.applyUrl, {
        method: 'GET', headers,
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      });
      if (r.status >= 200 && r.status < 400) {
        const body = await r.text();
        if (/position is no longer available|job has been closed|job not found/i.test(body)) {
          isLive = false;
          verifyReason = 'Page indicates job is closed';
        } else {
          isLive = true;
          verifyReason = `HTTP ${r.status} OK`;
        }
      } else {
        verifyReason = `HTTP ${r.status}`;
      }
    } catch (e) {
      verifyReason = `Error: ${e.message}`;
    }

    await prisma.internship.update({
      where: { id: internshipId },
      data: {
        status: isLive ? 'OPEN' : 'CLOSED',
        lastVerifiedAt: new Date(),
      },
    });

    await prisma.$disconnect();

    res.json({
      success: true,
      internshipId,
      company: internship.company.name,
      title: internship.title,
      applyUrl: internship.applyUrl,
      isLive,
      verifyReason,
      newStatus: isLive ? 'OPEN' : 'CLOSED',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
