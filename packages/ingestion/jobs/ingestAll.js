import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
import prisma from '../lib/prisma.js';
import { ingestCompany } from './ingestCompany.js';

// Helper to wait for a specific duration
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('Starting global ingestion run...');

  try {
    const activeCompanies = await prisma.company.findMany({
      where: {
        isActive: true,
        NOT: {
          atsType: 'CUSTOM'
        }
      }
    });

    console.log(`Found ${activeCompanies.length} companies to process.`);

    for (const company of activeCompanies) {
      if (!company.atsIdentifier) {
        console.warn(`Skipping company ${company.name} - missing ATS Identifier`);
        continue;
      }

      await ingestCompany(company.id);

      // Wait 2-5 seconds between companies to be polite to APIs
      const waitTime = Math.floor(Math.random() * 3000) + 2000;
      console.log(`Waiting ${waitTime}ms before next company...`);
      await delay(waitTime);
    }

    console.log('Global ingestion run completed.');
  } catch (error) {
    console.error('Fatal error during global ingestion run:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script directly if this file is executed
if (process.argv[1] && process.argv[1].endsWith('ingestAll.js')) {
  main();
}
