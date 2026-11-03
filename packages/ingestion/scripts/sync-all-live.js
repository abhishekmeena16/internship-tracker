/**
 * Live sync entry point — delegates to the automated_refresh_engine.
 *
 * Usage:
 *   CLI:    node packages/ingestion/scripts/sync-all-live.js
 *   Import: import { syncAllLive } from './sync-all-live.js'
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../../db/index.js';

export async function syncAllLive() {
  console.log('\n====================================================');
  console.log('🚀 [INGESTION] STARTING AUTOMATED REFRESH ENGINE v2.0');
  console.log('   Deep ATS API verification + body content checks');
  console.log('====================================================\n');

  const { execSync } = await import('child_process');
  const projectRoot = path.resolve(__dirname, '../../../');

  try {
    execSync('node scripts/automated_refresh_engine.js', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  } catch (err) {
    console.error('Error running automated_refresh_engine.js:', err.message);
  }

  const finalOpen = await prisma.internship.findMany({
    where: { status: 'OPEN' },
    select: { companyId: true },
  });

  const uniqueCompanies = new Set(finalOpen.map(o => o.companyId));
  console.log(`\n✅ Ingestion complete. Open verified internships: ${finalOpen.length} across ${uniqueCompanies.size} companies.\n`);

  return {
    openInternships: finalOpen.length,
    hiringCompanies: uniqueCompanies.size,
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
