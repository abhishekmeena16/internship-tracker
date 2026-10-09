import { prisma } from '../packages/db/index.js';

async function main() {
  const jobs = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    select: {
      id: true,
      title: true,
      applyUrl: true,
      company: {
        select: { name: true, slug: true, careerUrl: true }
      }
    }
  });

  console.log(`Auditing ${jobs.length} open internships...`);

  // Group by unique applyUrl
  const urlMap = new Map();
  for (const j of jobs) {
    if (!urlMap.has(j.applyUrl)) {
      urlMap.set(j.applyUrl, []);
    }
    urlMap.get(j.applyUrl).push(j);
  }

  const entries = Array.from(urlMap.entries());
  console.log(`Unique URLs to check: ${entries.length}`);

  const brokenList = [];
  const pLimit = 5;

  for (let i = 0; i < entries.length; i += pLimit) {
    const chunk = entries.slice(i, i + pLimit);
    await Promise.all(chunk.map(async ([url, jobList]) => {
      const compName = jobList[0].company.name;
      const title = jobList[0].title;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          redirect: 'follow',
          signal: controller.signal
        });
        clearTimeout(timeout);

        let bodyText = '';
        if (res.status >= 400 || res.status === 200) {
          try {
            const buf = await res.arrayBuffer();
            bodyText = Buffer.from(buf.slice(0, 30000)).toString('utf-8').toLowerCase();
          } catch (e) {}
        }

        let isBroken = false;
        let reason = '';

        if (res.status === 404) {
          isBroken = true;
          reason = '404 Not Found';
        } else if (res.status === 410) {
          isBroken = true;
          reason = '410 Gone';
        } else if (res.status >= 500) {
          isBroken = true;
          reason = `HTTP ${res.status} Server Error`;
        } else if (bodyText.includes('this job is no longer available')) {
          isBroken = true;
          reason = 'Job no longer available';
        } else if (bodyText.includes('job opening has expired')) {
          isBroken = true;
          reason = 'Opening expired';
        } else if (bodyText.includes('access denied') && bodyText.includes('edgesuite.net')) {
          isBroken = true;
          reason = 'Akamai Blocked';
        }

        if (isBroken) {
          console.log(`❌ [${compName}] ${title}\n   Status: ${res.status} | Reason: ${reason}\n   URL: ${url}`);
          brokenList.push({ jobs: jobList, url, status: res.status, reason });
        } else {
          // If status is 403 or 429, WAF blocks curl/node fetch, but in real browser it opens fine (e.g. Workday, Uber)
          if (res.status === 403 || res.status === 429) {
            console.log(`🛡️ [${compName}] Protected by WAF (Status: ${res.status}) - Live in browser`);
          } else {
            console.log(`✅ [${compName}] HTTP ${res.status} OK`);
          }
        }
      } catch (err) {
        // Fetch error (e.g., DNS error, connection refused, or timeout)
        console.log(`⚠️ [${compName}] ${title}\n   Fetch Failed: ${err.message}\n   URL: ${url}`);
        brokenList.push({ jobs: jobList, url, status: 0, reason: err.message });
      }
    }));
  }

  console.log('\n=======================================');
  console.log(`Total Broken/Failed URLs: ${brokenList.length} out of ${entries.length}`);
  console.log('=======================================\n');

  // Print all broken for easy inspection
  for (const b of brokenList) {
    console.log(JSON.stringify({
      company: b.jobs[0].company.name,
      slug: b.jobs[0].company.slug,
      title: b.jobs[0].title,
      url: b.url,
      careerUrl: b.jobs[0].company.careerUrl,
      reason: b.reason,
      status: b.status
    }));
  }

  await prisma.$disconnect();
}

main().catch(console.error);
