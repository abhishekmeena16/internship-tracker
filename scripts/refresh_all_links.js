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

async function testHttpUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow'
    });
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (err) {
    // Retry once on timeout
    try {
      const res2 = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(12000),
        redirect: 'follow'
      });
      return { ok: res2.status >= 200 && res2.status < 400, status: res2.status };
    } catch (e2) {
      return { ok: false, status: 0, error: e2.message };
    }
  }
}

async function runRefresh() {
  console.log('================================================================');
  console.log('🔄 REFRESHING, CANONICALIZING & AUDITING ALL INTERNSHIP LINKS');
  console.log('================================================================\n');

  // STEP 1: Fetch all currently OPEN listings
  const initialOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: [{ stipendMin: 'desc' }, { id: 'asc' }]
  });

  console.log(`Auditing ${initialOpen.length} listings currently in OPEN status...`);

  // STEP 2: Canonicalize URLs in place
  for (const item of initialOpen) {
    const canonical = canonicalizeUrl(item.applyUrl);
    if (canonical !== item.applyUrl) {
      console.log(`[URL Upgrade] ${item.company.name} -> ${canonical}`);
      await prisma.internship.update({
        where: { id: item.id },
        data: { applyUrl: canonical }
      });
      item.applyUrl = canonical;
    }
  }

  // STEP 3: Deduplicate across titles, tokens, and identical targets
  const titleMap = new Map();
  const tokenMap = new Map();
  const urlMap = new Map();
  const duplicatesToClose = [];
  const candidates = [];

  for (const item of initialOpen) {
    const compName = item.company.name.toLowerCase().trim();
    const normTitle = item.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const titleKey = `${compName}|${normTitle}`;

    // Token from URL (e.g. gh_jid=8184771, token=8184771, /jobs/10498382, _JR107694)
    let token = null;
    const m = item.applyUrl.match(/(?:token=|gh_jid=)([\d]+)/i) || 
              item.applyUrl.match(/\/jobs\/([\d]+)/i) ||
              item.applyUrl.match(/_([A-Z0-9-]+)$/i);
    if (m) {
      token = `${compName}|token|${m[1].toLowerCase()}`;
    }

    const cleanUrl = item.applyUrl.split('?')[0];

    let isDup = false;
    let dupReason = '';

    if (token && tokenMap.has(token)) {
      isDup = true;
      dupReason = `Duplicate token: ${token}`;
    } else if (titleMap.has(titleKey)) {
      isDup = true;
      dupReason = `Duplicate title: ${item.title}`;
    } else if (urlMap.has(cleanUrl)) {
      isDup = true;
      dupReason = `Duplicate URL: ${cleanUrl}`;
    }

    if (isDup) {
      duplicatesToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: dupReason });
    } else {
      titleMap.set(titleKey, item);
      if (token) tokenMap.set(token, item);
      urlMap.set(cleanUrl, item);
      candidates.push(item);
    }
  }

  if (duplicatesToClose.length > 0) {
    console.log(`\nClosing ${duplicatesToClose.length} duplicates...`);
    for (const d of duplicatesToClose) {
      console.log(`  ❌ [${d.company}] ${d.title} (${d.reason})`);
      await prisma.internship.update({
        where: { id: d.id },
        data: { status: 'CLOSED' }
      });
    }
  }

  // STEP 4: Live HTTP Health Check & Rule Enforcement
  console.log(`\nTesting ${candidates.length} unique candidates with live HTTP requests...`);
  const liveVerified = [];
  const failedToClose = [];

  const batchSize = 10;
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    await Promise.all(batch.map(async (item) => {
      // 1. Stipend constraint: Must be >= 30,000 INR
      if (!item.stipendMin || item.stipendMin < 30000) {
        failedToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: `Stipend ₹${item.stipendMin} is below ₹30,000 floor` });
        return;
      }

      // 2. Good company filter
      if (!isGoodCompany(item.company.name)) {
        failedToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: `Company not in approved tier-1 list` });
        return;
      }

      // 3. Genuine student internship/trainee
      const t = item.title.toLowerCase();
      if (!/\b(intern|internship|trainee|apprentice|fellow|summer analyst)\b/.test(t) ||
          /\b(senior|staff|lead|principal|director|manager)\b/.test(t)) {
        failedToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: `Not a student internship title: ${item.title}` });
        return;
      }

      // 4. Zero generic URLs
      const u = item.applyUrl.toLowerCase();
      if (u.endsWith('/careers') || u.endsWith('/jobs') || u.includes('/search?') || u.includes('/careers?') || u.endsWith('/campus')) {
        failedToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: `Generic portal URL: ${item.applyUrl}` });
        return;
      }

      // 5. Test live HTTP connection
      const res = await testHttpUrl(item.applyUrl);
      if (res.ok) {
        liveVerified.push({ ...item, statusCode: res.status });
      } else {
        failedToClose.push({ id: item.id, company: item.company.name, title: item.title, reason: `HTTP status ${res.status || 'TIMEOUT'} (${res.error || 'unreachable'})` });
      }
    }));
    process.stdout.write(`Processed ${Math.min(i + batchSize, candidates.length)}/${candidates.length} candidates...\r`);
  }

  console.log('\n\nLive testing completed.');
  console.log(`Live Verified: ${liveVerified.length}`);
  console.log(`Failed/Closed: ${failedToClose.length}`);

  const now = new Date();

  // Mark all live verified items with fresh timestamp
  for (const v of liveVerified) {
    await prisma.internship.update({
      where: { id: v.id },
      data: {
        lastVerifiedAt: now,
        lastSeenAt: now,
        status: 'OPEN'
      }
    });
  }

  // Close failing items
  for (const f of failedToClose) {
    console.log(`  ❌ Closing [${f.company}] ${f.title}: ${f.reason}`);
    await prisma.internship.update({
      where: { id: f.id },
      data: {
        status: 'CLOSED',
        lastVerifiedAt: now
      }
    });
  }

  // STEP 5: Final Summary
  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });
  const finalClosedCount = await prisma.internship.count({ where: { status: 'CLOSED' } });

  console.log('\n================================================================');
  console.log(`✅ FINAL REFRESHED STATUS:`);
  console.log(`   OPEN Internships:   ${finalOpen.length}`);
  console.log(`   CLOSED Internships: ${finalClosedCount}`);
  console.log(`   Minimum Stipend:    ₹${Math.min(...finalOpen.map(o => o.stipendMin)).toLocaleString('en-IN')}/mo`);
  console.log(`   Unique Companies:   ${new Set(finalOpen.map(o => o.company.name)).size}`);
  console.log('================================================================\n');

  console.log('Top 20 Verified Live Direct Openings:');
  for (const item of finalOpen.slice(0, 20)) {
    console.log(`• [₹${item.stipendMin.toLocaleString('en-IN')}/mo] ${item.company.name} - ${item.title}`);
    console.log(`  🔗 ${item.applyUrl}`);
  }
}

runRefresh()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
