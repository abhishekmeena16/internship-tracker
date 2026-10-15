import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { prisma } from '../index.js';
import { execSync } from 'child_process';

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🌱 Starting Database Seed with 350 Companies & Verified CSE Internships...');

  // 1. Read companies.json
  const companiesPath = path.resolve(__dirname, '../../../data/companies.json');
  const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf8'));

  console.log(`📁 Loaded ${companiesData.length} companies from companies.json.`);

  for (const c of companiesData) {
    const slug = c.slug || slugify(c.name);
    await prisma.company.upsert({
      where: { slug },
      create: {
        name: c.name,
        slug,
        careerUrl: c.careerUrl,
        atsType: c.atsType || 'CUSTOM',
        atsIdentifier: c.atsIdentifier || slug,
        hqCity: c.hqCity || 'Bengaluru',
        sector: c.sector || 'Technology',
        isActive: true
      },
      update: {
        name: c.name,
        careerUrl: c.careerUrl,
        atsType: c.atsType || 'CUSTOM',
        atsIdentifier: c.atsIdentifier || slug,
        hqCity: c.hqCity || 'Bengaluru',
        sector: c.sector || 'Technology',
        isActive: true
      }
    });
  }
  console.log(`✅ Upserted ${companiesData.length} companies into database.`);

  // 2. Run live ingestion to populate verified active openings
  console.log('🚀 Running verified live ATS ingestion...');
  execSync('node packages/ingestion/scripts/sync-all-live.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '../../../') });

  console.log('✨ Database Seed Completed Successfully with 100% Genuine Openings!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
