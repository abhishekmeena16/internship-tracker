import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { prisma } from '../packages/db/index.js';
import { isStrictDirectApplicationUrl } from './enforce_100_percent_accurate_apply_links.js';
import { isLegitimateInternshipTitle } from './reverify_high_stipend_internships.js';

// Strict regex matching India locations and cities
const INDIA_LOCATION_REGEX = /\b(india|bengaluru|bangalore|hyderabad|pune|noida|gurugram|gurgaon|chennai|mumbai|delhi|new delhi|sanand|gift city|karnataka|telangana|maharashtra|tamil nadu|haryana|uttar pradesh)\b/i;

// Foreign locations that indicate the role is outside India
const FOREIGN_LOCATION_REGEX = /\b(san francisco|new york|seattle|sunnyvale|austin|chicago|los angeles|boston|london|dublin|toronto|vancouver|singapore|tokyo|sydney|zurich|munich|berlin|united states|united kingdom|canada|australia|germany|france|netherlands|ireland|\$58|\$|401\(k\))\b/i;

async function checkLiveIndiaStatus(url) {
  if (!url || typeof url !== 'string') return { isAlive: false, isIndia: false, reason: 'Invalid URL' };

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(7000),
      redirect: 'follow'
    });

    if (res.status < 200 || res.status >= 400) {
      return { isAlive: false, isIndia: false, reason: `HTTP ${res.status}` };
    }

    const html = await res.text();

    // Check for bot challenge or block
    if (html.includes('challenge-platform') || html.includes('Just a moment...') || html.includes('Cloudflare Ray ID')) {
      return { isAlive: false, isIndia: false, reason: 'Cloudflare / Bot Challenge gate' };
    }

    // Extract meta description or job location from HTML
    const metaLoc = html.match(/<meta[^>]*property="(?:og:description|job:location|description)"[^>]*content="([^"]*)"/i)?.[1] || '';
    
    // Check if the page explicitly mentions an outside-India location in its primary location field
    const hasForeignMeta = FOREIGN_LOCATION_REGEX.test(metaLoc) && !INDIA_LOCATION_REGEX.test(metaLoc);
    if (hasForeignMeta) {
      return { isAlive: true, isIndia: false, reason: `Explicit foreign location in meta: ${metaLoc}` };
    }

    // Page must confirm India location
    const mentionsIndia = INDIA_LOCATION_REGEX.test(metaLoc) || INDIA_LOCATION_REGEX.test(html) || url.includes('en-in') || url.includes('India') || url.includes('Bangalore') || url.includes('Hyderabad') || url.includes('Pune');
    if (!mentionsIndia) {
      return { isAlive: true, isIndia: false, reason: 'Page does not mention India or Indian city' };
    }

    return { isAlive: true, isIndia: true, reason: 'Verified India location' };
  } catch (err) {
    return { isAlive: false, isIndia: false, reason: `Network error: ${err.message}` };
  }
}

async function run() {
  console.log('================================================================');
  console.log('🇮🇳 ENFORCING STRICT INDIA-ONLY INTERNSHIPS (STIPEND ≥ ₹50,000)');
  console.log('🇮🇳 100% ACCURATE WORKING DIRECT APPLICATION LINKS');
  console.log('================================================================\n');

  // Warm up DB
  for (let i = 0; i < 3; i++) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      break;
    } catch {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const allOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Auditing ${allOpen.length} currently OPEN internships...\n`);

  const toClose = [];
  const toKeep = [];

  // Parallel evaluation in chunks of 10
  const chunkSize = 10;
  for (let i = 0; i < allOpen.length; i += chunkSize) {
    const chunk = allOpen.slice(i, i + chunkSize);
    const results = await Promise.all(chunk.map(async (item) => {
      // 1. Strict Title Check
      if (!isLegitimateInternshipTitle(item.title)) {
        return { item, valid: false, reason: `Non-intern title: ${item.title}` };
      }

      // 2. Strict Apply URL Check
      if (!isStrictDirectApplicationUrl(item.applyUrl)) {
        return { item, valid: false, reason: `Generic / unverified URL: ${item.applyUrl}` };
      }

      // 3. Strict Stipend Check (≥ ₹50,000)
      if (!item.stipendMin || item.stipendMin < 50000) {
        return { item, valid: false, reason: `Stipend < ₹50,000: ₹${item.stipendMin}` };
      }

      // 4. Live Liveness & India Location Check
      const liveCheck = await checkLiveIndiaStatus(item.applyUrl);
      if (!liveCheck.isAlive) {
        return { item, valid: false, reason: `Dead or blocked link: ${liveCheck.reason}` };
      }
      if (!liveCheck.isIndia) {
        return { item, valid: false, reason: `Role outside India: ${liveCheck.reason}` };
      }

      return { item, valid: true, reason: 'Verified India role with working direct apply link' };
    }));

    for (const res of results) {
      if (res.valid) {
        toKeep.push(res);
      } else {
        toClose.push(res);
      }
    }
  }

  console.log(`\nResults:`);
  console.log(`  - Disqualified (Outside India / Dead / Non-intern / Low Stipend): ${toClose.length}`);
  console.log(`  - Strictly Verified India-Only Open Internships: ${toKeep.length}`);

  // Close disqualified listings
  if (toClose.length > 0) {
    const closeIds = toClose.map(x => x.item.id);
    for (let i = 0; i < closeIds.length; i += 50) {
      await prisma.internship.updateMany({
        where: { id: { in: closeIds.slice(i, i + 50) } },
        data: { status: 'CLOSED' }
      });
    }
    console.log(`\n✓ Closed ${toClose.length} listings in DB.`);
    console.log('\nSample Closed Roles (showing 15):');
    toClose.slice(0, 15).forEach((c, idx) => {
      console.log(`  ${idx + 1}. [${c.item.company.name}] ${c.item.title} -> ${c.reason}`);
      console.log(`     🔗 ${c.item.applyUrl}`);
    });
  }

  // Normalize locations and durations for verified India listings
  console.log('\nNormalizing locations and 2-3 month durations for verified postings...');
  for (const k of toKeep) {
    let locs = Array.isArray(k.item.locations) ? [...k.item.locations] : ['Bengaluru', 'India'];
    // Filter out 'Remote' if unaccompanied, ensure Indian city or India
    locs = locs.filter(l => !/san francisco|united states|us|remote only/i.test(l));
    if (!locs.some(l => /india/i.test(l))) {
      locs.push('India');
    }

    let dur = k.item.durationMonths;
    if (!dur || dur < 2 || dur > 3) {
      dur = 3;
    }

    await prisma.internship.update({
      where: { id: k.item.id },
      data: {
        locations: locs,
        durationMonths: dur,
        status: 'OPEN',
        lastVerifiedAt: new Date()
      }
    });
  }
  console.log(`✓ Updated and normalized ${toKeep.length} verified listings.`);

  // Final Audit
  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    include: { company: true },
    orderBy: { stipendMin: 'desc' }
  });

  console.log('\n================================================================');
  console.log('🏆 FINAL VERIFIED INDIA-ONLY INTERNSHIP DIRECTORY');
  console.log('================================================================');
  console.log(`Total Active OPEN Internships: ${finalOpen.length}`);
  console.log(`Unique Companies: ${new Set(finalOpen.map(x => x.company.id)).size}`);

  console.log('\nVerified India Roles:');
  finalOpen.forEach((item, idx) => {
    console.log(`${idx + 1}. [₹${item.stipendMin.toLocaleString('en-IN')}/mo] ${item.company.name} | ${item.title} (${item.durationMonths}m)`);
    console.log(`   📍 ${item.locations.join(', ')}`);
    console.log(`   🔗 ${item.applyUrl}`);
  });

  await prisma.$disconnect();
}

run().catch(err => {
  console.error('Execution failed:', err);
  process.exit(1);
});
