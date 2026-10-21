import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const goodCompanyPatterns = [
  // Big Tech & Cloud
  /google/i, /amazon/i, /microsoft/i, /apple/i, /meta/i, /adobe/i, /salesforce/i,
  /oracle/i, /cisco/i, /uber/i, /netflix/i, /servicenow/i, /atlassian/i, /intuit/i,
  /nutanix/i, /autodesk/i, /linkedin/i, /sap/i, /hpe/i, /hewlett packard/i,
  
  // Semiconductors & Hardware
  /nvidia/i, /qualcomm/i, /intel/i, /amd/i, /texas instruments/i, /samsung/i,
  /micron/i, /marvell/i, /nxp/i, /synopsys/i, /cadence/i, /arm/i, /western digital/i,
  /analog devices/i,
  
  // Quant & High-Frequency Trading & Top FinTech
  /tower research/i, /d\.?\s*e\.?\s*shaw/i, /arcesium/i, /worldquant/i, /alphagrep/i,
  /graviton/i, /quadeye/i, /jane street/i, /citadel/i, /jump trading/i, /optiver/i,
  /goldman sachs/i, /jpmorgan/i, /morgan stanley/i, /stripe/i, /groww/i, /paytm/i,
  /fampay/i, /merkle science/i, /razorpay/i, /cred/i, /phonepe/i, /zerodha/i,
  
  // Top Tech Unicorns & AI Startups
  /hackerrank/i, /instawork/i, /inmobi/i, /glance/i, /rubrik/i, /enterpret/i,
  /scopely/i, /forma\.ai/i, /project44/i, /cloudsek/i, /sprinto/i, /drivetrain/i,
  /weekday/i, /hevo/i, /meesho/i, /truecaller/i, /interview kickstart/i, /sarvam/i,
  /meraki/i, /airbound/i, /human archive/i, /cynlr/i, /bureau/i, /libra ai/i,
  /veyra ai/i, /aalteon/i, /span/i, /s&p global/i, /swiggy/i, /zomato/i, /zepto/i,
  /flipkart/i, /myntra/i, /postman/i, /browserstack/i, /datadog/i, /databricks/i,
  /snowflake/i, /mongodb/i, /confluent/i, /elastic/i, /cloudflare/i, /gitlab/i
];

function isGoodCompany(name) {
  return goodCompanyPatterns.some(pattern => pattern.test(name));
}

async function refreshAllLinks() {
  console.log('================================================================');
  console.log('🔄 REFRESHING AND AUDITING ALL OPEN INTERNSHIP LINKS');
  console.log('================================================================\n');

  const openList = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });

  console.log(`Auditing ${openList.length} currently OPEN internship listings...\n`);

  let liveCount = 0;
  let closedCount = 0;
  const verifiedList = [];
  const closedList = [];

  // Concurrently test URLs in controlled batches of 10
  const batchSize = 10;
  for (let i = 0; i < openList.length; i += batchSize) {
    const batch = openList.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      // 1. Stipend constraint: Must be >= 30,000 INR
      if (!item.stipendMin || item.stipendMin < 30000) {
        closedList.push({ id: item.id, company: item.company.name, title: item.title, reason: `Stipend ₹${item.stipendMin} is below ₹30,000 minimum` });
        return;
      }

      // 2. Good company filter
      if (!isGoodCompany(item.company.name)) {
        closedList.push({ id: item.id, company: item.company.name, title: item.title, reason: `Company not in verified tier-1 list` });
        return;
      }

      // 3. Title must be an internship/trainee
      const t = item.title.toLowerCase();
      if (!/\b(intern|internship|trainee|apprentice|fellow|summer analyst)\b/.test(t) ||
          /\b(senior|staff|lead|principal|director|manager)\b/.test(t)) {
        closedList.push({ id: item.id, company: item.company.name, title: item.title, reason: `Title not an internship: ${item.title}` });
        return;
      }

      // 4. Zero generic links
      const u = item.applyUrl.toLowerCase();
      if (u.endsWith('/careers') || u.endsWith('/jobs') || u.includes('/search?') || u.includes('/careers?') || u.endsWith('/campus')) {
        closedList.push({ id: item.id, company: item.company.name, title: item.title, reason: `Generic URL: ${item.applyUrl}` });
        return;
      }

      // 5. Test Live HTTP connection
      let isLive = false;
      let statusCode = 0;
      let error = null;

      try {
        const res = await fetch(item.applyUrl, {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          },
          signal: AbortSignal.timeout(8000),
          redirect: 'follow'
        });
        statusCode = res.status;
        isLive = res.status >= 200 && res.status < 400;
      } catch (err) {
        error = err.message;
      }

      // Retry once if timeout
      if (!isLive && error && error.includes('timeout')) {
        try {
          const res = await fetch(item.applyUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            signal: AbortSignal.timeout(12000),
            redirect: 'follow'
          });
          statusCode = res.status;
          isLive = res.status >= 200 && res.status < 400;
        } catch (e2) {
          error = e2.message;
        }
      }

      if (isLive) {
        verifiedList.push({ id: item.id, company: item.company.name, title: item.title, applyUrl: item.applyUrl, stipendMin: item.stipendMin, statusCode });
      } else {
        closedList.push({ id: item.id, company: item.company.name, title: item.title, applyUrl: item.applyUrl, reason: `HTTP ${statusCode || 'TIMEOUT'} (${error || 'failed'})` });
      }
    }));
    process.stdout.write(`Processed ${Math.min(i + batchSize, openList.length)}/${openList.length} listings...\r`);
  }

  console.log('\n\nLink testing finished.');
  console.log(`Live Verified: ${verifiedList.length}`);
  console.log(`To Close: ${closedList.length}`);

  // Update verified items with current timestamp
  const now = new Date();
  for (const v of verifiedList) {
    await prisma.internship.update({
      where: { id: v.id },
      data: {
        lastVerifiedAt: now,
        lastSeenAt: now,
        status: 'OPEN'
      }
    });
  }

  // Close any broken or disqualified listings
  for (const c of closedList) {
    console.log(`❌ Closing [${c.company}] ${c.title}: ${c.reason}`);
    await prisma.internship.update({
      where: { id: c.id },
      data: {
        status: 'CLOSED',
        lastVerifiedAt: now
      }
    });
  }

  const finalOpenCount = await prisma.internship.count({ where: { status: 'OPEN' } });
  const finalClosedCount = await prisma.internship.count({ where: { status: 'CLOSED' } });

  console.log('\n================================================================');
  console.log(`✅ FINAL DATABASE STATUS:`);
  console.log(`   OPEN Internships:   ${finalOpenCount}`);
  console.log(`   CLOSED Internships: ${finalClosedCount}`);
  console.log('================================================================\n');

  console.log('Top Open Internships (Sample of Refreshed 100% Direct Links):');
  const sample = verifiedList.slice(0, 15);
  for (const s of sample) {
    console.log(`• [₹${s.stipendMin.toLocaleString('en-IN')}/mo] ${s.company} - ${s.title}`);
    console.log(`  🔗 ${s.applyUrl}`);
  }
}

refreshAllLinks()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
