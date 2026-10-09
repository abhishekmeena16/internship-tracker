import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

/**
 * Return available filter values
 * GET /api/filters
 */
router.get('/', async (req, res, next) => {
  try {
    // For locations, use raw query: SELECT DISTINCT unnest(locations) FROM internships WHERE status='OPEN'
    let locations = [];
    try {
      const result = await prisma.$queryRaw`SELECT DISTINCT unnest(locations) as location FROM "Internship" WHERE status='OPEN'`;
      locations = result.map(r => r.location).filter(Boolean);
    } catch(e) {
      console.warn("Raw query for locations failed:", e.message);
    }

    // roles: get distinct roles from internships
    let roles = [];
    try {
        const rolesResult = await prisma.internship.findMany({
            select: { roleCategory: true },
            distinct: ['roleCategory']
        });
        roles = rolesResult.map(r => r.roleCategory).filter(Boolean);
    } catch(e) {
         console.warn("Could not fetch roles:", e.message);
    }

    // companies: list of {slug, name} with open internships
    const companies = await prisma.company.findMany({
      where: {
        internships: {
          some: {
            status: 'OPEN'
          }
        }
      },
      select: {
        slug: true,
        name: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Degrees filter options
    const degrees = [
      { label: 'B.Tech / B.E.', value: 'BTECH' },
      { label: 'M.Tech / M.E. / MS', value: 'MTECH' },
      { label: 'BCA / MCA', value: 'BCA_MCA' },
      { label: 'B.Sc / M.Sc', value: 'BSC_MSC' },
      { label: 'PhD / Research', value: 'PHD' }
    ];

    res.json({
      roles,
      locations,
      companies,
      degrees
    });
  } catch (error) {
    next(error);
  }
});

export default router;
