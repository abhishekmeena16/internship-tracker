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

function canonicalizeUrl(url) {
  const ghEmbedMatch = url.match(/greenhouse\.io\/embed\/job_app\?for=([a-z0-9_-]+)&token=([0-9]+)/i);
  if (ghEmbedMatch) {
    const slug = ghEmbedMatch[1].toLowerCase();
    const token = ghEmbedMatch[2];
    if (slug === 'stripe') {
      return `https://stripe.com/jobs/search?gh_jid=${token}`;
    }
    if (slug === 'towerresearchcapital') {
      return `https://www.tower-research.com/open-positions/?gh_jid=${token}`;
    }
    return `https://job-boards.greenhouse.io/${slug}/jobs/${token}`;
  }
  return url;
}

function extractRequisitionKey(item) {
  const comp = item.company.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const url = item.applyUrl;

  // 1. Greenhouse token / gh_jid
  const gh = url.match(/(?:token=|gh_jid=)([\d]+)/i) || url.match(/\/jobs\/([\d]+)/i);
  if (gh) {
    return `${comp}|gh|${gh[1]}`;
  }

  // 2. Lever UUID
  const lever = url.match(/jobs\.lever\.co\/[^/]+\/([a-f0-9-]+)/i);
  if (lever) {
    return `${comp}|lever|${lever[1].toLowerCase()}`;
  }

  // 3. Ashby UUID
  const ashby = url.match(/jobs\.ashbyhq\.com\/[^/]+\/([a-f0-9-]+)/i);
  if (ashby) {
    return `${comp}|ashby|${ashby[1].toLowerCase()}`;
  }

  // 4. Workday Job Requisition ID (e.g. JR2024423, R173016, 2604253, JR107694)
  const workday = url.match(/_([A-Z0-9-]+)$/i) || url.match(/\/([A-Z0-9-]+)$/i);
  if (workday) {
    return `${comp}|wd|${workday[1].toUpperCase()}`;
  }

  // 5. Fallback: normalized title
  const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${comp}|title|${normTitle}`;
}

async function testHttpUrl(url) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(8000),
      redirect: 'follow'
    });
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (err) {
    // Retry once on timeout
    try {
      const res2 = await fetch(url, {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(12000),
        redirect: 'follow'
      });
      return { ok: res2.status >= 200 && res2.status < 400, status: res2.status };
    } catch (e2) {
      return { ok: false, status: 0, error: e2.message };
    }
  }
}

async function main() {
  console.log('================================================================');
  console.log('💎 MASTER INTERNSHIP REFRESH, DEDUPLICATION & AUDIT PIPELINE');
  console.log('================================================================\n');

  // Load all candidates with stipend >= 30000
  const allCandidates = await prisma.internship.findMany({
    where: {
      stipendMin: { gte: 30000 },
      source: { in: ['ASHBY', 'LEVER', 'GREENHOUSE', 'DIRECT_REQUISITION', 'UNSTOP', 'SEED'] }
    },
    include: { company: true },
    orderBy: [
      { stipendMin: 'desc' },
      { id: 'asc' }
    ]
  });

  console.log(`Analyzing ${allCandidates.length} candidate positions from database...`);

  // Canonicalize URLs
  for (const c of allCandidates) {
    c.applyUrl = canonicalizeUrl(c.applyUrl);
  }

  // Filter for strict quality
  const filtered = [];
  const rejectedReasons = {};

  for (const item of allCandidates) {
    // 1. Company filter
    if (!isGoodCompany(item.company.name)) {
      rejectedReasons['Not good company'] = (rejectedReasons['Not good company'] || 0) + 1;
      continue;
    }

    // 2. Student internship title only
    const t = item.title.toLowerCase();
    if (!/\b(intern|internship|trainee|apprentice|fellow|summer analyst)\b/.test(t) ||
        /\b(senior|staff|lead|principal|director|manager)\b/.test(t)) {
      rejectedReasons['Not student intern title'] = (rejectedReasons['Not student intern title'] || 0) + 1;
      continue;
    }

    // 3. Zero generic landing pages
    const u = item.applyUrl.toLowerCase();
    if (u.endsWith('/careers') || u.endsWith('/jobs') || u.endsWith('/campus') ||
        u.includes('/search?') || u.includes('/careers?') || u.endsWith('.com/') || u.endsWith('.com')) {
      // Exception: stripe.com/jobs/search?gh_jid=... is a direct requisition redirect
      if (!u.includes('gh_jid=')) {
        rejectedReasons['Generic career page'] = (rejectedReasons['Generic career page'] || 0) + 1;
        continue;
      }
    }

    // 4. Exclude full-time analyst roles without "intern/summer/apprentice"
    if (t.includes('analyst') && !/\b(intern|internship|summer|trainee|apprentice)\b/.test(t)) {
      rejectedReasons['Full time analyst'] = (rejectedReasons['Full time analyst'] || 0) + 1;
      continue;
    }

    filtered.push(item);
  }

  console.log(`Filtered down to ${filtered.length} high-quality candidate positions.`);
  console.log('Filtered reasons:', rejectedReasons);

  // Group by unique requisition key
  const reqMap = new Map();
  const duplicatesToClose = [];

  for (const item of filtered) {
    const key = extractRequisitionKey(item);
    if (!reqMap.has(key)) {
      reqMap.set(key, item);
    } else {
      const existing = reqMap.get(key);
      // Keep the one with highest stipend or better URL
      if (item.stipendMin > existing.stipendMin) {
        duplicatesToClose.push(existing.id);
        reqMap.set(key, item);
      } else {
        duplicatesToClose.push(item.id);
      }
    }
  }

  const distinctCandidates = Array.from(reqMap.values());
  console.log(`\nDistinct unique requisitions to verify: ${distinctCandidates.length}`);
  console.log(`Duplicate IDs to mark CLOSED: ${duplicatesToClose.length}`);

  if (duplicatesToClose.length > 0) {
    await prisma.internship.updateMany({
      where: { id: { in: duplicatesToClose } },
      data: { status: 'CLOSED' }
    });
  }

  // Concurrently test all distinct candidates with live HTTP requests
  console.log(`\nStarting live HTTP audit in batches of 10...`);
  const liveVerified = [];
  const deadPositions = [];

  const batchSize = 10;
  for (let i = 0; i < distinctCandidates.length; i += batchSize) {
    const batch = distinctCandidates.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      const res = await testHttpUrl(item.applyUrl);
      if (res.ok) {
        liveVerified.push({ ...item, statusCode: res.status });
      } else {
        deadPositions.push({ id: item.id, company: item.company.name, title: item.title, url: item.applyUrl, reason: `HTTP ${res.status || 'TIMEOUT'} (${res.error || 'unreachable'})` });
      }
    }));
    process.stdout.write(`Verified ${Math.min(i + batchSize, distinctCandidates.length)}/${distinctCandidates.length} positions...\r`);
  }

  console.log('\n\nLive verification complete.');
  console.log(`✅ Live Verified (HTTP 200/3xx): ${liveVerified.length}`);
  console.log(`❌ Dead/Unreachable: ${deadPositions.length}`);

  const now = new Date();

  // Update verified openings
  const liveVerifiedIds = liveVerified.map(v => v.id);
  for (const v of liveVerified) {
    await prisma.internship.update({
      where: { id: v.id },
      data: {
        status: 'OPEN',
        applyUrl: v.applyUrl,
        lastVerifiedAt: now,
        lastSeenAt: now
      }
    });
  }

  // Ensure all other positions in the database are marked CLOSED
  const closedRemaining = await prisma.internship.updateMany({
    where: {
      id: { notIn: liveVerifiedIds },
      status: 'OPEN'
    },
    data: {
      status: 'CLOSED',
      lastVerifiedAt: now
    }
  });
  console.log(`Closed ${closedRemaining.count} unverified or duplicate open positions.`);

  // Final check: count OPEN and CLOSED
  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });
  const finalClosedCount = await prisma.internship.count({ where: { status: 'CLOSED' } });

  console.log('\n================================================================');
  console.log(`🏆 FINAL VERIFIED DATABASE STATUS:`);
  console.log(`   OPEN Internships:   ${finalOpen.length}`);
  console.log(`   CLOSED Internships: ${finalClosedCount}`);
  console.log(`   Minimum Stipend:    ₹${Math.min(...finalOpen.map(o => o.stipendMin)).toLocaleString('en-IN')}/mo`);
  console.log(`   Unique Companies:   ${new Set(finalOpen.map(o => o.company.name)).size}`);
  console.log('================================================================\n');

  const compBreakdown = {};
  for (const o of finalOpen) {
    compBreakdown[o.company.name] = (compBreakdown[o.company.name] || 0) + 1;
  }
  console.log('Company Breakdown:');
  for (const [c, count] of Object.entries(compBreakdown).sort((a,b) => b[1] - a[1])) {
    console.log(`  ${c}: ${count}`);
  }

  console.log('\nTop 25 Verified Live Direct Internships:');
  for (const item of finalOpen.slice(0, 25)) {
    console.log(`• [₹${item.stipendMin.toLocaleString('en-IN')}/mo] ${item.company.name} - ${item.title}`);
    console.log(`  🔗 ${item.applyUrl}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
