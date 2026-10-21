import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const open = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: [
      { stipendMin: 'desc' },
      { applyUrl: 'asc' }
    ]
  });

  console.log(`Auditing ${open.length} OPEN listings for deduplication and canonical URLs...`);

  const titleMap = new Map();
  const tokenMap = new Map();
  const toClose = [];
  const toKeep = [];

  for (const item of open) {
    const compName = item.company.name.toLowerCase().trim();
    const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const titleKey = `${compName}|${normTitle}`;

    // Extract requisition token if present (e.g., token=8184771 or gh_jid=8184771 or /jobs/10498382)
    let token = null;
    const m = item.applyUrl.match(/(?:token=|gh_jid=)([\d]+)/i) || 
              item.applyUrl.match(/\/jobs\/([\d]+)/i) ||
              item.applyUrl.match(/_([A-Z0-9-]+)$/i);
    if (m) {
      token = `${compName}|req|${m[1]}`;
    }

    let isDuplicate = false;
    let duplicateOf = null;

    if (token && tokenMap.has(token)) {
      isDuplicate = true;
      duplicateOf = tokenMap.get(token);
    } else if (titleMap.has(titleKey)) {
      isDuplicate = true;
      duplicateOf = titleMap.get(titleKey);
    }

    if (isDuplicate) {
      // Prefer cleaner URL: if the current one has /embed/ and the existing doesn't, keep existing.
      // If existing has /embed/ and current doesn't, swap them.
      if (duplicateOf.applyUrl.includes('/embed/') && !item.applyUrl.includes('/embed/')) {
        toClose.push({ id: duplicateOf.id, reason: 'Duplicate with embed URL replaced by direct' });
        toKeep.splice(toKeep.indexOf(duplicateOf), 1);
        toKeep.push(item);
        titleMap.set(titleKey, item);
        if (token) tokenMap.set(token, item);
      } else {
        toClose.push({ id: item.id, reason: `Duplicate of ${duplicateOf.title} (${duplicateOf.applyUrl})` });
      }
    } else {
      toKeep.push(item);
      titleMap.set(titleKey, item);
      if (token) tokenMap.set(token, item);
    }
  }

  console.log(`Unique listings to keep: ${toKeep.length}`);
  console.log(`Duplicates to close: ${toClose.length}`);

  if (toClose.length > 0) {
    const ids = toClose.map(c => c.id);
    await prisma.internship.updateMany({
      where: { id: { in: ids } },
      data: { status: 'CLOSED' }
    });
  }

  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });

  console.log(`\nFinal unique OPEN internships count: ${finalOpen.length}`);
  console.log('\nTop 20 Verified Distinct Openings:');
  for (const item of finalOpen.slice(0, 20)) {
    console.log(`[₹${item.stipendMin.toLocaleString('en-IN')}/mo] ${item.company.name} | ${item.title}`);
    console.log(`  🔗 ${item.applyUrl}`);
  }
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
