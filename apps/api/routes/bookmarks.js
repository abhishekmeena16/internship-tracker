import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * List user's bookmarks
 * GET /api/bookmarks
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id || (req.query.userId ? parseInt(req.query.userId, 10) : null);
    
    if (!userId) {
      return res.status(401).json({ error: 'Please log in to view saved internships' });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        internship: {
          include: {
            company: {
              select: {
                name: true,
                slug: true,
                logoUrl: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ data: bookmarks });
  } catch (error) {
    next(error);
  }
});

/**
 * Create a bookmark
 * POST /api/bookmarks
 */
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { internshipId } = req.body;
    
    if (!internshipId) {
      return res.status(400).json({ error: 'internshipId is required' });
    }

    const id = parseInt(internshipId, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'Valid numeric internshipId is required' });
    }

    // Verify internship exists
    const internshipExists = await prisma.internship.findUnique({
      where: { id },
      select: { id: true }
    });

    if (!internshipExists) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    const bookmark = await prisma.bookmark.upsert({
      where: {
        userId_internshipId: {
          userId,
          internshipId: id
        }
      },
      update: {},
      create: {
        userId,
        internshipId: id
      }
    });

    res.status(201).json({ success: true, bookmark });
  } catch (error) {
    next(error);
  }
});

/**
 * Delete a bookmark
 * DELETE /api/bookmarks/:internshipId
 */
router.delete('/:internshipId', requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const internshipId = parseInt(req.params.internshipId, 10);
    
    if (isNaN(internshipId) || internshipId <= 0) {
      return res.status(400).json({ error: 'Valid numeric internshipId is required' });
    }

    await prisma.bookmark.deleteMany({
      where: {
        userId,
        internshipId
      }
    });

    res.json({ success: true, message: 'Bookmark removed' });
  } catch (error) {
    next(error);
  }
});

export default router;
