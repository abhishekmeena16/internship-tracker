import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function inspectOpen() {
  const list = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });

  console.log(`Found ${list.length} OPEN internships.`);

  // Test in batches of 10
  const results = [];
  const batchSize = 10;

  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      let status = 0;
      let ok = false;
      let finalUrl = item.applyUrl;
      let error = null;

      try {
        const res = await fetch(item.applyUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          signal: AbortSignal.timeout(6000),
          redirect: 'follow'
        });
        status = res.status;
        finalUrl = res.url;
        ok = res.status >= 200 && res.status < 400;
      } catch (err) {
        error = err.message;
      }

      results.push({
        id: item.id,
        company: item.company.name,
        companySlug: item.company.slug,
        title: item.title,
        stipendMin: item.stipendMin,
        stipendMax: item.stipendMax,
        applyUrl: item.applyUrl,
        finalUrl,
        status,
        ok,
        error
      });
    }));
    process.stdout.write(`Tested ${Math.min(i + batchSize, list.length)}/${list.length}\r`);
  }

  console.log('\nTesting completed.');
  const live = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);

  console.log(`\nResults: ${live.length} LIVE (HTTP 200/3xx), ${failed.length} FAILED/TIMEOUT`);

  if (failed.length > 0) {
    console.log('\nFailed entries:');
    for (const f of failed) {
      console.log(`- [${f.status || 'ERR'}] ${f.company} | ${f.title} | ${f.applyUrl} (${f.error || 'HTTP ' + f.status})`);
    }
  }

  console.log('\nSummary by Company of LIVE openings:');
  const companyCounts = {};
  for (const l of live) {
    companyCounts[l.company] = (companyCounts[l.company] || 0) + 1;
  }
  for (const [comp, count] of Object.entries(companyCounts).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${comp}: ${count}`);
  }
}

inspectOpen()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
