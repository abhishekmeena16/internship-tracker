import { isInternship } from './filter.js';
import { classifyRole } from './classifier.js';
import { extractStipend, extractDuration, extractSkills } from './extractor.js';
import { generateHash } from '../lib/hash.js';

/**
 * @typedef {import('../connectors/base.js').RawInternship} RawInternship
 */

/**
 * Normalize and enrich a raw internship posting.
 * @param {RawInternship} rawInternship - The raw job data from ATS
 * @param {{ id: number, name: string }} company - The company data
 * @returns {Object|null} Normalized object or null if not an internship
 */
export function normalizeInternship(rawInternship, company) {
  const { sourceJobId, title, location, applyUrl, description, postedAt } = rawInternship;
  
  // 1. Filter
  if (!isInternship(title, description)) {
    return null;
  }

  // 1b. Enforce India location only
  const locationStr = location || 'Not specified';
  const combinedLoc = `${locationStr} ${title}`.toLowerCase();
  const indiaKeywords = [
    'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai',
    'gurgaon', 'gurugram', 'noida', 'chennai', 'delhi', 'new delhi',
    'kolkata', 'ahmedabad', 'kochi', 'coimbatore', 'chandigarh',
    'indore', 'jaipur'
  ];
  const foreignKeywords = [
    'united states', ' usa', 'san francisco', 'new york', 'seattle', 'austin',
    'chicago', 'los angeles', 'boston', 'london', 'united kingdom', ' uk',
    'canada', 'toronto', 'vancouver', 'germany', 'berlin', 'france',
    'australia', 'singapore', 'japan', 'ireland', 'dublin'
  ];
  const hasIndia = indiaKeywords.some(city => new RegExp(`\\b${city}\\b`, 'i').test(combinedLoc));
  const hasForeign = foreignKeywords.some(f => combinedLoc.includes(f));

  if (!hasIndia) {
    if (hasForeign) return null;
    // If remote, verify India context
    if (combinedLoc.includes('remote')) {
      const descText = (description || '').toLowerCase();
      const isIndiaRemote = /india|\binr\b|rupee|₹|bengaluru|bangalore|hyderabad|mumbai/i.test(descText);
      if (!isIndiaRemote) return null;
    } else {
      return null;
    }
  }
  
  // 2. Classify
  const role = classifyRole(title, description);
  
  // 3. Extract details
  const stipend = extractStipend(description);
  const duration = extractDuration(description);
  const skills = extractSkills(title, description);
  
  // 4. Parse locations (simplified)
  const locations = [locationStr];
  
  // 5. Detect isRemote
  const combined = `${title} ${description} ${locationStr}`.toLowerCase();
  const isRemote = combined.includes('remote') || combined.includes('work from home');
  
  // 6. Generate dedup hash
  const hashInput = `${company.name.toLowerCase()}|${title.toLowerCase()}|${locationStr.toLowerCase()}|${sourceJobId}`;
  const dedupHash = generateHash(hashInput);
  
  // 7. Return fully normalized object
  return {
    dedupHash,
    companyId: company.id,
    sourceJobId,
    title,
    locations,
    isRemote,
    applyUrl,
    description,
    postedAt: postedAt ? new Date(postedAt) : new Date(),
    roleCategory: role,
    stipendMin: stipend.min || null,
    stipendMax: stipend.max || null,
    currency: stipend.currency || 'INR',
    durationMonths: duration || null,
    skills,
    source: 'ats-api',
    status: 'OPEN'
  };
}
