import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { validatePagination, parseIntSafe } from '../middleware/validate.js';

const router = Router();

/**
 * List internships with filters and pagination
 * GET /api/internships
 */
router.get('/', async (req, res, next) => {
  try {
    const {
      q, role, location, remote, minStipend, duration, company, degree,
      status = 'OPEN', sort
    } = req.query;

    const { page, limit, skip } = validatePagination(req.query);

    // Build Prisma where clause
    const where = {};
    
    // Status validation (OPEN, CLOSED, or omit for ALL)
    const VALID_STATUSES = ['OPEN', 'CLOSED'];
    if (status && status !== 'ALL') {
      const upperStatus = String(status).toUpperCase();
      if (VALID_STATUSES.includes(upperStatus)) {
        where.status = upperStatus;
      }
    }

    // Enforce India locations
    const indiaLocations = [
      'Bengaluru', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai',
      'Gurgaon', 'Gurugram', 'Noida', 'Chennai', 'Delhi', 'New Delhi',
      'Delhi NCR', 'Remote - India', 'India'
    ];

    if (q) {
      const searchStr = String(q).trim();
      if (searchStr.length > 0) {
        where.OR = [
          { title: { contains: searchStr, mode: 'insensitive' } },
          { description: { contains: searchStr, mode: 'insensitive' } },
          { company: { name: { contains: searchStr, mode: 'insensitive' } } },
          { skills: { hasSome: [searchStr, searchStr.toLowerCase(), searchStr.toUpperCase(), searchStr.charAt(0).toUpperCase() + searchStr.slice(1).toLowerCase()] } }
        ];
      }
    }

    // Role category validation (prevent Prisma enum validation error)
    const VALID_ROLES = ['SDE', 'DATA', 'AI_ML', 'OTHER'];
    if (role) {
      const rawRoles = Array.isArray(role) ? role : String(role).split(',');
      const validRoles = rawRoles
        .map(r => String(r).trim().toUpperCase())
        .filter(r => VALID_ROLES.includes(r));

      if (validRoles.length === 1) {
        where.roleCategory = validRoles[0];
      } else if (validRoles.length > 1) {
        where.roleCategory = { in: validRoles };
      }
    }

    // Degree / Education Eligibility validation
    const DEGREE_MAP = {
      'BTECH': ['BTECH'],
      'BE': ['BTECH'],
      'MTECH': ['MTECH'],
      'ME': ['MTECH'],
      'MS': ['MTECH'],
      'PHD': ['PHD'],
      'DOCTORAL': ['PHD'],
      'BCA': ['BCA'],
      'MCA': ['MCA'],
      'BCA_MCA': ['BCA', 'MCA'],
      'BSC': ['BSC'],
      'MSC': ['MSC'],
      'BSC_MSC': ['BSC', 'MSC']
    };

    if (degree) {
      const rawDegrees = Array.isArray(degree) ? degree : String(degree).split(',');
      const requestedDegrees = [];
      rawDegrees.forEach(d => {
        const upper = String(d).trim().toUpperCase();
        if (DEGREE_MAP[upper]) {
          requestedDegrees.push(...DEGREE_MAP[upper]);
        } else if (['BTECH', 'MTECH', 'PHD', 'BCA', 'MCA', 'BSC', 'MSC'].includes(upper)) {
          requestedDegrees.push(upper);
        }
      });

      const uniqueDegrees = [...new Set(requestedDegrees)];
      if (uniqueDegrees.length > 0) {
        where.targetDegrees = {
          hasSome: uniqueDegrees
        };
      }
    }

    if (location) {
      const locStr = String(location).trim();
      const cityAliases = {
        'bengaluru': ['Bengaluru', 'Bangalore', 'Remote - India'],
        'bangalore': ['Bengaluru', 'Bangalore', 'Remote - India'],
        'gurgaon': ['Gurgaon', 'Gurugram', 'Delhi NCR', 'New Delhi'],
        'gurugram': ['Gurgaon', 'Gurugram', 'Delhi NCR', 'New Delhi'],
        'delhi': ['Delhi', 'New Delhi', 'Delhi NCR', 'Gurgaon', 'Noida'],
        'noida': ['Noida', 'Delhi NCR', 'New Delhi', 'Delhi'],
        'mumbai': ['Mumbai', 'Navi Mumbai', 'Thane'],
        'hyderabad': ['Hyderabad', 'Secunderabad'],
        'pune': ['Pune'],
        'chennai': ['Chennai']
      };
      const aliases = cityAliases[locStr.toLowerCase()] || [locStr, locStr.charAt(0).toUpperCase() + locStr.slice(1)];
      where.locations = {
        hasSome: aliases
      };
    }

    if (remote !== undefined) {
      where.isRemote = remote === 'true';
    }

    if (minStipend) {
      const minVal = parseIntSafe(minStipend);
      if (minVal > 0) {
        const stipendCondition = [
          { stipendMin: { gte: minVal } },
          { stipendMax: { gte: minVal } }
        ];
        if (where.OR) {
          where.AND = [
            { OR: where.OR },
            { OR: stipendCondition }
          ];
          delete where.OR;
        } else {
          where.OR = stipendCondition;
        }
      }
    }

    if (duration) {
      const durationVal = parseIntSafe(duration);
      if (durationVal > 0) {
        where.durationMonths = durationVal;
      }
    }

    if (company) {
      const compStr = String(company).trim();
      if (compStr.length > 0) {
        where.company = {
          OR: [
            { slug: compStr.toLowerCase() },
            { name: { contains: compStr, mode: 'insensitive' } }
          ]
        };
      }
    }

    // Build sort clause
    let orderBy = { postedAt: 'desc' }; // default newest
    if (sort === 'stipend') {
      orderBy = { stipendMax: 'desc' };
    } else if (sort === 'deadline') {
      orderBy = { deadline: 'asc' };
    }

    // Execute queries in parallel
    const [total, internships] = await Promise.all([
      prisma.internship.count({ where }),
      prisma.internship.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          company: {
            select: {
              name: true,
              slug: true,
              logoUrl: true
            }
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    res.json({
      data: internships,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get tracking statistics and live crawl metadata
 * GET /api/internships/stats
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalOpen = await prisma.internship.count({ where: { status: 'OPEN' } });
    const totalCompanies = await prisma.company.count({ where: { isActive: true } });
    const hiringCompanies = await prisma.company.count({
      where: {
        isActive: true,
        internships: { some: { status: 'OPEN' } }
      }
    });

    const latestVerified = await prisma.internship.findFirst({
      where: { status: 'OPEN' },
      orderBy: { lastVerifiedAt: 'desc' },
      select: { lastVerifiedAt: true }
    });

    res.json({
      success: true,
      totalOpen,
      totalCompanies,
      hiringCompanies,
      lastVerifiedAt: latestVerified?.lastVerifiedAt || new Date()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Get full detail of a single internship
 * GET /api/internships/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const numId = parseInt(id, 10);

    if (isNaN(numId) || numId <= 0) {
      return res.status(400).json({ error: 'Valid numeric internship ID is required' });
    }

    const internship = await prisma.internship.findUnique({
      where: { id: numId },
      include: {
        company: true
      }
    });

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    res.json(internship);
  } catch (error) {
    next(error);
  }
});

export default router;
