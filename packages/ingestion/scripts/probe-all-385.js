import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyUrl } from '../lib/urlVerifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const companies = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../../data/companies.json'), 'utf8'));

const indiaKeywords = [
  'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai',
  'gurgaon', 'gurugram', 'noida', 'chennai', 'delhi', 'new delhi',
  'delhi ncr', 'kolkata', 'ahmedabad', 'kochi', 'coimbatore', 'chandigarh',
  'indore', 'jaipur', 'karnataka', 'telangana', 'maharashtra', 'haryana',
  'tamil nadu', 'uttar pradesh', 'sanand', 'gujarat', 'gift city'
];

const excludeWords = [
  'internal audit', 'international', 'internal controls', 'internal medicine',
  'recruiter', 'recruiting', 'sourcer', 'talent acquisition', 'expatriate',
  'human resources', 'hr intern', 'video editor', 'graphic design', 'content writer',
  'creative & communications', 'people team', 'onboarding', 'industrial trainee',
  'ca trainee', 'operations associate', 'technician apprentice', 'financial analyst',
  'youtube & content', 'accounting', 'legal intern', 'recruitment', 'hr trainee',
  'search infrastructure intern', 'coordinator', 'business development', 'data entry',
  'founder’s office', "founder's office", 'operations intern', 'finance intern',
  'inventory management', 'operations management', 'trainer intern', 'customer operations',
  'sales intern', 'marketing intern', 'business development intern'
];

function isInternshipRole(title) {
  if (!title) return false;
  const t = title.toLowerCase();
  if (excludeWords.some(w => t.includes(w))) return false;
  return /\b(intern|internship|co-op|coop|trainee|apprentice|apprenticeship|fellow|fellowship)\b/i.test(title);
}

function isIndiaLocation(locationStr, title = '') {
  const combined = `${locationStr || ''} ${title || ''}`.toLowerCase();
  return indiaKeywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(combined));
}

async function mapConcurrent(items, limit, fn) {
  const results = [];
  let index = 0;
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item, index++));
    results.push(p);

    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function probeCompany(comp) {
  const hits = [];
  const slugs = new Set([
    comp.atsIdentifier,
    comp.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    comp.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/,'').replace(/^-+/,'')
  ].filter(Boolean));

  for (const slug of slugs) {
    // 1. Greenhouse
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, {
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        for (const j of data.jobs || []) {
          const loc = j.location?.name || '';
          if (isInternshipRole(j.title) && isIndiaLocation(loc, j.title)) {
            const url = `https://job-boards.greenhouse.io/${slug}/jobs/${j.id}`;
            if (await verifyUrl(url)) {
              console.log(`🎯 [GH] ${comp.name} | ${j.title} | ${loc} | ${url}`);
              hits.push({
                company: comp.name,
                atsType: 'GREENHOUSE',
                slug,
                id: String(j.id),
                title: j.title,
                location: loc,
                url,
                description: j.content || j.title,
                postedAt: j.updated_at
              });
            }
          }
        }
      }
    } catch (e) {}

    // 2. Lever
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, {
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const jobs = await res.json();
        if (Array.isArray(jobs)) {
          for (const j of jobs) {
            const loc = j.categories?.location || '';
            if (isInternshipRole(j.text) && isIndiaLocation(loc, j.text)) {
              const url = `https://jobs.lever.co/${slug}/${j.id}/apply`;
              if (await verifyUrl(url)) {
                console.log(`🎯 [Lever] ${comp.name} | ${j.text} | ${loc} | ${url}`);
                hits.push({
                  company: comp.name,
                  atsType: 'LEVER',
                  slug,
                  id: j.id,
                  title: j.text,
                  location: loc,
                  url,
                  description: j.descriptionPlain || j.text,
                  postedAt: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString()
                });
              }
            }
          }
        }
      }
    } catch (e) {}

    // 3. Ashby
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (res.ok) {
        const data = await res.json();
        for (const j of data.jobs || []) {
          const loc = j.location || (j.secondaryLocations?.map(l => l.location).join(', ')) || '';
          if (isInternshipRole(j.title) && isIndiaLocation(loc, j.title)) {
            const url = `https://jobs.ashbyhq.com/${slug}/${j.id}/application`;
            if (await verifyUrl(url)) {
              console.log(`🎯 [Ashby] ${comp.name} | ${j.title} | ${loc} | ${url}`);
              hits.push({
                company: comp.name,
                atsType: 'ASHBY',
                slug,
                id: j.id,
                title: j.title,
                location: loc,
                url,
                description: j.descriptionHtml || j.title,
                postedAt: j.publishedAt || new Date().toISOString()
              });
            }
          }
        }
      }
    } catch (e) {}
  }

  return hits;
}

async function run() {
  console.log(`🚀 Probing all ${companies.length} companies across GH, Lever, and Ashby with 20 concurrency...`);
  const results = await mapConcurrent(companies, 20, probeCompany);
  const flat = results.flat();
  console.log(`\n✅ Finished probe. Total hits: ${flat.length}`);

  const outPath = path.resolve(__dirname, 'probe-results.json');
  fs.writeFileSync(outPath, JSON.stringify(flat, null, 2));
  console.log(`Saved results to ${outPath}`);
}

run().catch(err => {
  console.error('Error running probe:', err);
  process.exit(1);
});
