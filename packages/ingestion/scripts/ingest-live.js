import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../../db/index.js';
import { getConnector } from '../connectors/index.js';
import { normalizeInternship } from '../normalize/index.js';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function ingestLiveATS(limit = null) {
  console.log('====================================================');
  console.log('🚀 STARTING LIVE ATS INGESTION (Greenhouse, Ashby, Lever)');
  console.log('====================================================\n');

  const companies = await prisma.company.findMany({
    where: {
      isActive: true,
      NOT: { atsType: 'CUSTOM' }
    },
    orderBy: { name: 'asc' },
    take: limit || undefined
  });

  console.log(`Found ${companies.length} companies configured with Live ATS connectors.\n`);

  let totalLiveJobsFound = 0;
  let totalIndiaInternshipsUpserted = 0;
  const liveResults = [];

  for (const company of companies) {
    if (!company.atsIdentifier) continue;

    const connector = getConnector(company.atsType);
    if (!connector) {
      console.warn(`[Skip] No connector for ${company.atsType} (${company.name})`);
      continue;
    }

    try {
      process.stdout.write(`Fetching [${company.atsType}] ${company.name}... `);
      const rawJobs = await connector.fetchInternships(company);
      totalLiveJobsFound += rawJobs.length;

      const validInternships = [];
      for (const raw of rawJobs) {
        try {
          const normalized = normalizeInternship(raw, company);
          if (normalized) {
            validInternships.push(normalized);
          }
        } catch (err) {
          // ignore normalization parse errors
        }
      }

      console.log(`${rawJobs.length} raw jobs -> ${validInternships.length} India intern openings.`);

      for (const intern of validInternships) {
        const upserted = await prisma.internship.upsert({
          where: { dedupHash: intern.dedupHash },
          update: {
            title: intern.title,
            applyUrl: intern.applyUrl,
            description: intern.description,
            locations: intern.locations,
            isRemote: intern.isRemote,
            roleCategory: intern.roleCategory,
            skills: intern.skills,
            status: 'OPEN',
            source: 'LIVE_ATS',
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date()
          },
          create: {
            ...intern,
            source: 'LIVE_ATS',
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date()
          }
        });

        totalIndiaInternshipsUpserted++;
        liveResults.push({
          company: company.name,
          title: intern.title,
          jobId: intern.sourceJobId,
          url: intern.applyUrl
        });
      }

      await delay(600); // polite rate limit
    } catch (err) {
      console.error(`\n❌ Error fetching ${company.name}:`, err.message);
    }
  }

  console.log('\n====================================================');
  console.log(`🏁 INGESTION COMPLETE`);
  console.log(`Total Live Jobs Processed: ${totalLiveJobsFound}`);
  console.log(`Total Live India Internships Synced: ${totalIndiaInternshipsUpserted}`);
  console.log('====================================================\n');

  if (liveResults.length > 0) {
    console.log('Sample Live Synced Internships:');
    liveResults.slice(0, 10).forEach(r => {
      console.log(`- [${r.company}] ${r.title} (ID: ${r.jobId}) -> ${r.url}`);
    });
  }

  return { totalLiveJobsFound, totalIndiaInternshipsUpserted, liveResults };
}

if (process.argv[1] && process.argv[1].endsWith('ingest-live.js')) {
  ingestLiveATS().then(() => prisma.$disconnect()).catch(console.error);
}
