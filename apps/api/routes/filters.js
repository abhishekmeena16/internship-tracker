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

    res.json({
      roles,
      locations,
      companies
    });
  } catch (error) {
    next(error);
  }
});

export default router;
