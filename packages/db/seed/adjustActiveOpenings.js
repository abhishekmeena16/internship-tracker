import { prisma } from '../index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const activelyHiringCompanies = new Set([
  // BIG TECH
  'Google', 'Amazon', 'Microsoft', 'Meta', 'Salesforce', 'Adobe', 'Oracle',
  'Cisco', 'Uber', 'Atlassian', 'Intuit', 'PayPal', 'Nutanix', 'ServiceNow', 'SAP Labs India',

  // FINANCE & BANKING
  'Goldman Sachs', 'JPMorgan Chase', 'Morgan Stanley', 'American Express', 'Visa', 'Mastercard', 'Barclays',

  // INDIAN FINTECH & STARTUPS
  'Razorpay', 'PhonePe', 'Paytm', 'CRED', 'Zerodha', 'Groww', 'PolicyBazaar',

  // SEMICONDUCTOR
  'Qualcomm', 'Nvidia', 'Intel', 'AMD', 'Texas Instruments', 'Samsung R&D Institute India', 'Micron Technology', 'Western Digital',

  // INDIAN ECOMM & CONSUMER TECH
  'Flipkart', 'Myntra', 'Swiggy', 'Zomato (Eternal)', 'Meesho', 'Urban Company', 'Nykaa', 'MakeMyTrip', 'Delhivery', 'Zoho', 'Freshworks', 'Postman',

  // MNC GCC & IT LEADERS
  'Walmart Global Tech', 'Target India', "Lowe's India", 'Bosch Global Software Technologies', 'Philips Innovation Campus', 'Honeywell Technology Solutions', 'TCS', 'Infosys', 'Wipro', 'Cognizant',

  // QUANT / TRADING
  'D. E. Shaw', 'Arcesium', 'Tower Research Capital', 'AlphaGrep',

  // DATA & CLOUD
  'MongoDB', 'Confluent', 'Palo Alto Networks', 'Datadog', 'Stripe', 'Booking.com',

  // INDIAN FINTECH INNOVATORS
  'Angel One', 'Juspay', 'Pine Labs', 'Cashfree Payments', 'BharatPe', 'Jupiter Money'
]);

async function main() {
  console.log('--- Adjusting Companies & Open Internships ---');

  // 1. Ensure all 210 companies from companies.json are active
  const companiesPath = path.resolve(__dirname, '../../../data/companies.json');
  const companiesData = JSON.parse(fs.readFileSync(companiesPath, 'utf-8'));
  console.log(`Total companies in directory: ${companiesData.length}`);

  for (const comp of companiesData) {
    const slug = comp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'').replace(/^-+/,'');
    await prisma.company.upsert({
      where: { slug },
      update: {
        name: comp.name,
        careerUrl: comp.careerUrl,
        atsType: comp.atsType,
        atsIdentifier: comp.atsIdentifier,
        hqCity: comp.hqCity,
        sector: comp.sector,
        isActive: true
      },
      create: {
        name: comp.name,
        slug,
        careerUrl: comp.careerUrl,
        atsType: comp.atsType,
        atsIdentifier: comp.atsIdentifier,
        hqCity: comp.hqCity,
        sector: comp.sector,
        isActive: true
      }
    });
  }

  // 2. Remove internships for companies that are NOT actively hiring interns
  // First, find the IDs of companies NOT in activelyHiringCompanies
  const allCompanies = await prisma.company.findMany({
    select: { id: true, name: true, slug: true }
  });

  const inactiveCompanyIds = allCompanies
    .filter(c => !activelyHiringCompanies.has(c.name))
    .map(c => c.id);

  console.log(`Identified ${inactiveCompanyIds.length} companies that do not currently have active internship hiring.`);

  // First delete any bookmarks pointing to these internships to prevent foreign key errors
  const internshipsToDelete = await prisma.internship.findMany({
    where: { companyId: { in: inactiveCompanyIds } },
    select: { id: true }
  });
  const internshipIdsToDelete = internshipsToDelete.map(i => i.id);

  if (internshipIdsToDelete.length > 0) {
    await prisma.bookmark.deleteMany({
      where: { internshipId: { in: internshipIdsToDelete } }
    });

    const deleteResult = await prisma.internship.deleteMany({
      where: { id: { in: internshipIdsToDelete } }
    });
    console.log(`Removed ${deleteResult.count} synthetic/closed internships from companies without active openings.`);
  }

  // 3. Verify statistics
  const activeCompaniesCount = await prisma.company.count({ where: { isActive: true } });
  const companiesWithOpen = await prisma.company.count({
    where: {
      isActive: true,
      internships: { some: { status: 'OPEN' } }
    }
  });
  const companiesWithZero = await prisma.company.count({
    where: {
      isActive: true,
      internships: { none: {} }
    }
  });
  const totalOpenInternships = await prisma.internship.count({
    where: { status: 'OPEN' }
  });

  console.log('\n--- VERIFICATION RESULTS ---');
  console.log(`Total Active Companies: ${activeCompaniesCount}`);
  console.log(`Companies with Active Openings (>0): ${companiesWithOpen}`);
  console.log(`Companies with 0 Openings: ${companiesWithZero}`);
  console.log(`Total Open Internships: ${totalOpenInternships}`);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
