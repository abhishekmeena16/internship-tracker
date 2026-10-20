import fs from 'fs';
import path from 'path';

const GREENHOUSE_CANDIDATE_SLUGS = [
  'towerresearchcapital', 'gravitonresearchcapital', 'worldquant', 'alphagrep', 'quadeye', 'flowtraders', 'twosigma',
  'citadel', 'millennium', 'point72', 'deshaw', 'arcesium', 'blackrock', 'fidelity', 'jumptrading',
  'stripe', 'rubrik', 'hackerrank', 'instawork', 'karya', 'formaaiinc3', 'thoughtworks', 'inmobi', 'glance', 'scopely',
  'mongodb', 'cloudsek', 'enterpret', 'project44', 'groww', 'razorpaysoftwareprivatelimited', 'swiggy', 'zomato',
  'cred', 'zerodha', 'meesho', 'curefit', 'mpl', 'dream11', 'cars24', 'urbancompany', 'slice', 'jupiter', 'epifi',
  'coinswitch', 'coindcx', 'zeta', 'spinny', 'cardekho', 'pinelabs', 'bharatpe', 'juspay', 'postman', 'browserstack',
  'hasura', 'atlan', 'appsmith', 'signoz', 'sprinklr', 'freshworks', 'chargebee', 'moengage', 'clevertap', 'netcore',
  'leadsquared', 'darwinbox', 'yellowai', 'haptik', 'sharechat', 'dailyhunt', 'verloop', 'loconav', 'dunzo', 'khatabook',
  'apna', 'ixigo', 'delhivery', 'atherenergy', 'olaelectric', 'licious', 'elastic', 'confluent', 'datadog',
  'paloaltonetworks', 'cloudflare', 'fastly', 'gitlab', 'twilio', 'instacart', 'affirm', 'chime', 'brex', 'airtable',
  'pinterest', 'reddit', 'discord', 'lyft', 'dropbox', 'box', 'snowflake', 'databricks', 'figma', 'verkada',
  'samsara', 'gusto', 'flexport', 'amplitude', 'braze', 'branch', 'couchbase', 'yugabyte', 'crowdstrike',
  'sentinelone', 'zscaler', 'akamai', 'sumologic', 'splunk', 'pagerduty', 'launchdarkly', 'snyk', 'criteo', 'okta',
  'druva', 'cohesity', 'commvault', 'informatica', 'target', 'walmart', 'lowes', 'tesco', 'siemens', 'bosch',
  'philips', 'ge', 'honeywell', 'schneider', 'abb', 'cummins', 'caterpillar', 'uber', 'airbnb', 'salesforce',
  'adobe', 'atlassian', 'intuit', 'paypal', 'nutanix', 'synopsys', 'cadence', 'arm', 'netapp', 'linkedin',
  'goldmansachs', 'jpmorganchase', 'morganstanley', 'americanexpress', 'visa', 'mastercard', 'barclays', 'deutschebank',
  'ubs', 'wellsfargo', 'qualcomm', 'nvidia', 'intel', 'amd', 'texasinstruments', 'samsung', 'micron', 'westerndigital',
  'arista', 'juniper', 'marvell', 'analogdevices', 'flipkart', 'myntra', 'ola', 'rapido', 'nykaa', 'lenskart',
  'makemytrip', 'infoedge', 'zoho', 'fractal', 'latentview', 'tredence', 'zsassociates', 'tigeranalytics',
  'exlservice', 'quantiphi', 'tcs', 'infosys', 'wipro', 'cognizant', 'accenture', 'capgemini', 'hcltech',
  'persistentsystems', 'deloitte', 'rippling', 'airbase', 'avalara', 'zeotap', 'zepto', 'bigbasket', 'ajio',
  'blinkit', 'relianceretail', 'purplle', 'porter', 'blackbuck', 'shiprocket', 'ninjacart', 'dpworld', 'indiamart',
  'bizongo', 'oyo', 'loginext', 'practo', 'tata1mg', 'pharmeasy', 'medibuddy', 'nobroker', 'olx', 'timesinternet',
  'nike', 'airbus', 'kla', 'gartner', 'bnymellon', 'citi', 'ea', 'reliancejio', 'f5', 'mediatek', 'renesas',
  'stmicroelectronics', 'mckinsey', 'bcg', 'bain', 'publicissapient', 'mathworks', 'ansys', 'altair', 'ptc',
  'bentleysystems', 'trimble', 'hexagon', 'aveva', 'aspentech', 'nationalinstruments', 'keysight', 'rohdeschwarz',
  'tektronix', 'teradyne', 'advantest', 'cohu', 'formfactor', 'games24x7', 'winzo', 'zupee', 'junglegames',
  'moonfroglabs', 'playsimple', 'zynga', 'krafton', 'supercell', 'riotgames', 'dehaat', 'agrostar', 'waycool',
  'cuemath', 'classplus', 'teachmint', 'eruditus', 'physicswallah', 'unacademy', 'vedantu', 'simplilearn', 'upgrad',
  'scaler', 'interviewbit', 'leadschool', 'toddle', 'healthifyme', 'cultfit', 'pristyncare', 'apollo247',
  'beato', 'orangehealth', 'redcliffelabs', 'truemeds', 'turing', 'andela', 'mercor', 'braintrust',
  'ganai', 'segmind', 'perfix', 'decentro', 'setu', 'tartan', 'm2pfintech', 'zaggle', 'musigma', 'themathcompany',
  'brillio', 'hexaware', 'cyient', 'kpit', 'tataelxsi', 'ltts', 'tatatechnologies', 'ltimindtree', 'mphasis',
  'coforge', 'birlasoft', 'zensar', 'sonatasoftware', 'happiestminds', 'newgen', 'nucleussoftware', 'intellectdesign',
  'quickheal', 'rategain', 'mapmyindia', 'nazaratechnologies', 'deltacorp'
];

const LEVER_CANDIDATE_SLUGS = [
  'merklescience', 'drivetrain', 'sprinto', 'fampay', 'weekdayworks', 'ion', 'paytm', 'meesho', 'browserstack',
  'postman', 'khatabook', 'urbancompany', 'clevertap', 'curefit', 'mpl', 'dream11', 'swiggy', 'zomato', 'phonepe',
  'slice', 'jupiter', 'fi-money', 'cred', 'zepto', 'blinkit', 'rapido', 'ola', 'razorpay', 'groww', 'zerodha',
  'smallcase', 'navi', 'coinswitch', 'coindcx', 'zeta', 'sprinklr', 'inmobi', 'moengage', 'netcore', 'leadsquared',
  'darwinbox', 'yellowai', 'haptik', 'glance', 'sharechat', 'dailyhunt', 'verloop', 'loconav', 'atherenergy',
  'olaelectric', 'licious', 'spinny', 'cardekho', 'pinelabs', 'bharatpe', 'juspay', 'urbanpiper', 'hasura',
  'atlan', 'appsmith', 'signoz', 'spotify', 'affirm', 'brex', 'plaid', 'wealthfront', 'checkr', 'verkada',
  'rubrik', 'stripe', 'amplitude', 'braze', 'snyk', 'launchdarkly', 'pagerduty', 'gitlab', 'elastic', 'confluent',
  'couchbase', 'yugabyte', 'mongodb', 'snowflake', 'databricks', 'figma', 'notion', 'linear', 'retool', 'cursor',
  'vercel', 'supabase', 'sentry', 'rippling', 'replit', 'scale', 'modal', 'runpod', 'together-ai', 'groq',
  'perplexity', 'cohere', 'qdrant', 'weaviate', 'pinecone', 'chroma', 'langchain', 'llamaindex', 'mistral',
  'devrev', 'truecaller', 'subspace', 'bureau', 'sarvam', 'cynlr', 'meraki-labs', 'interview-kickstart',
  'formaaiinc3', 'instawork', 'karya', 'thoughtworks', 'scopely', 'towerresearchcapital', 'worldquant',
  'gravitonresearchcapital', 'alphagrep', 'quadeye', 'flowtraders', 'twosigma', 'citadel', 'millennium',
  'point72', 'deshaw', 'arcesium', 'blackrock', 'fidelity', 'jumptrading', 'walmart', 'target', 'lowes',
  'siemens', 'bosch', 'philips', 'ge', 'honeywell', 'schneider', 'abb', 'cummins', 'caterpillar', 'uber',
  'airbnb', 'salesforce', 'adobe', 'atlassian', 'intuit', 'paypal', 'nutanix', 'synopsys', 'cadence', 'arm',
  'netapp', 'linkedin', 'qualcomm', 'nvidia', 'intel', 'amd', 'texasinstruments', 'samsung', 'micron',
  'westerndigital', 'arista', 'juniper', 'marvell', 'analogdevices', 'flipkart', 'myntra', 'nykaa', 'lenskart',
  'makemytrip', 'infoedge', 'zoho', 'freshworks', 'chargebee', 'tcs', 'infosys', 'wipro', 'cognizant',
  'accenture', 'capgemini', 'hcltech', 'persistent', 'deloitte'
];

const ASHBY_CANDIDATE_SLUGS = [
  'sarvam', 'cynlr', 'meraki-labs', 'interview-kickstart', 'bureau', 'notion', 'ramp', 'linear', 'retool',
  'cursor', 'vercel', 'supabase', 'sentry', 'rippling', 'replit', 'postman', 'browserstack', 'hasura',
  'atlan', 'invideo', 'leena-ai', 'yellow-ai', 'devrev', 'truecaller', 'subspace', 'together-ai', 'groq',
  'anyscale', 'perplexity', 'cognition', 'cohere', 'qdrant', 'weaviate', 'pinecone', 'chroma', 'langchain',
  'llamaindex', 'modal', 'runpod', 'replicate', 'baseten', 'scale', 'snorkell', 'signoz', 'appsmith', 'dust',
  'tavily', 'superpipe', 'mistral', 'writer', 'modal-labs', 'decagon', 'suno', 'elevenlabs', 'character-ai',
  'midjourney', 'stability-ai', 'runway', 'luma-ai', 'pika', 'adept', 'inflection', 'cohere-ai', 'anthropic',
  'openai', 'humanarchive', 'zerodha', 'groww', 'cred', 'slice', 'jupiter', 'fi-money', 'navi', 'smallcase',
  'indmoney', 'jar', 'unicards', 'scapia', 'onecard', 'swiggy', 'zomato', 'zepto', 'blinkit', 'dunzo',
  'porter', 'blackbuck', 'delhivery', 'shadowfax', 'shiprocket', 'meesho', 'nykaa', 'purplle', 'lenskart',
  'ather', 'olaelectric', 'licious', 'freshtohome', 'countrydelight', 'ninjacart', 'dehaat', 'cars24', 'cardekho',
  'spinny', 'nobroker', 'apna', 'cutshort', 'cuemath', 'classplus', 'eruditus', 'physicswallah', 'unacademy',
  'vedantu', 'scaler', 'interviewbit', 'leadschool', 'toddle', 'cultfit', 'pristyncare', 'practo', 'tata1mg',
  'pharmeasy', 'medibuddy', 'innovaccer', 'truemeds', 'mercor', 'karya', 'ganai', 'segmind', 'decentro',
  'setu', 'tartan', 'm2p', 'zaggle', 'themathcompany', 'brillio', 'hexaware', 'kpit', 'tataelxsi', 'ltts',
  'happiestminds', 'quickheal', 'rategain', 'mapmyindia', 'winzo', 'zupee', 'junglegames', 'gameberry',
  'playsimple', 'scopely', 'zynga', 'krafton'
];

const SMARTRECRUITERS_CANDIDATE_SLUGS = [
  'visa', 'bosch', 'publicissapient', 'ubisoft', 'equinix', 'square', 'block', 'wipro', 'tcs', 'cognizant',
  'accenture', 'dell', 'hitachi', 'siemens', 'schneider-electric', 'alstom', 'volvo', 'ericsson', 'nokia',
  'philips', 'swiggy', 'zomato', 'flipkart', 'myntra', 'nykaa', 'lenskart', 'ola', 'cisco', 'intel', 'amd',
  'qualcomm', 'micron', 'broadcom', 'western-digital', 'marvell', 'analog-devices', 'synopsys', 'cadence',
  'arm', 'applied-materials', 'lam-research', 'kla-tencor', 'asml', 'nxp', 'renesas', 'stmicroelectronics',
  'infineon', 'honeywell', 'ge', 'abb', 'cummins', 'caterpillar', 'eaton', 'emerson', 'rockwell-automation',
  'danfoss', 'parker-hannifin', 'johnson-controls', 'carrier', 'trane-technologies', 'otis', 'schindler',
  'kone', 'thyssenkrupp', 'john-deere', 'jcb', 'mercedes-benz', 'bmw', 'volkswagen', 'stellantis', 'ford',
  'general-motors', 'hyundai', 'renault-nissan', 'suzuki', 'tata-motors', 'mahindra', 'ashok-leyland',
  'tvs-motor', 'bajaj-auto', 'hero-motocorp', 'royal-enfield', 'airbus', 'boeing', 'lockheed-martin',
  'collins-aerospace', 'pratt-whitney', 'safran', 'rolls-royce', 'bae-systems', 'thales', 'dassault-systemes'
];

const indiaRegex = /india|bengaluru|bangalore|hyderabad|pune|gurgaon|gurugram|noida|mumbai|delhi|chennai|gift city|ahmedabad|kolkata|kochi/i;
const internRegex = /\b(intern|internship|co-op|coop|trainee|apprentice|fellow|2026|2027)\b/i;
const nonTechExclude = /internal audit|internal controls|internal medicine|expatriate|physician|nurse|barista|driver|store associate|cashier/i;

async function scanGreenhouseSlugs(slugs) {
  console.log(`\n🔎 [Greenhouse] Probing ${slugs.length} candidate slugs...`);
  const results = [];
  const chunkSize = 25;
  for (let i = 0; i < slugs.length; i += chunkSize) {
    const chunk = slugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${s}/jobs?content=true`, {
          signal: AbortSignal.timeout(4000)
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

async function scanLeverSlugs(slugs) {
  console.log(`\n🔎 [Lever] Probing ${slugs.length} candidate slugs...`);
  const results = [];
  const chunkSize = 25;
  for (let i = 0; i < slugs.length; i += chunkSize) {
    const chunk = slugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.lever.co/v0/postings/${s}?mode=json`, {
          signal: AbortSignal.timeout(4000)
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

async function scanAshbySlugs(slugs) {
  console.log(`\n🔎 [Ashby] Probing ${slugs.length} candidate slugs...`);
  const results = [];
  const chunkSize = 25;
  for (let i = 0; i < slugs.length; i += chunkSize) {
    const chunk = slugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${s}`, {
          signal: AbortSignal.timeout(4000)
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

async function scanSmartRecruitersSlugs(slugs) {
  console.log(`\n🔎 [SmartRecruiters] Probing ${slugs.length} candidate slugs...`);
  const results = [];
  const chunkSize = 20;
  for (let i = 0; i < slugs.length; i += chunkSize) {
    const chunk = slugs.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (s) => {
      try {
        const res = await fetch(`https://api.smartrecruiters.com/v1/companies/${s}/postings?limit=100`, {
          signal: AbortSignal.timeout(4000)
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

async function main() {
  console.log('🚀 RUNNING COMPREHENSIVE ATS BOARD SCANNER');
  const [gh, lv, as, sr] = await Promise.all([
    scanGreenhouseSlugs(Array.from(new Set(GREENHOUSE_CANDIDATE_SLUGS))),
    scanLeverSlugs(Array.from(new Set(LEVER_CANDIDATE_SLUGS))),
    scanAshbySlugs(Array.from(new Set(ASHBY_CANDIDATE_SLUGS))),
    scanSmartRecruitersSlugs(Array.from(new Set(SMARTRECRUITERS_CANDIDATE_SLUGS)))
  ]);

  const all = [...gh, ...lv, ...as, ...sr];
  console.log(`\n======================================================`);
  console.log(`Total Candidates Discovered Across All ATS Boards: ${all.length}`);
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
  for (const item of deduped) {
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
  }

  console.log(`\n🎯 TOTAL VERIFIED ACTIVE DIRECT INDIA INTERNSHIPS: ${verified.length}`);
  fs.writeFileSync('./scripts/broad_ats_discovered.json', JSON.stringify(verified, null, 2));
  console.log('Saved to scripts/broad_ats_discovered.json');
}

main().catch(console.error);
