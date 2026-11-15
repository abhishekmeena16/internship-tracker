import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../packages/db/index.js';

async function run() {
  console.log('================================================================');
  console.log('🔍 AUDITING ALL UNSTOP INTERNSHIPS (STATUS & REAL STIPEND)');
  console.log('================================================================\n');

  // Neon warm-up
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      break;
    } catch (e) {
      if (attempt === 3) throw e;
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const unstopOpen = await prisma.internship.findMany({
    where: {
      status: 'OPEN',
      applyUrl: { contains: 'unstop.com' }
    },
    include: { company: true }
  });

  console.log(`Found ${unstopOpen.length} currently OPEN Unstop internships.`);

  const toCloseIds = [];
  const validOpen = [];
  const closedReasons = [];

  // Check each in small chunks of 10
  const chunkSize = 10;
  for (let i = 0; i < unstopOpen.length; i += chunkSize) {
    const chunk = unstopOpen.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (item) => {
      const match = item.applyUrl.match(/-(\d+)\/?$/);
      const oppId = match ? match[1] : null;

      if (!oppId) {
        toCloseIds.push(item.id);
        closedReasons.push({ company: item.company.name, title: item.title, reason: 'Invalid Unstop URL' });
        return;
      }

      try {
        const res = await fetch(`https://unstop.com/api/public/opportunity/search-result?id=${oppId}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          },
          signal: AbortSignal.timeout(5000)
        });

        if (!res.ok) {
          toCloseIds.push(item.id);
          closedReasons.push({ company: item.company.name, title: item.title, reason: `Unstop API HTTP ${res.status}` });
          return;
        }

        const json = await res.json();
        const oppData = (json.data?.data || []).find(x => String(x.id) === String(oppId));

        if (!oppData) {
          toCloseIds.push(item.id);
          closedReasons.push({ company: item.company.name, title: item.title, reason: 'Opportunity not found in Unstop search (expired or deleted)' });
          return;
        }

        // Check registration status
        if (oppData.regn_open !== 1) {
          toCloseIds.push(item.id);
          closedReasons.push({ company: item.company.name, title: item.title, reason: `Registration CLOSED on Unstop (regn_open: ${oppData.regn_open})` });
          return;
        }

        // Check real stipend
        const payIn = oppData.jobDetail?.pay_in; // 'monthly' or 'annually'
        const isPaid = oppData.jobDetail?.paid_unpaid === 'paid';
        const rawMin = oppData.jobDetail?.min_salary || 0;
        const rawMax = oppData.jobDetail?.max_salary || 0;

        let monthlyMin = rawMin;
        let monthlyMax = rawMax;
        if (payIn === 'annually' && rawMin > 0) {
          monthlyMin = Math.round(rawMin / 12);
          monthlyMax = Math.round(rawMax / 12);
        }

        if (!isPaid || monthlyMin < 50000) {
          toCloseIds.push(item.id);
          closedReasons.push({
            company: item.company.name,
            title: item.title,
            reason: `Real stipend is ₹${monthlyMin}/mo (${payIn}, paid: ${isPaid}), below ₹50,000 requirement. (Site had ₹${item.stipendMin})`
          });
          return;
        }

        // Genuinely open and >= 50,000
        validOpen.push({
          id: item.id,
          company: item.company.name,
          title: item.title,
          stipendMin: monthlyMin,
          stipendMax: monthlyMax > monthlyMin ? monthlyMax : monthlyMin,
          url: item.applyUrl
        });
      } catch (err) {
        toCloseIds.push(item.id);
        closedReasons.push({ company: item.company.name, title: item.title, reason: `Error: ${err.message}` });
      }
    }));

    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\nClosing ${toCloseIds.length} invalid / closed / low-stipend Unstop listings in DB...`);
  for (let i = 0; i < toCloseIds.length; i += 50) {
    await prisma.internship.updateMany({
      where: { id: { in: toCloseIds.slice(i, i + 50) } },
      data: { status: 'CLOSED' }
    });
  }

  console.log(`Updating ${validOpen.length} verified high-stipend Unstop listings...`);
  for (const v of validOpen) {
    await prisma.internship.update({
      where: { id: v.id },
      data: {
        stipendMin: v.stipendMin,
        stipendMax: v.stipendMax,
        lastVerifiedAt: new Date()
      }
    });
    console.log(`  ✓ KEPT OPEN: [₹${v.stipendMin}/mo] ${v.company} - ${v.title}`);
    console.log(`     🔗 ${v.url}`);
  }

  console.log('\n================================================================');
  console.log('📊 AUDIT SUMMARY');
  console.log('================================================================');
  console.log(`Total Unstop evaluated: ${unstopOpen.length}`);
  console.log(`Closed (Expired / Closed Registration / Stipend < ₹50k): ${toCloseIds.length}`);
  console.log(`Kept OPEN (Genuinely Open & Verified >= ₹50,000): ${validOpen.length}`);

  console.log('\nSample Closed Postings (showing 15):');
  closedReasons.slice(0, 15).forEach((c, idx) => {
    console.log(`${idx + 1}. [${c.company}] ${c.title} -> ${c.reason}`);
  });

  const remainingOpen = await prisma.internship.count({ where: { status: 'OPEN' } });
  console.log(`\nRemaining Total OPEN Internships in Database: ${remainingOpen}`);

  await prisma.$disconnect();
}

run().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
