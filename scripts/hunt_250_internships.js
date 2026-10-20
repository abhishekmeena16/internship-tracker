import fs from 'fs';
import path from 'path';

// Load companies
const companies = JSON.parse(fs.readFileSync('./data/companies.json', 'utf8'));

const candidateSlugs = new Set([
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
  'philips', 'ge', 'honeywell', 'schneider', 'abb', 'cummins', 'caterpillar',
  'uber', 'airbnb', 'salesforce', 'adobe', 'atlassian', 'intuit', 'paypal',
  'nutanix', 'synopsys', 'cadence', 'arm', 'netapp', 'linkedin', 'qualcomm',
  'nvidia', 'intel', 'amd', 'texasinstruments', 'samsung', 'micron',
  'westerndigital', 'arista', 'juniper', 'marvell', 'analogdevices', 'flipkart',
  'myntra', 'nykaa', 'lenskart', 'makemytrip', 'infoedge', 'zoho', 'fractal',
  'latentview', 'tredence', 'zsassociates', 'tigeranalytics', 'exlservice',
  'quantiphi', 'tcs', 'infosys', 'wipro', 'cognizant', 'accenture', 'capgemini',
  'hcltech', 'persistentsystems', 'deloitte', 'rippling', 'airbase', 'avalara',
  'zeotap', 'zepto', 'bigbasket', 'ajio', 'blinkit', 'relianceretail', 'purplle',
  'porter', 'blackbuck', 'shiprocket', 'ninjacart', 'dpworld', 'indiamart',
  'bizongo', 'oyo', 'loginext', 'practo', 'tata1mg', 'pharmeasy', 'medibuddy',
  'nobroker', 'olx', 'timesinternet', 'nike', 'airbus', 'kla', 'gartner',
  'bnymellon', 'citi', 'ea', 'reliancejio', 'f5', 'mediatek', 'renesas',
  'stmicroelectronics', 'mckinsey', 'bcg', 'bain', 'publicissapient', 'mathworks',
  'ansys', 'altair', 'ptc', 'bentleysystems', 'trimble', 'hexagon', 'aveva',
  'aspentech', 'nationalinstruments', 'keysight', 'rohdeschwarz', 'tektronix',
  'teradyne', 'advantest', 'cohu', 'formfactor', 'games24x7', 'winzo', 'zupee',
  'junglegames', 'moonfroglabs', 'playsimple', 'zynga', 'krafton', 'supercell',
  'riotgames', 'cuemath', 'classplus', 'teachmint', 'eruditus', 'physicswallah',
  'unacademy', 'vedantu', 'simplilearn', 'upgrad', 'scaler', 'interviewbit',
  'leadschool', 'toddle', 'healthifyme', 'cultfit', 'pristyncare', 'apollo247',
  'beato', 'orangehealth', 'redcliffelabs', 'truemeds', 'turing', 'andela',
  'mercor', 'braintrust', 'ganai', 'segmind', 'perfix', 'decentro', 'setu',
  'tartan', 'm2pfintech', 'zaggle', 'musigma', 'themathcompany', 'brillio',
  'hexaware', 'cyient', 'kpit', 'tataelxsi', 'ltts', 'tatatechnologies',
  'ltimindtree', 'mphasis', 'coforge', 'birlasoft', 'zensar', 'sonatasoftware',
  'happiestminds', 'newgen', 'nucleussoftware', 'intellectdesign', 'quickheal',
  'rategain', 'mapmyindia', 'nazaratechnologies', 'deltacorp', 'merklescience',
  'drivetrain', 'sprinto', 'fampay', 'weekdayworks', 'ion', 'paytm', 'urbanpiper',
  'sarvam', 'cynlr', 'meraki-labs', 'interview-kickstart', 'bureau', 'humanarchive',
  'libra', 'airbound', 'span', 'laminar-jobs', 'nurix', 'nurix-ai', 'subspace',
  'together-ai', 'groq', 'anyscale', 'perplexity', 'cognition', 'cohere',
  'qdrant', 'weaviate', 'pinecone', 'chroma', 'langchain', 'llamaindex',
  'modal', 'runpod', 'replicate', 'baseten', 'scale', 'snorkell', 'dust',
  'tavily', 'superpipe', 'mistral', 'writer', 'devrev', 'truecaller', 'mdbgeneralreferrals'
]);

// Add all company slugs from companies.json
for (const c of companies) {
  const clean = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const hyphens = c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (clean.length > 2) candidateSlugs.add(clean);
  if (hyphens.length > 2) candidateSlugs.add(hyphens);
  if (c.atsIdentifier) candidateSlugs.add(c.atsIdentifier);
}

const allSlugs = Array.from(candidateSlugs);
console.log(`Total candidate slugs to scan: ${allSlugs.length}`);

const indiaRegex = /india|bengaluru|bangalore|hyderabad|pune|gurgaon|gurugram|noida|mumbai|delhi|chennai|gift city|ahmedabad|kolkata|kochi/i;
const internRegex = /\b(intern|internship|co-op|coop|trainee|apprentice|fellow|fellowship|student|campus|university|2026|2027|fresher|graduate program|leadership development program|deep researcher|quantitative researcher|quant researcher)\b/i;
const nonTechExclude = /internal audit|internal controls|internal medicine|expatriate|physician|nurse|barista|driver|store associate|cashier/i;

async function scanGreenhouse() {
  console.log(`\n🔎 [Greenhouse] Probing ${allSlugs.length} slugs...`);
  const results = [];
  const chunkSize = 35;
  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${s}/jobs?content=true`, {
          signal: AbortSignal.timeout(3500)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.jobs || !Array.isArray(data.jobs)) return;
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
    }));
  }
  return results;
}

async function scanLever() {
  console.log(`\n🔎 [Lever] Probing ${allSlugs.length} slugs...`);
  const results = [];
  const chunkSize = 35;
  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.lever.co/v0/postings/${s}?mode=json`, {
          signal: AbortSignal.timeout(3500)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
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
    }));
  }
  return results;
}

async function scanAshby() {
  console.log(`\n🔎 [Ashby] Probing ${allSlugs.length} slugs...`);
  const results = [];
  const chunkSize = 35;
  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${s}`, {
          signal: AbortSignal.timeout(3500)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.jobs || !Array.isArray(data.jobs)) return;
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
    }));
  }
  return results;
}

async function scanSmartRecruiters() {
  console.log(`\n🔎 [SmartRecruiters] Probing ${allSlugs.length} slugs...`);
  const results = [];
  const chunkSize = 30;
  for (let i = 0; i < allSlugs.length; i += chunkSize) {
    const chunk = allSlugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${s}/postings?limit=100`, {
          signal: AbortSignal.timeout(3500)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data.content || !Array.isArray(data.content)) return;
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
    }));
  }
  return results;
}

async function scanAmazon() {
  console.log(`\n🔎 [Amazon] Scanning Amazon Jobs API with multiple queries...`);
  const results = [];
  const queries = [
    'intern', 'internship', 'student', 'university', 'trainee', 'apprentice',
    'software', 'applied scientist', 'developer', 'systems', 'cloud', 'data',
    'machine learning', 'artificial intelligence', 'research'
  ];
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

async function scanGoogle() {
  console.log(`\n🔎 [Google] Scanning Google Careers...`);
  const results = [];
  const queries = ['intern', 'internship', 'student', 'apprentice', 'university', 'researcher', 'engineer'];
  for (const q of queries) {
    try {
      const res = await fetch(`https://www.google.com/about/careers/applications/jobs/results/?location=India&q=${encodeURIComponent(q)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(5000)
      });
      if (!res.ok) continue;
      const text = await res.text();
      const matches = [...text.matchAll(/jobs\/results\/(\d+)-([a-z0-9-]+)/g)];
      for (const m of matches) {
        const titleSlug = m[2];
        if (internRegex.test(titleSlug)) {
          const formattedTitle = titleSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          results.push({
            ats: 'GOOGLE',
            board: 'google',
            id: m[1],
            title: formattedTitle,
            location: 'Bengaluru / Hyderabad, India',
            url: `https://www.google.com/about/careers/applications/jobs/results/${m[1]}`
          });
        }
      }
    } catch (e) {}
  }
  return results;
}

async function main() {
  console.log('🚀 INITIATING EXPANSION SCAN FOR 250+ OPEN VERIFIED INDIA INTERNSHIPS');
  const [gh, lv, as, sr, am, gg] = await Promise.all([
    scanGreenhouse(),
    scanLever(),
    scanAshby(),
    scanSmartRecruiters(),
    scanAmazon(),
    scanGoogle()
  ]);

  const all = [...gh, ...lv, ...as, ...sr, ...am, ...gg];
  console.log(`\n======================================================`);
  console.log(`Total Candidates Discovered Across Web: ${all.length}`);
  console.log(`======================================================`);

  const seen = new Set();
  const deduped = [];
  for (const item of all) {
    if (!seen.has(item.url)) {
      seen.add(item.url);
      deduped.push(item);
    }
  }
  console.log(`Unique Candidate URLs: ${deduped.length}`);

  console.log(`\n🛡️ Verifying HTTP status on all unique candidate URLs...`);
  const verified = [];
  const checkChunk = 20;
  for (let i = 0; i < deduped.length; i += checkChunk) {
    const chunk = deduped.slice(i, i + checkChunk);
    await Promise.all(chunk.map(async (item) => {
      try {
        const res = await fetch(item.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
          signal: AbortSignal.timeout(6000),
          redirect: 'follow'
        });
        if (res.status >= 200 && res.status < 400) {
          verified.push(item);
          console.log(`✅ [${res.status}] [${item.ats}] ${item.title} (${item.board}) -> ${item.url}`);
        } else {
          console.log(`❌ [${res.status}] [${item.ats}] ${item.title}`);
        }
      } catch (err) {
        console.log(`❌ [ERR] [${item.ats}] ${item.title}: ${err.message}`);
      }
    }));
  }

  console.log(`\n🎯 TOTAL VERIFIED ACTIVE DIRECT INDIA INTERNSHIPS: ${verified.length}`);
  fs.writeFileSync('./scripts/hunt_250_discovered.json', JSON.stringify(verified, null, 2));
  console.log('Saved to scripts/hunt_250_discovered.json');
}

main().catch(console.error);
