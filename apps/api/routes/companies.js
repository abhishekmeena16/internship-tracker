import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * List companies with open internship counts
 * GET /api/companies
 */
router.get('/', async (req, res, next) => {
  try {
    const { q, sector, hiringOnly, sort, limit } = req.query;
    
    const where = { isActive: true };
    if (q) {
      where.name = {
        contains: String(q),
        mode: 'insensitive'
      };
    }
    if (sector) {
      where.sector = String(sector);
    }
    if (hiringOnly === 'true') {
      where.internships = {
        some: {
          status: 'OPEN'
        }
      };
    }

    let orderBy = { name: 'asc' };
    if (sort === 'openings' || req.query.featured === 'true') {
      orderBy = [
        { internships: { _count: 'desc' } },
        { name: 'asc' }
      ];
    }

    const takeLimit = limit ? Math.min(1000, Math.max(1, parseInt(limit) || 50)) : undefined;

    const companies = await prisma.company.findMany({
      where,
      take: takeLimit,
      include: {
        _count: {
          select: {
            internships: {
              where: {
                status: 'OPEN'
              }
            }
          }
        }
      },
      orderBy
    });

    res.json({ data: companies });
  } catch (error) {
    next(error);
  }
});

/**
 * Get company details and open internships
 * GET /api/companies/:slug
 */
router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Valid company slug is required' });
    }

    const cleanSlug = slug.toLowerCase().trim();
    let company = await prisma.company.findUnique({
      where: { slug: cleanSlug },
      include: {
        internships: {
          where: { status: 'OPEN' },
          orderBy: { postedAt: 'desc' }
        }
      }
    });

    if (!company) {
      // Try case-insensitive lookup by name as fallback
      company = await prisma.company.findFirst({
        where: {
          OR: [
            { name: { equals: cleanSlug, mode: 'insensitive' } },
            { slug: { contains: cleanSlug, mode: 'insensitive' } }
          ]
        },
        include: {
          internships: {
            where: { status: 'OPEN' },
            orderBy: { postedAt: 'desc' }
          }
        }
      });
    }

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ data: company });
  } catch (error) {
    next(error);
  }
});

export default router;
