import fs from 'fs';

const GREENHOUSE_SLUGS = [
  'mongodb', 'stripe', 'rubrik', 'towerresearchcapital', 'cloudsek', 'enterpret',
  'project44', 'scopely', 'inmobi', 'glance', 'hackerrank', 'thoughtworks',
  'groww', 'instawork', 'karya', 'gravitonresearchcapital', 'formaaiinc3',
  'razorpaysoftwareprivatelimited', 'swiggy', 'zomato', 'cred', 'zerodha',
  'meesho', 'curefit', 'mpl', 'dream11', 'cars24', 'urbancompany', 'slice',
  'jupiter', 'epifi', 'coinswitch', 'coindcx', 'zeta', 'spinny', 'cardekho',
  'pinelabs', 'bharatpe', 'juspay', 'postman', 'browserstack', 'hasura',
  'atlan', 'appsmith', 'signoz', 'sprinklr', 'freshworks', 'chargebee',
  'moengage', 'clevertap', 'netcore', 'leadsquared', 'darwinbox', 'yellowai',
  'haptik', 'sharechat', 'dailyhunt', 'verloop', 'loconav', 'dunzo', 'khatabook',
  'apna', 'ixigo', 'delhivery', 'atherenergy', 'olaelectric', 'licious',
  'elastic', 'confluent', 'datadog', 'paloaltonetworks', 'cloudflare', 'fastly',
  'gitlab', 'twilio', 'instacart', 'affirm', 'chime', 'brex', 'airtable',
  'pinterest', 'reddit', 'discord', 'lyft', 'dropbox', 'box', 'snowflake',
  'databricks', 'figma', 'verkada', 'samsara', 'gusto', 'flexport', 'amplitude',
  'braze', 'branch', 'couchbase', 'yugabyte', 'crowdstrike', 'sentinelone',
  'zscaler', 'akamai', 'sumologic', 'splunk', 'pagerduty', 'launchdarkly',
  'snyk', 'criteo', 'okta', 'druva', 'cohesity', 'commvault', 'informatica',
  'jumptrading', 'worldquant', 'alphagrep', 'quadeye', 'flowtraders', 'twosigma',
  'citadel', 'millennium', 'point72', 'deshaw', 'arcesium', 'blackrock',
  'fidelity', 'target', 'walmart', 'lowes', 'tesco', 'siemens', 'bosch',
  'philips', 'ge', 'honeywell', 'schneider', 'abb', 'cummins', 'caterpillar'
];

const LEVER_SLUGS = [
  'merklescience', 'drivetrain', 'sprinto', 'fampay', 'weekdayworks', 'ion',
  'paytm', 'meesho', 'browserstack', 'postman', 'khatabook', 'urbancompany',
  'clevertap', 'curefit', 'mpl', 'dream11', 'swiggy', 'zomato', 'phonepe',
  'slice', 'jupiter', 'fi-money', 'cred', 'zepto', 'blinkit', 'rapido', 'ola',
  'razorpay', 'groww', 'zerodha', 'smallcase', 'navi', 'coinswitch', 'coindcx',
  'zeta', 'sprinklr', 'inmobi', 'moengage', 'netcore', 'leadsquared', 'darwinbox',
  'yellowai', 'haptik', 'glance', 'sharechat', 'dailyhunt', 'verloop', 'loconav',
  'atherenergy', 'olaelectric', 'licious', 'spinny', 'cardekho', 'pinelabs',
  'bharatpe', 'juspay', 'urbanpiper', 'hasura', 'atlan', 'appsmith', 'signoz',
  'spotify', 'affirm', 'brex', 'plaid', 'wealthfront', 'checkr', 'verkada'
];

const ASHBY_SLUGS = [
  'sarvam', 'cynlr', 'meraki-labs', 'interview-kickstart', 'bureau', 'notion',
  'ramp', 'linear', 'retool', 'cursor', 'vercel', 'supabase', 'sentry',
  'rippling', 'replit', 'postman', 'browserstack', 'hasura', 'atlan',
  'invideo', 'leena-ai', 'yellow-ai', 'devrev', 'truecaller', 'subspace',
  'together-ai', 'groq', 'anyscale', 'perplexity', 'cognition', 'cohere',
  'qdrant', 'weaviate', 'pinecone', 'chroma', 'langchain', 'llamaindex',
  'modal', 'runpod', 'replicate', 'baseten', 'scale', 'snorkell', 'signoz',
  'appsmith', 'dust', 'tavily', 'superpipe', 'mistral', 'writer', 'modal-labs'
];

const SMARTRECRUITERS_SLUGS = [
  'visa', 'bosch', 'publicissapient', 'ubisoft', 'equinix', 'square', 'block',
  'wipro', 'tcs', 'cognizant', 'accenture', 'dell', 'hitachi', 'siemens',
  'schneider-electric', 'alstom', 'volvo', 'ericsson', 'nokia', 'philips',
  'swiggy', 'zomato', 'flipkart', 'myntra', 'nykaa', 'lenskart', 'ola'
];

const indiaRegex = /india|bengaluru|bangalore|hyderabad|pune|gurgaon|gurugram|noida|mumbai|delhi|chennai|gift city|ahmedabad|kolkata|kochi/i;
const internRegex = /\b(intern|internship|co-op|coop|trainee|apprentice|fellow|2026|2027)\b/i;
const nonTechExclude = /internal audit|internal controls|internal medicine|expatriate|physician|nurse|barista|driver/i;

async function scanGreenhouse() {
  console.log(`\n🔎 [Greenhouse] Scanning ${GREENHOUSE_SLUGS.length} companies...`);
  const results = [];
  for (const s of GREENHOUSE_SLUGS) {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${s}/jobs?content=true`, {
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.jobs) continue;
      for (const j of data.jobs) {
        const title = j.title || '';
        const loc = j.location?.name || '';
        if (nonTechExclude.test(title)) continue;
        if (internRegex.test(title) && indiaRegex.test(loc)) {
          results.push({
            ats: 'GREENHOUSE',
            board: s,
            id: String(j.id),
            title,
            location: loc,
            url: `https://job-boards.greenhouse.io/embed/job_app?for=${s}&token=${j.id}`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function scanLever() {
  console.log(`\n🔎 [Lever] Scanning ${LEVER_SLUGS.length} companies...`);
  const results = [];
  for (const s of LEVER_SLUGS) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${s}?mode=json`, {
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!Array.isArray(data)) continue;
      for (const j of data) {
        const title = j.text || '';
        const loc = ((j.categories?.location || '') + ' ' + (j.categories?.allLocations || []).join(' '));
        if (nonTechExclude.test(title)) continue;
        if (internRegex.test(title) && indiaRegex.test(loc)) {
          results.push({
            ats: 'LEVER',
            board: s,
            id: String(j.id),
            title,
            location: loc.trim(),
            url: `https://jobs.lever.co/${s}/${j.id}/apply`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function scanAshby() {
  console.log(`\n🔎 [Ashby] Scanning ${ASHBY_SLUGS.length} companies...`);
  const results = [];
  for (const s of ASHBY_SLUGS) {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${s}`, {
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.jobs) continue;
      for (const j of data.jobs) {
        const title = j.title || '';
        const loc = ((j.location || '') + ' ' + (j.secondaryLocations || []).map(l => l.location).join(' '));
        if (nonTechExclude.test(title)) continue;
        if (internRegex.test(title) && indiaRegex.test(loc)) {
          results.push({
            ats: 'ASHBY',
            board: s,
            id: String(j.id),
            title,
            location: loc.trim(),
            url: `https://jobs.ashbyhq.com/${s}/${j.id}/application`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function scanSmartRecruiters() {
  console.log(`\n🔎 [SmartRecruiters] Scanning ${SMARTRECRUITERS_SLUGS.length} companies...`);
  const results = [];
  for (const s of SMARTRECRUITERS_SLUGS) {
    try {
      const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${s}/postings?limit=100`, {
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.content) continue;
      for (const j of data.content) {
        const title = j.name || '';
        const loc = `${j.location?.city || ''}, ${j.location?.region || ''}, ${j.location?.country || ''}`;
        if (nonTechExclude.test(title)) continue;
        if (internRegex.test(title) && indiaRegex.test(loc)) {
          results.push({
            ats: 'SMARTRECRUITERS',
            board: s,
            id: String(j.id),
            title,
            location: loc.trim(),
            url: `https://jobs.smartrecruiters.com/${s}/${j.id}`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function scanAmazon() {
  console.log(`\n🔎 [Amazon] Scanning Amazon Jobs API...`);
  const results = [];
  const queries = ['intern', 'student', 'university', 'trainee', 'apprentice', 'software', 'applied scientist'];
  for (const q of queries) {
    try {
      const res = await fetch(`https://www.amazon.jobs/en/search.json?base_query=${encodeURIComponent(q)}&country=IND&result_limit=100`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of (data.jobs || [])) {
        const title = j.title || '';
        const loc = `${j.city || ''}, India`;
        if (internRegex.test(title)) {
          results.push({
            ats: 'AMAZON',
            board: 'amazon',
            id: String(j.id_icims || j.id),
            title,
            location: loc,
            url: `https://www.amazon.jobs${j.job_path}`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function main() {
  console.log('🚀 INITIATING DEEP SCAN FOR INDIA INTERNSHIPS ACROSS THE WEB');
  const [gh, lv, as, sr, am] = await Promise.all([
    scanGreenhouse(),
    scanLever(),
    scanAshby(),
    scanSmartRecruiters(),
    scanAmazon()
  ]);

  const all = [...gh, ...lv, ...as, ...sr, ...am];
  console.log(`\n======================================================`);
  console.log(`Total Candidates Discovered: ${all.length}`);
  console.log(`======================================================`);

  // Deduplicate by URL
  const seen = new Set();
  const deduped = [];
  for (const item of all) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      deduped.push(item);
    }
  }
  console.log(`Unique Candidate URLs: ${deduped.length}`);

  // HTTP 200 Verification
  console.log(`\n🛡️ Verifying HTTP 200 on all unique candidates...`);
  const verified = [];
  for (const item of deduped) {
    try {
      const res = await fetch(item.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(6000),
        redirect: 'follow'
      });
      if (res.status >= 200 && res.status < 400) {
        verified.push(item);
        console.log(`✅ [${res.status}] [${item.ats}] ${item.title} -> ${item.url}`);
      } else {
        console.log(`❌ [${res.status}] [${item.ats}] ${item.title}`);
      }
    } catch (err) {
      console.log(`❌ [ERR] [${item.ats}] ${item.title}: ${err.message}`);
    }
  }

  console.log(`\n🎯 TOTAL VERIFIED WORKING DIRECT INTERNSHIP APPLICATIONS: ${verified.length}`);
  fs.writeFileSync('./scripts/discovered_internships.json', JSON.stringify(verified, null, 2));
  console.log('Saved to scripts/discovered_internships.json');
}

main().catch(console.error);
