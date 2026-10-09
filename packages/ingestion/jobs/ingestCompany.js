import prisma from '../lib/prisma.js';
import { getConnector } from '../connectors/index.js';
import { normalizeInternship } from '../normalize/index.js';

/**
 * Ingest a single company's jobs.
 * @param {number} companyId
 */
export async function ingestCompany(companyId) {
  const company = await prisma.company.findUnique({
    where: { id: companyId }
  });

  if (!company) {
    console.error(`Company with ID ${companyId} not found.`);
    return;
  }

  if (company.atsType === 'CUSTOM' || !company.atsIdentifier) {
    return;
  }

  const connector = getConnector(company.atsType);
  if (!connector) {
    console.warn(`No connector for ATS type ${company.atsType} (${company.name})`);
    return;
  }

  console.log(`Starting ingestion for ${company.name} via ${company.atsType}...`);

  const scrapeRun = await prisma.scrapeRun.create({
    data: {
      companyId: company.id,
      source: company.atsType,
      status: 'RUNNING',
      itemsFound: 0
    }
  });

  try {
    // Fetch raw jobs — connectors now return [] on 404 instead of throwing
    const rawInternships = await connector.fetchInternships(company);

    if (rawInternships.length === 0) {
      console.log(`No jobs found for ${company.name} — board may not exist or be empty.`);
      await prisma.scrapeRun.update({
        where: { id: scrapeRun.id },
        data: {
          status: 'SUCCESS',
          finishedAt: new Date(),
          itemsFound: 0
        }
      });
      return;
    }

    console.log(`Fetched ${rawInternships.length} raw jobs for ${company.name}.`);

    const validInternships = [];
    const seenHashes = new Set();

    for (const raw of rawInternships) {
      try {
        const normalized = normalizeInternship(raw, company);
        if (normalized) {
          validInternships.push(normalized);
          seenHashes.add(normalized.dedupHash);
        }
      } catch (err) {
        console.warn(`  Skipping job "${raw.title}" — normalization error: ${err.message}`);
      }
    }

    console.log(`Normalized to ${validInternships.length} valid internships for ${company.name}.`);

    // Upsert valid internships
    for (const intern of validInternships) {
      try {
        await prisma.internship.upsert({
          where: { dedupHash: intern.dedupHash },
          update: {
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date(),
            status: 'OPEN',
            description: intern.description,
            applyUrl: intern.applyUrl
          },
          create: {
            ...intern,
            lastSeenAt: new Date(),
            lastVerifiedAt: new Date()
          }
        });
      } catch (err) {
        console.warn(`  Failed to upsert "${intern.title}": ${err.message}`);
      }
    }

    // Mark internships NOT seen in this run as CLOSED (expiry logic)
    if (seenHashes.size > 0) {
      const hashArray = Array.from(seenHashes);
      const closedResult = await prisma.internship.updateMany({
        where: {
          companyId: company.id,
          status: 'OPEN',
          source: { not: 'SEED' },
          NOT: {
            dedupHash: {
              in: hashArray
            }
          }
        },
        data: {
          status: 'CLOSED'
        }
      });

      if (closedResult.count > 0) {
        console.log(`Marked ${closedResult.count} previously open internships as CLOSED for ${company.name}.`);
      }
    }

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: 'SUCCESS',
        finishedAt: new Date(),
        itemsFound: validInternships.length
      }
    });

    console.log(`✓ Completed ${company.name}: ${validInternships.length} internships ingested.`);

  } catch (error) {
    console.error(`✗ Error ingesting ${company.name}:`, error.message);

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: 'FAILED',
        finishedAt: new Date(),
        errorMessage: error.message || String(error)
      }
    });
  }
}
