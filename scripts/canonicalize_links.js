import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function canonicalize() {
  const open = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true }
  });

  console.log(`Processing ${open.length} OPEN listings for canonical URLs...`);

  for (const item of open) {
    let newUrl = item.applyUrl;

    // Convert Greenhouse embed URL to direct job-boards URL
    const ghEmbedMatch = item.applyUrl.match(/greenhouse\.io\/embed\/job_app\?for=([a-z0-9_-]+)&token=([0-9]+)/i);
    if (ghEmbedMatch) {
      const slug = ghEmbedMatch[1];
      const token = ghEmbedMatch[2];
      if (slug.toLowerCase() === 'stripe') {
        newUrl = `https://stripe.com/jobs/search?gh_jid=${token}`;
      } else {
        newUrl = `https://job-boards.greenhouse.io/${slug}/jobs/${token}`;
      }
    }

    if (newUrl !== item.applyUrl) {
      console.log(`Upgrading URL:`);
      console.log(`  From: ${item.applyUrl}`);
      console.log(`  To:   ${newUrl}`);

      // Verify the new URL returns 200/3xx
      try {
        const res = await fetch(newUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          },
          signal: AbortSignal.timeout(6000),
          redirect: 'follow'
        });
        if (res.status >= 200 && res.status < 400) {
          await prisma.internship.update({
            where: { id: item.id },
            data: { applyUrl: newUrl, lastVerifiedAt: new Date() }
          });
          console.log(`  ✅ Successfully updated and verified`);
        } else {
          console.log(`  ⚠️ Warning: status was ${res.status}`);
        }
      } catch (e) {
        console.log(`  ❌ Failed to reach new URL: ${e.message}`);
      }
    }
  }

  // Deduplicate again to catch cross-slug duplicates like InMobi vs InMobi (Glance)
  const remaining = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true }
  });

  const seenUrls = new Set();
  const toClose = [];

  for (const r of remaining) {
    // Clean URL down to base path without query parameters if appropriate
    const cleanUrl = r.applyUrl.split('?')[0];
    if (seenUrls.has(r.applyUrl) || seenUrls.has(cleanUrl)) {
      toClose.push(r.id);
      console.log(`Closing cross-company duplicate: [${r.company.name}] ${r.title} (${r.applyUrl})`);
    } else {
      seenUrls.add(r.applyUrl);
      seenUrls.add(cleanUrl);
    }
  }

  if (toClose.length > 0) {
    await prisma.internship.updateMany({
      where: { id: { in: toClose } },
      data: { status: 'CLOSED' }
    });
  }

  const finalOpenCount = await prisma.internship.count({ where: { status: 'OPEN' } });
  console.log(`\nFinal Distinct OPEN Internships: ${finalOpenCount}`);
}

canonicalize()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
