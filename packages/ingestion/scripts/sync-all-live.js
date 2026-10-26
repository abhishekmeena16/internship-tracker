import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../../db/index.js';
import { classifyRole } from '../normalize/classifier.js';
import { extractSkills, extractStipend, extractDuration, extractEligibility, extractTargetDegrees } from '../normalize/extractor.js';
import { cleanDescription } from '../normalize/cleaner.js';
import { generateHash } from '../lib/hash.js';
import { verifyUrl } from '../lib/urlVerifier.js';

// Unreliable company patterns to filter out
const UNRELIABLE_PATTERNS = [
  /instawork/i, /weekday/i, /forma\.ai/i, /sprinto/i,
  /airbound/i, /bureau/i, /human archive/i, /meraki-labs/i,
  /libra ai/i, /veyra ai/i, /aalteon/i, /span\b/i,
  /interview kickstart/i
];

function isReliableCompany(name) {
  if (!name) return false;
  if (UNRELIABLE_PATTERNS.some(p => p.test(name))) return false;
  return true;
}

function canonicalizeUrl(url) {
  if (!url) return url;
  const ghEmbed = url.match(/greenhouse\.io\/embed\/job_app\?for=([a-z0-9_-]+)&token=([0-9]+)/i);
  if (ghEmbed) {
    const slug = ghEmbed[1].toLowerCase();
    const token = ghEmbed[2];
    if (slug === 'stripe') return `https://stripe.com/jobs/search?gh_jid=${token}`;
    if (slug === 'towerresearchcapital') return `https://www.tower-research.com/open-positions/?gh_jid=${token}`;
    if (slug === 'groww') return `https://job-boards.eu.greenhouse.io/groww/jobs/${token}`;
    return `https://job-boards.greenhouse.io/${slug}/jobs/${token}`;
  }
  return url;
}

export async function syncAllLive() {
  console.log('\n====================================================');
  console.log('🚀 [INGESTION] STARTING LIVE SYNC CYCLE (2-3 MONTHS, 30K+ STIPEND)');
  console.log('====================================================\n');

  // Run the curated redo pipeline script which handles live verification and DB updates
  const { execSync } = await import('child_process');
  const projectRoot = path.resolve(__dirname, '../../../');
  
  try {
    execSync('node scripts/redo_curated_internships.js', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('Error running redo_curated_internships.js:', err.message);
  }

  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    select: { companyId: true }
  });

  const uniqueCompanies = new Set(finalOpen.map(o => o.companyId));
  console.log(`\n✅ Ingestion complete. Open verified internships: ${finalOpen.length} across ${uniqueCompanies.size} companies.\n`);

  return {
    openInternships: finalOpen.length,
    hiringCompanies: uniqueCompanies.size
  };
}

// Allow direct CLI execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncAllLive()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
