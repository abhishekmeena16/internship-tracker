import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const indiaKeywords = [
  'india', 'bengaluru', 'bangalore', 'hyderabad', 'pune', 'mumbai',
  'gurgaon', 'gurugram', 'noida', 'chennai', 'delhi', 'new delhi',
  'delhi ncr', 'kolkata', 'ahmedabad', 'kochi', 'coimbatore', 'chandigarh',
  'indore', 'jaipur', 'karnataka', 'telangana', 'maharashtra', 'haryana',
  'tamil nadu', 'uttar pradesh', 'sanand', 'gujarat', 'gift city'
];

const foreignIndicators = [
  'united states', 'usa', 'san francisco', 'new york', 'seattle', 'austin',
  'chicago', 'los angeles', 'boston', 'london', 'united kingdom', 'uk',
  'canada', 'toronto', 'vancouver', 'germany', 'berlin', 'france', 'paris',
  'australia', 'sydney', 'singapore', 'japan', 'tokyo', 'ireland', 'dublin',
  'new hampshire', 'hooksett', 'california', 'texas', 'washington', 'remote - us',
  'us remote', 'poland', 'israel', 'netherlands', 'amsterdam', 'sweden', 'stockholm'
];

const excludeKeywords = [
  'internal audit', 'international', 'internal controls', 'internal medicine',
  'internal systems', 'internal tool', 'recruiter', 'recruiting', 'sourcer',
  'talent acquisition', 'human resources', 'hr intern', 'video editor',
  'graphic design', 'content writer', 'creative & communications', 'people team',
  'onboarding', 'industrial trainee', 'ca trainee', 'operations associate',
  'technician apprentice', 'financial analyst', 'youtube & content', 'accounting',
  'legal intern', 'recruitment', 'hr trainee', 'sales intern', 'marketing intern',
  'business development', 'bde', 'telecaller', 'customer support', 'voice process',
  'lead generator', 'search infrastructure intern' // Atlassian senior manager role
];

function isTechInternship(title) {
  if (!title) return false;
  const t = title.toLowerCase();
  if (excludeKeywords.some(w => t.includes(w))) return false;
  const hasInternWord = /\b(intern|internship|co-op|coop|trainee|apprentice|fellow)\b/i.test(title);
  if (!hasInternWord) return false;
  return true;
}

function isIndia(locationStr, title = '') {
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

async function verifyUrl(url, timeoutMs = 8000) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow'
    });
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false;
  }
}

// Broad candidates for ATS checking
const greenhouseSlugs = [
  'stripe', 'groww', 'glance', 'inmobi', 'towerresearchcapital', 'rubrik',
  'razorpaysoftwareprivatelimited', 'clevertap', 'postman', 'browserstack',
  'zepto', 'swiggy', 'zomato', 'slice', 'cred', 'meesho', 'dream11', 'mpl',
  'cars24', 'spinny', 'urbancompany', 'zeta', 'phonepe', 'bharatpe', 'coindcx',
  'khatabook', 'navi', 'jupiter', 'epifi', 'turtlemint', 'acko', 'darwinbox',
  'freshworks', 'whatfix', 'innovaccer', 'sprinklr', 'leadsquared', 'hasura',
  'harness', 'wingify', 'fractalanalytics', 'quantiphi', 'tigeranalytics',
  'tredence', 'moengage', 'netcore', 'yellowai', 'gupshup', 'porter',
  'blackbuck', 'shiprocket', 'ninjacart', 'delhivery', 'shadowfax', 'rapido',
  'olacabs', 'atherenergy', 'pharmeasy', 'practo', 'medibuddy', 'curefit',
  'nobroker', 'classplus', 'physicswallah', 'vedantu', 'unacademy', 'upgrad',
  'scaler', 'jar', 'smallcase', 'zerodha', 'angelone', 'upstox', 'gameskraft',
  'games24x7', 'nazara', 'jungleegames', 'licious', 'purplle', 'boatlifestyle',
  'wakefit', 'livspace', 'homelane', 'chargebee', 'druva', 'capillary',
  'signoz', 'appsmith', 'atlan', 'hyperverge', 'sensibull', 'policybazaar',
  'lendingkart', 'rupeek', 'yubi', 'payu', 'cashfree', 'airmeet', 'vymo',
  'leena-ai', 'observe-ai', 'fareye', 'elasticrun', 'zenoti', 'mindtickle',
  'icertis', 'highradius', 'datadog', 'mongodb', 'confluent', 'twilio',
  'uber', 'qualcomm', 'adobe', 'cisco', 'sap', 'oracle', 'intuit',
  'salesforce', 'servicenow', 'hackerrank', 'enterpret', 'cloudsek',
  'sprinthq', 'sprinto', 'scrutautomation', 'keka', 'greytip', 'greythr',
  'exotel', 'route-mobile', 'webengage', 'cleverconnect', 'testsigma',
  'lambdatest', 'devtron', 'acceldata', 'minio', 'single-store', 'singlestore',
  'yugabyte', 'couchbase', 'dremio', 'aerospike', 'scylladb', 'neo4j',
  'elastic', 'dynatrace', 'newrelic', 'sumologic', 'pagerduty', 'sendgrid',
  'vonage', 'sinch', 'box', 'asana', 'mondaydotcom', 'smartsheet', 'airtable',
  'coda', 'linear', 'miro', 'mural', 'nutanix', 'purestorage', 'netapp',
  'arista', 'extreme', 'f5', 'zscaler', 'paloaltonetworks', 'fortinet',
  'checkpoint', 'crowdstrike', 'sentinelone', 'cyberark', 'rapid7', 'tenable',
  'qualys', 'sophos', 'trendmicro', 'trellix', 'adyen', 'checkout', 'plaid',
  'marqeta', 'toast', 'klarna', 'revolut', 'monzo', 'wise', 'robinhood',
  'coinbase', 'kraken', 'gemini', 'grab', 'gojek', 'doordash', 'instacart',
  'deliveroo', 'snowflake', 'databricks', 'gitlab', 'github', 'docker',
  'hashicorp', 'synopsys', 'cadence', 'arm', 'appliedmaterials', 'lamresearch',
  'kla', 'infineon', 'nxp', 'microchip', 'renesas', 'stmicroelectronics',
  'mediatek', 'eaton', 'emerson', 'rockwellautomation', 'danfoss', 'honeywell',
  'abb', 'schneider-electric', 'siemens', 'philips', 'bosch'
];

const leverSlugs = [
  'paytm', 'meesho', 'clevertap', 'urbancompany', 'slice', 'cred', 'postman',
  'zeta', 'porter', 'epifi', 'mindtickle', 'spinny', 'merklescience',
  'drivetrain', 'scaler', 'interviewbit', 'unstop', 'cuvette', 'khatabook',
  'turtlemint', 'navi', 'jupiter', 'bharatpe', 'onecard', 'fpltechnologies',
  'pinelabs', 'cashfree', 'payu', 'infibeam', 'digitinsurance', 'acko',
  'smallcase', 'indmoney', 'dezerv', 'kuvera', 'scripbox', 'dhan', 'mudrex',
  'unicards', 'cheq', 'moneyview', 'kreditbee', 'rupeek', 'lendingkart',
  'fibe', 'kissht', 'vivriti', 'yubi', 'mintifi', 'progcap', 'kinaracapital',
  'tataneu', 'tatacliq', 'ajio', 'relianceretail', 'licious', 'freshtohome',
  'countrydelight', 'furlenco', 'rentomojo', 'urbanladder', 'pepperfry',
  'wakefit', 'boat', 'noise', 'fireboltt', 'mamaearth', 'sugarcosmetics',
  'plumgoodness', 'wowskinscience', 'foxtale', 'minimalist', 'bluestone',
  'caratlane', 'melorra', 'giva', 'snitch', 'bewakoof', 'thesouledstore',
  'firstcry', 'nobroker', 'squareyards', 'zolostays', 'stanzaliving',
  'homelane', 'designcafe', 'teachmint', 'classplus', 'physicswallah',
  'vedantu', 'unacademy', 'upgrad', 'eruditus', 'greatlearning', 'simplilearn',
  'apna', 'workindia', 'betterplace', 'mygate', 'parkplus', 'cars24',
  'cardekho', 'cartrade', 'atherenergy', 'olaelectric', 'simpleenergy',
  'ultraviolette', 'yulu', 'bounce', 'makemytrip', 'goibibo', 'cleartrip',
  'easemytrip', 'yatra', 'ixigo', 'redbus', 'treebo', 'fabhotels',
  'practo', 'pharmeasy', 'tata1mg', 'apollo247', 'medibuddy', 'pristyncare',
  'netmeds', 'healthkart', 'cultfit', 'healthifyme', 'fittr', 'ultrahuman',
  'clevertap', 'moengage', 'webengage', 'netcore', 'gupshup', 'exotel',
  'routemobile', 'yellowai', 'haptik', 'verloop', 'cognigy', 'observeai',
  'uniphore', 'gnaniai', 'postman', 'browserstack', 'hasura', 'signoz',
  'devtron', 'testsigma', 'lambdatest', 'appsmith', 'tooljet', 'atlan',
  'acceldata', 'hackerrank', 'hackerearth', 'geeksforgeeks', 'codingninjas',
  'internshala', 'darwinbox', 'keka', 'zinghr', 'greythr', 'pockethrms',
  'peoplestrong', 'freshworks', 'chargebee', 'whatfix', 'innovaccer',
  'icertis', 'highradius', 'leadsquared', 'wingify', 'vymo', 'fareye',
  'capillary', 'zenoti', 'sprinklr', 'druva', 'cohesity', 'rubrik',
  'walmartglobaltech', 'targetindia', 'lowesindia', 'tescotechnology',
  'goldmansachs', 'morganstanley', 'jpmorganchase', 'americanexpress',
  'barclays', 'deutschebank', 'ubs', 'blackrock', 'wellsfargo', 'fidelity',
  'towerresearchcapital', 'worldquant', 'alphagrep', 'graviton', 'quadeye',
  'trexquant', 'squarepoint', 'twosigma'
];

const ashbySlugs = [
  'notion', 'linear', 'ramp', 'supabase', 'cursor', 'openai', 'replit',
  'sentry', 'rippling', 'analog', 'tiger', 'confluent', 'snowflake',
  'uipath', 'anyscale', 'modal', 'weightsandbiases', 'runpod', 'together',
  'clickhouse', 'qdrant', 'pinecone', 'weaviate', 'chroma', 'langchain',
  'llamaindex', 'postman', 'hasura', 'appsmith', 'browserstack', 'atlassian',
  'datadog', 'sprinto', 'scrut'
];

async function scanAll() {
  console.log('🚀 Starting broad scan across Indian Tech & MNC ATS boards...');
  const foundOpenings = [];

  // 1. Greenhouse
  console.log(`📡 Scanning ${greenhouseSlugs.length} Greenhouse boards...`);
  const ghChunkSize = 20;
  for (let i = 0; i < greenhouseSlugs.length; i += ghChunkSize) {
    const chunk = greenhouseSlugs.slice(i, i + ghChunkSize);
    await Promise.all(chunk.map(async (slug) => {
      try {
        const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, {
          signal: AbortSignal.timeout(7000)
        });
        if (!res.ok) return;
        const data = await res.json();
        const jobs = data.jobs || [];
        for (const j of jobs) {
          if (!isTechInternship(j.title)) continue;
          const loc = j.location?.name || '';
          const officesStr = JSON.stringify(j.offices || []);
          if (!isIndia(loc, j.title) && !isIndia(officesStr, j.title)) continue;

          let directUrl = `https://job-boards.greenhouse.io/${slug}/jobs/${j.id}`;
          if (slug === 'stripe') {
            directUrl = `https://stripe.com/careers/listing/software-engineer-intern/${j.id}?gh_jid=${j.id}`;
          } else if (slug === 'towerresearchcapital') {
            directUrl = `https://job-boards.greenhouse.io/towerresearchcapital/jobs/${j.id}`;
          }

          foundOpenings.push({
            ats: 'GREENHOUSE',
            companySlug: slug,
            title: j.title,
            location: loc || 'Bengaluru, India',
            applyUrl: directUrl,
            sourceJobId: String(j.id),
            rawJob: j
          });
        }
      } catch (e) {}
    }));
  }

  // 2. Lever
  console.log(`📡 Scanning ${leverSlugs.length} Lever boards...`);
  const leverChunkSize = 20;
  for (let i = 0; i < leverSlugs.length; i += leverChunkSize) {
    const chunk = leverSlugs.slice(i, i + leverChunkSize);
    await Promise.all(chunk.map(async (slug) => {
      try {
        const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, {
          signal: AbortSignal.timeout(7000)
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!Array.isArray(data)) return;
        for (const j of data) {
          if (!isTechInternship(j.text)) continue;
          const loc = j.categories?.location || '';
          if (!isIndia(loc, j.text)) continue;

          const applyUrl = j.applyUrl || `${j.hostedUrl}/apply`;
          foundOpenings.push({
            ats: 'LEVER',
            companySlug: slug,
            title: j.text,
            location: loc || 'Bengaluru, India',
            applyUrl,
            sourceJobId: String(j.id),
            rawJob: j
          });
        }
      } catch (e) {}
    }));
  }

  // 3. Ashby
  console.log(`📡 Scanning ${ashbySlugs.length} Ashby boards...`);
  await Promise.all(ashbySlugs.map(async (slug) => {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, {
        signal: AbortSignal.timeout(7000)
      });
      if (!res.ok) return;
      const data = await res.json();
      const jobs = data.jobs || [];
      for (const j of jobs) {
        if (!isTechInternship(j.title)) continue;
        const loc = j.location || '';
        if (!isIndia(loc, j.title)) continue;

        foundOpenings.push({
          ats: 'ASHBY',
          companySlug: slug,
          title: j.title,
          location: loc || 'Bengaluru, India',
          applyUrl: j.jobUrl,
          sourceJobId: String(j.id),
          rawJob: j
        });
      }
    } catch (e) {}
  }));

  console.log(`\n🔍 Found ${foundOpenings.length} potential openings! Verifying HTTP status...`);
  const verified = [];
  for (const item of foundOpenings) {
    process.stdout.write(`Testing [${item.companySlug}] ${item.title}... `);
    const ok = await verifyUrl(item.applyUrl, 8000);
    if (ok) {
      console.log(`✅ [200 OK]`);
      verified.push(item);
    } else {
      console.log(`❌ [HTTP Error]`);
    }
  }

  console.log(`\n🎉 Total Verified Working Openings: ${verified.length}`);
  fs.writeFileSync('crawl-results.json', JSON.stringify(verified, null, 2));
}

scanAll();
