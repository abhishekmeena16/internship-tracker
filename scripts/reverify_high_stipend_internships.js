import crypto from 'crypto';
import { prisma } from '../packages/db/index.js';
import { isStrictDirectApplicationUrl, verifiedDirectCompanyMap } from './enforce_100_percent_accurate_apply_links.js';

function makeHash(str) {
  return crypto.createHash('sha256').update(String(str)).digest('hex');
}

/**
 * Strict verification of legitimate internship titles.
 * Rejects full-time, senior, staff, lead, principal, executive, and non-intern postings.
 */
export function isLegitimateInternshipTitle(title = '') {
  if (!title || typeof title !== 'string') return false;
  const t = title.trim();

  // Explicit exclude patterns (senior/full-time corporate roles)
  const nonInternExclude = /\b(senior|staff|principal|lead|director|manager|head of|vp|operations associate|recruitment coordinator|leadership development program|graduate program|full-time|associate product manager ii|engineer ii|engineer iii|executive|general manager)\b/i;

  // Must match intern/trainee/student/coop keywords
  const internKeywords = /\b(intern|internship|co-op|coop|trainee|apprentice|fellow|fellowship|summer analyst|student)\b/i;

  if (nonInternExclude.test(t)) {
    // If it contains non-intern keywords, only accept if it ALSO explicitly contains "intern" or "internship"
    // e.g., "Software Engineer (Intern)" or "Winter Intern"
    if (!/\b(intern|internship|co-op|coop|trainee|apprentice)\b/i.test(t)) {
      return false;
    }
  }

  return internKeywords.test(t);
}

/**
 * Live HTTP tester with realistic headers and redirect following.
 * Returns true only if the endpoint returns HTTP 200..399.
 */
export async function testUrlLiveness(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(6000),
      redirect: 'follow'
    });

    // 200..399 = Live and accessible
    if (res.status >= 200 && res.status < 400) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function run() {
  console.log('================================================================');
  console.log('🎯 RE-VERIFYING HIGH-STIPEND INTERNSHIPS (≥ ₹50,000 / MO ONLY)');
  console.log('🎯 ENFORCING STRICT INTERN TITLES & 100% ACCURATE WORKING LINKS');
  console.log('================================================================\n');

  // STEP 1: Re-apply verified direct company mappings for high-tier tech companies
  console.log('[1/5] Syncing verified direct requisitions for top employers (stipend >= ₹50,000)...');
  for (const [compName, roles] of Object.entries(verifiedDirectCompanyMap)) {
    const comp = await prisma.company.findFirst({
      where: { name: { equals: compName, mode: 'insensitive' } }
    });

    if (!comp) continue;

    for (const r of roles) {
      // Must be >= 50,000
      if (r.stipendMin < 50000) continue;

      const now = new Date();
      const dedupHash = makeHash(`${comp.slug}|${r.applyUrl}`);

      await prisma.internship.upsert({
        where: { dedupHash },
        update: {
          title: r.title,
          status: 'OPEN',
          roleCategory: r.roleCategory,
          stipendMin: r.stipendMin,
          stipendMax: r.stipendMax,
          durationMonths: r.durationMonths || 3,
          locations: r.locations,
          skills: r.skills,
          description: r.description,
          applyUrl: r.applyUrl,
          lastSeenAt: now,
          lastVerifiedAt: now
        },
        create: {
          companyId: comp.id,
          title: r.title,
          status: 'OPEN',
          roleCategory: r.roleCategory,
          stipendMin: r.stipendMin,
          stipendMax: r.stipendMax,
          durationMonths: r.durationMonths || 3,
          locations: r.locations,
          skills: r.skills,
          description: r.description,
          applyUrl: r.applyUrl,
          source: 'DIRECT_REQUISITION',
          sourceJobId: `direct-${comp.slug}-${Date.now() % 1000000}`,
          firstSeenAt: now,
          lastSeenAt: now,
          lastVerifiedAt: now,
          dedupHash
        }
      });
    }
  }
  console.log('  ✓ Top tier tech employers synced.\n');

  // STEP 2: Filter and categorize all currently OPEN postings
  console.log('[2/5] Evaluating all open postings against Title and Stipend (≥ ₹50,000)...');
  const allCurrentOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    select: {
      id: true,
      title: true,
      stipendMin: true,
      stipendMax: true,
      durationMonths: true,
      applyUrl: true,
      company: { select: { id: true, name: true, slug: true } }
    }
  });

  console.log(`  Total currently OPEN: ${allCurrentOpen.length}`);

  const idsToClose = [];
  const candidatesForHttpCheck = [];

  for (const item of allCurrentOpen) {
    // 1. Title verification: must be an internship
    if (!isLegitimateInternshipTitle(item.title)) {
      idsToClose.push({ id: item.id, reason: `Non-intern title: ${item.title}` });
      continue;
    }

    // 2. Direct candidate application link check
    if (!isStrictDirectApplicationUrl(item.applyUrl)) {
      idsToClose.push({ id: item.id, reason: `Generic or non-direct URL: ${item.applyUrl}` });
      continue;
    }

    // 3. Stipend verification: must be >= ₹50,000/month
    if (!item.stipendMin || item.stipendMin < 50000) {
      idsToClose.push({ id: item.id, reason: `Stipend below ₹50,000: ₹${item.stipendMin || 0}` });
      continue;
    }

    candidatesForHttpCheck.push(item);
  }

  console.log(`  - Disqualified by Title / Generic URL / Stipend < ₹50k: ${idsToClose.length}`);
  console.log(`  - Passed preliminary filter (to test HTTP liveness): ${candidatesForHttpCheck.length}`);

  // Batch close disqualified postings
  if (idsToClose.length > 0) {
    const closeIds = idsToClose.map(x => x.id);
    for (let i = 0; i < closeIds.length; i += 100) {
      await prisma.internship.updateMany({
        where: { id: { in: closeIds.slice(i, i + 100) } },
        data: { status: 'CLOSED' }
      });
    }
    console.log(`  ✓ Successfully closed ${closeIds.length} disqualified listings.`);
  }

  // STEP 3: Live HTTP Verification for all remaining candidates
  console.log('\n[3/5] Performing live HTTP liveness checks on candidate apply links...');
  const deadIds = [];
  const verifiedActive = [];

  // Run HTTP checks in chunks of 15
  const chunkSize = 15;
  for (let i = 0; i < candidatesForHttpCheck.length; i += chunkSize) {
    const chunk = candidatesForHttpCheck.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(async (item) => {
      const isAlive = await testUrlLiveness(item.applyUrl);
      return { item, isAlive };
    }));

    for (const res of results) {
      if (res.isAlive) {
        verifiedActive.push(res.item);
      } else {
        deadIds.push(res.item.id);
      }
    }
  }

  console.log(`  - Live verified working links (HTTP 200..399): ${verifiedActive.length}`);
  console.log(`  - Dead / Inaccessible links closed: ${deadIds.length}`);

  if (deadIds.length > 0) {
    for (let i = 0; i < deadIds.length; i += 100) {
      await prisma.internship.updateMany({
        where: { id: { in: deadIds.slice(i, i + 100) } },
        data: { status: 'CLOSED' }
      });
    }
    console.log(`  ✓ Successfully closed ${deadIds.length} dead links.`);
  }

  // STEP 4: Deduplication and Duration Normalization
  console.log('\n[4/5] Deduplicating and normalizing durations (strictly 2-3 months)...');
  const seenCompanyUrls = new Set();
  const dupesToClose = [];
  const updates = [];

  for (const item of verifiedActive) {
    const key = `${item.company.id}|${item.applyUrl}`;
    if (seenCompanyUrls.has(key)) {
      dupesToClose.push(item.id);
      continue;
    }
    seenCompanyUrls.add(key);

    let dur = item.durationMonths;
    if (!dur || dur < 2 || dur > 3) {
      dur = 3;
      updates.push({ id: item.id, durationMonths: dur });
    }
  }

  if (dupesToClose.length > 0) {
    for (let i = 0; i < dupesToClose.length; i += 100) {
      await prisma.internship.updateMany({
        where: { id: { in: dupesToClose.slice(i, i + 100) } },
        data: { status: 'CLOSED' }
      });
    }
    console.log(`  ✓ Closed ${dupesToClose.length} duplicate postings.`);
  }

  if (updates.length > 0) {
    for (const u of updates) {
      await prisma.internship.update({
        where: { id: u.id },
        data: { durationMonths: u.durationMonths }
      });
    }
    console.log(`  ✓ Normalized duration for ${updates.length} postings.`);
  }

  // STEP 5: Final Database Audit and Verification
  console.log('\n[5/5] Final Database Audit...');
  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });

  const finalClosedCount = await prisma.internship.count({ where: { status: 'CLOSED' } });
  const companiesCount = new Set(finalOpen.map(x => x.company.id)).size;

  console.log('\n================================================================');
  console.log('🏆 FINAL VERIFIED DATABASE METRICS');
  console.log('================================================================');
  console.log(`Total OPEN Internships: ${finalOpen.length}`);
  console.log(`Total CLOSED Internships: ${finalClosedCount}`);
  console.log(`Unique Companies with Open Internships: ${companiesCount}`);

  // Sanity checks
  const nonInternCheck = finalOpen.filter(x => !isLegitimateInternshipTitle(x.title));
  const under50kCheck = finalOpen.filter(x => !x.stipendMin || x.stipendMin < 50000);
  const genericUrlCheck = finalOpen.filter(x => !isStrictDirectApplicationUrl(x.applyUrl));

  console.log(`\nIntegrity Verification:`);
  console.log(`  • Non-intern titles: ${nonInternCheck.length} (Target: 0)`);
  console.log(`  • Stipend < ₹50,000: ${under50kCheck.length} (Target: 0)`);
  console.log(`  • Generic / Non-direct URLs: ${genericUrlCheck.length} (Target: 0)`);

  console.log('\nTop 20 Verified High-Stipend Openings (≥ ₹50,000/mo):');
  finalOpen.slice(0, 20).forEach((item, idx) => {
    console.log(`${idx + 1}. [₹${item.stipendMin.toLocaleString('en-IN')}/mo] ${item.company.name} | ${item.title} (${item.durationMonths}m)`);
    console.log(`   🔗 ${item.applyUrl}`);
  });

  await prisma.$disconnect();
}

if (process.argv[1] && process.argv[1].endsWith('reverify_high_stipend_internships.js')) {
  run().catch(err => {
    console.error('Re-verification error:', err);
    process.exit(1);
  });
}
