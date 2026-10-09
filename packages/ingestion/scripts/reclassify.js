import prisma from '../lib/prisma.js';
import { classifyRole } from '../normalize/classifier.js';
import { extractSkills, extractStipend, extractDuration } from '../normalize/extractor.js';
import { isInternship } from '../normalize/filter.js';

async function run() {
  console.log('Starting re-classification and refinement...');
  const internships = await prisma.internship.findMany({
    include: { company: true }
  });

  console.log(`Found ${internships.length} internships to review.`);
  let updatedCount = 0;
  let closedFalsePositives = 0;

  for (const item of internships) {
    // If it was ingested from live and is actually a recruiter or non-intern, close it
    if (item.source !== 'SEED' && !isInternship(item.title, item.description)) {
      await prisma.internship.update({
        where: { id: item.id },
        data: { status: 'CLOSED' }
      });
      closedFalsePositives++;
      continue;
    }

    const newRole = classifyRole(item.title, item.description);
    const newSkills = extractSkills(item.title, item.description);
    const stipend = extractStipend(item.description);
    const duration = extractDuration(item.description);

    const dataToUpdate = {
      roleCategory: newRole,
      skills: newSkills.length > 0 ? newSkills : item.skills
    };

    if (item.stipendMin === null && stipend.min !== null) {
      dataToUpdate.stipendMin = stipend.min;
      dataToUpdate.stipendMax = stipend.max || stipend.min;
      dataToUpdate.currency = stipend.currency || 'INR';
    }

    if (item.durationMonths === null && duration !== null) {
      dataToUpdate.durationMonths = duration;
    }

    await prisma.internship.update({
      where: { id: item.id },
      data: dataToUpdate
    });
    updatedCount++;
  }

  console.log(`Refined ${updatedCount} internships. Closed ${closedFalsePositives} non-internship listings.`);

  // Display role distribution
  const roles = await prisma.internship.groupBy({
    by: ['roleCategory'],
    where: { status: 'OPEN' },
    _count: true
  });
  console.log('Active internships role distribution:', roles);

  await prisma.$disconnect();
}

run().catch(console.error);
