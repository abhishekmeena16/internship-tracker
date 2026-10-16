import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyUrl } from '../lib/urlVerifier.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const indiaKeywords = [
  'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai',
  'gurgaon', 'gurugram', 'noida', 'chennai', 'delhi', 'new delhi',
  'delhi ncr', 'kolkata', 'ahmedabad', 'kochi', 'coimbatore', 'chandigarh',
  'indore', 'jaipur', 'karnataka', 'telangana', 'maharashtra', 'haryana',
  'tamil nadu', 'uttar pradesh', 'sanand', 'gujarat', 'gift city'
];

const foreignIndicators = [
  'united states', ' usa', 'san francisco', 'new york', 'seattle', 'austin',
  'chicago', 'los angeles', 'boston', 'london', 'united kingdom', ' uk',
  'canada', 'toronto', 'vancouver', 'germany', 'berlin', 'france', 'paris',
  'australia', 'sydney', 'singapore', 'japan', 'tokyo', 'ireland', 'dublin',
  'new hampshire', 'hooksett', 'california', 'texas', 'washington'
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
  const hasIndia = indiaKeywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(combined));
  if (!hasIndia) return false;

  const hasForeign = foreignIndicators.some(f => combined.includes(f));
  if (hasForeign) {
    const locLower = (locationStr || '').toLowerCase();
    const specificIndiaCity = indiaKeywords.some(k => new RegExp(`\\b${k}\\b`, 'i').test(locLower));
    if (!specificIndiaCity) return false;
  }

  return true;
}

// Concurrency helper
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

const GREENHOUSE_BOARDS = [
  'project44', 'phonepe', 'razorpaysoftwareprivatelimited', 'swiggy', 'zomato', 'cred', 'slice', 'groww',
  'zerodha', 'upstox', 'angelone', 'coinswitch', 'paytm', 'mobikwik', 'bharatpe', 'pinelabs', 'cashfree',
  'juspay', 'zeta', 'yubi', 'jupiter', 'indmoney', 'postman', 'browserstack', 'innovaccer', 'sprinklr',
  'chargebee', 'darwinbox', 'keka', 'signoz', 'appsmith', 'hasura', 'yellowai', 'whatfix', 'wingify',
  'druva', 'freshworks', 'pubmatic', 'clevertap', 'moengage', 'atlys', 'alphagrepsecurities', 'drivetrain',
  'enterpret', 'cloudsek', 'hackerrank', 'weekday', 'merklescience', 'scopely', 'formaai', 'instawork',
  'interviewkickstart', 'sprinto', 'merakilabs', 'rubrik', 'inmobi', 'glance', 'towerresearchcapital', 'stripe',
  'zepto', 'delhivery', 'shadowfax', 'porter', 'rapido', 'atherenergy', 'spinny', 'cars24', 'cardekho',
  'pharmeasy', 'tata1mg', 'licious', 'physicswallah', 'unacademy', 'classplus', 'leadsquared', 'amagi',
  'dailyhunt', 'verloop', 'observeai', 'mindtickle', 'icertis', 'eightfoldai', 'gupshup', 'exotel',
  'plivo', 'pocketfm', 'pratilipi', 'kukufm', 'dealshare', 'magicpin', 'udaan', 'elasticrun', 'blinkit',
  'lenskart', 'nykaa', 'purplle', 'boat', 'noise', 'ultrahuman', 'curefit', 'healthifyme', 'cultfit',
  'practo', 'medibuddy', 'meesho', 'urbancompany', 'dream11', 'mpl', 'games24x7', 'loconav', 'bizongo',
  'blackbuck', 'shiprocket', 'datadog', 'paloaltonetworks', 'confluent', 'mongodb', 'elastic', 'cloudflare',
  'duolingo', 'gitlab', 'verkada', 'coinbase', 'robinhood', 'databricks', 'sumologic', 'commvault', 'agoda',
  'commerceiq', 'bcg', 'airtable', 'brex', 'affirm', 'chime', 'figma', 'intuit', 'gravitonresearchcapital',
  'quadeye', 'worldquant', 'drw', 'optiver', 'citadel', 'twosigma', 'hudsonrivertrading', 'deshaw', 'arcesium',
  'cohesity', 'informatica', 'akamai', 'appdynamics', 'uipath', 'harness', 'booking', 'expedia', 'airbnb',
  'acko', 'publicissapient', 'persistent', 'thoughtworks', 'coforge', 'mphasis', 'hexaware', 'couchbase', 'yugabyte'
];

const LEVER_BOARDS = [
  'clevertap', 'moengage', 'atlan', 'hasura', 'devtron', 'tooljet', 'acceldata', 'testsigma', 'lambdatest',
  'vymo', 'fareye', 'highradius', 'zenoti', 'capillary', 'spry', 'spotdraft', 'stride', 'posthog', 'prisma',
  'supabase', 'convex', 'clerk', 'render', 'railway', 'groq', 'together-ai', 'fireworks-ai', 'deepgram',
  'assemblyai', 'cohere', 'mistral', 'anthropic', 'perplexity', 'scale', 'character-ai', 'runway', 'luma-ai',
  'suno', 'elevenlabs', 'spotify', 'netflix'
];

const ASHBY_BOARDS = [
  'notion', 'linear', 'ramp', 'supabase', 'cursor', 'openai', 'replit', 'sentry', 'rippling', 'airbase',
  'resend', 'vercel', 'glean', 'tavily', 'braintrust', 'wandb', 'anysphere', 'harvey', 'langchain', 'crewai'
];

async function scanGreenhouse(board) {
  const found = [];
  try {
    const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return found;
    const data = await res.json();
    for (const j of data.jobs || []) {
      const loc = j.location?.name || '';
      if (isInternshipRole(j.title) && isIndiaLocation(loc, j.title)) {
        const url = `https://job-boards.greenhouse.io/${board}/jobs/${j.id}`;
        if (await verifyUrl(url)) {
          found.push({
            atsType: 'GREENHOUSE',
            board,
            id: String(j.id),
            title: j.title,
            location: loc,
            url,
            content: j.content || j.title,
            updatedAt: j.updated_at
          });
        }
      }
    }
  } catch (e) {}
  return found;
}

async function scanLever(board) {
  const found = [];
  try {
    const res = await fetch(`https://api.lever.co/v0/postings/${board}?mode=json`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return found;
    const jobs = await res.json();
    if (!Array.isArray(jobs)) return found;
    for (const j of jobs) {
      const loc = j.categories?.location || '';
      if (isInternshipRole(j.text) && isIndiaLocation(loc, j.text)) {
        const url = `https://jobs.lever.co/${board}/${j.id}/apply`;
        if (await verifyUrl(url)) {
          found.push({
            atsType: 'LEVER',
            board,
            id: j.id,
            title: j.text,
            location: loc,
            url,
            content: j.descriptionPlain || j.text,
            updatedAt: j.createdAt ? new Date(j.createdAt).toISOString() : new Date().toISOString()
          });
        }
      }
    }
  } catch (e) {}
  return found;
}

async function scanAshby(board) {
  const found = [];
  try {
    const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${board}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return found;
    const data = await res.json();
    for (const j of data.jobs || []) {
      const loc = j.location || (j.secondaryLocations?.map(l => l.location).join(', ')) || '';
      if (isInternshipRole(j.title) && isIndiaLocation(loc, j.title)) {
        const url = `https://jobs.ashbyhq.com/${board}/${j.id}/application`;
        if (await verifyUrl(url)) {
          found.push({
            atsType: 'ASHBY',
            board,
            id: j.id,
            title: j.title,
            location: loc,
            url,
            content: j.descriptionHtml || j.title,
            updatedAt: j.publishedAt || new Date().toISOString()
          });
        }
      }
    }
  } catch (e) {}
  return found;
}

async function main() {
  console.log(`🔎 Starting High-Speed Parallel ATS Scanner...`);
  console.log(`Greenhouse boards to scan: ${GREENHOUSE_BOARDS.length}`);
  console.log(`Lever boards to scan: ${LEVER_BOARDS.length}`);
  console.log(`Ashby boards to scan: ${ASHBY_BOARDS.length}`);

  const allDiscovered = [];

  // Run Greenhouse scans in batches of 15
  console.log('\n--- Scanning Greenhouse boards ---');
  const ghResults = await mapConcurrent(GREENHOUSE_BOARDS, 15, async (b) => {
    const res = await scanGreenhouse(b);
    if (res.length > 0) {
      console.log(`🎯 [Greenhouse: ${b}] Found ${res.length} verified roles:`, res.map(r => r.title));
    }
    return res;
  });
  ghResults.flat().forEach(r => allDiscovered.push(r));

  // Run Lever scans in batches of 15
  console.log('\n--- Scanning Lever boards ---');
  const levResults = await mapConcurrent(LEVER_BOARDS, 15, async (b) => {
    const res = await scanLever(b);
    if (res.length > 0) {
      console.log(`🎯 [Lever: ${b}] Found ${res.length} verified roles:`, res.map(r => r.title));
    }
    return res;
  });
  levResults.flat().forEach(r => allDiscovered.push(r));

  // Run Ashby scans in batches of 15
  console.log('\n--- Scanning Ashby boards ---');
  const ashResults = await mapConcurrent(ASHBY_BOARDS, 15, async (b) => {
    const res = await scanAshby(b);
    if (res.length > 0) {
      console.log(`🎯 [Ashby: ${b}] Found ${res.length} verified roles:`, res.map(r => r.title));
    }
    return res;
  });
  ashResults.flat().forEach(r => allDiscovered.push(r));

  console.log(`\n===========================================`);
  console.log(`🎉 Total Verified India Roles Discovered: ${allDiscovered.length}`);
  console.log(`===========================================`);

  const outPath = path.resolve(__dirname, 'discovered-verified.json');
  fs.writeFileSync(outPath, JSON.stringify(allDiscovered, null, 2));
  console.log(`Saved output to ${outPath}`);
}

main().catch(err => {
  console.error('Fatal scanner error:', err);
  process.exit(1);
});
