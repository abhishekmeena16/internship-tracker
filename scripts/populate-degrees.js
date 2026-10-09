import { prisma } from '../packages/db/index.js';

export function extractTargetDegrees(eligibility = '', title = '', description = '') {
  const combined = `${eligibility || ''} ${title || ''} ${description || ''}`.toLowerCase();
  const degrees = new Set();

  // 1. PhD / Doctorate
  if (/\b(ph\.?d|doctorate|doctoral|research intern \(phd\))\b/i.test(combined)) {
    degrees.add('PHD');
  }

  // 2. M.Tech / ME / MS / Masters
  if (/\b(m\.?tech|m\.?e\b|master|masters|ms\b|postgrad|postgraduate|m\.s\b|dual degree)\b/i.test(combined)) {
    degrees.add('MTECH');
  }

  // 3. B.Tech / BE / Bachelors
  if (/\b(b\.?tech|b\.?e\b|bachelor|bachelors|undergrad|undergraduate)\b/i.test(combined) || degrees.size === 0) {
    degrees.add('BTECH');
  }

  // 4. BCA / MCA
  if (/\b(bca|mca|computer applications)\b/i.test(combined)) {
    if (/\bmca\b/i.test(combined)) degrees.add('MCA');
    if (/\bbca\b/i.test(combined)) degrees.add('BCA');
  }

  // 5. BSc / MSc
  if (/\b(b\.?sc|m\.?sc|bachelor of science|master of science)\b/i.test(combined)) {
    if (/\b(m\.?sc|master of science)\b/i.test(combined)) degrees.add('MSC');
    if (/\b(b\.?sc|bachelor of science)\b/i.test(combined)) degrees.add('BSC');
  }

  // General bachelor/master phrasing
  if (/\bbachelor(?:'s)?\b/i.test(combined) || /\bundergrad/i.test(combined)) {
    degrees.add('BTECH');
    degrees.add('BCA');
    degrees.add('BSC');
  }
  if (/\bmaster(?:'s)?\b/i.test(combined) || /\bpostgrad/i.test(combined) || /\bdual degree\b/i.test(combined)) {
    degrees.add('MTECH');
    degrees.add('MCA');
    degrees.add('MSC');
  }

  // Standard engineering roles that are open to B.Tech also commonly accept BCA/MCA/BSc when CS/IT/software fundamentals are matched
  if (!degrees.has('PHD')) {
    degrees.add('BTECH');
    if (/computer science|information technology|\bcse\b|\bit\b|software/i.test(combined)) {
      degrees.add('MTECH');
      degrees.add('BCA');
      degrees.add('MCA');
      degrees.add('BSC');
      degrees.add('MSC');
    }
  }

  return Array.from(degrees);
}

async function main() {
  const jobs = await prisma.internship.findMany({
    select: { id: true, title: true, eligibility: true, description: true }
  });

  console.log(`Processing ${jobs.length} internships for target degrees...`);
  for (const j of jobs) {
    const degs = extractTargetDegrees(j.eligibility, j.title, j.description);
    await prisma.internship.update({
      where: { id: j.id },
      data: { targetDegrees: degs }
    });
  }

  console.log('✅ Updated targetDegrees for all internships!');
  for (const d of ['BTECH', 'MTECH', 'PHD', 'BCA', 'MCA', 'BSC', 'MSC']) {
    const count = await prisma.internship.count({
      where: { status: 'OPEN', targetDegrees: { has: d } }
    });
    console.log(`Degree ${d}: ${count} active internships`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
