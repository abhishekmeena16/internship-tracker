
const greenhouseSlugs = [
  'uber', 'lyft', 'airbnb', 'datadog', 'databricks', 'confluent', 'mongodb', 
  'elastic', 'cloudflare', 'gitlab', 'figma', 'postman', 'browserstack',
  'razorpaysoftwareprivatelimited', 'coinbase', 'chime', 'brex', 'affirm',
  'pinterest', 'reddit', 'discord', 'paloaltonetworks', 'instacart', 'airtable',
  'duolingo', 'verkada', 'couchbase', 'yugabyte', 'cohesity', 'commvault',
  'informatica', 'akamai', 'sumologic', 'uipath', 'harness', 'bookingcom',
  'expediagroup', 'jump-trading', 'hudson-river-trading', 'janestreet', 'optiver',
  'citadel', 'drw', 'imc', 'sig', 'two-sigma', 'de-shaw', 'arcesium', 'worldquant',
  'alphagrep', 'graviton', 'quadeye', 'zepto', 'swiggy', 'zomato', 'cred', 'phonepe'
];

const ashbySlugs = [
  'notion', 'linear', 'ramp', 'supabase', 'cursor', 'openai', 'replit', 'sentry',
  'rippling', 'glean', 'anthropic', 'perplexity', 'togetherai', 'baseten', 'fal',
  'scale', 'mistral', 'cohere', 'tldraw', 'v0', 'resend', 'runway', 'pika', 'poe'
];

const leverSlugs = [
  'spotify', 'palantir', 'clevertap', 'chargebee', 'freshworks', 'darwinbox',
  'innovaccer', 'sprinklr', 'whatfix', 'moengage', 'netcore', 'juspay', 'pine-labs'
];

async function scan() {
  const discovered = [];

  console.log('Scanning Greenhouse...');
  for (const slug of greenhouseSlugs) {
    try {
      const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of (data.jobs || [])) {
        const title = j.title || '';
        const loc = ((j.location?.name || '') + ' ' + (j.offices || []).map(o => o.name).join(' ')).toLowerCase();
        if (/india|bengaluru|bangalore|hyderabad|pune|delhi|gurgaon|gurugram|noida|mumbai|chennai/i.test(loc) &&
            /\b(intern|internship|trainee|apprentice|fellow|analyst)\b/i.test(title)) {
          discovered.push({
            ats: 'GREENHOUSE',
            board: slug,
            title,
            loc,
            url: j.absolute_url
          });
        }
      }
    } catch {}
  }

  console.log('Scanning Ashby...');
  for (const slug of ashbySlugs) {
    try {
      const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of (data.jobs || [])) {
        const title = j.title || '';
        const loc = ((j.location || '') + ' ' + (j.secondaryLocations || []).map(l => l.location).join(' ')).toLowerCase();
        if (/india|bengaluru|bangalore|hyderabad|pune|delhi|gurgaon|gurugram|noida|mumbai|chennai/i.test(loc) &&
            /\b(intern|internship|trainee|apprentice|fellow|analyst)\b/i.test(title)) {
          discovered.push({
            ats: 'ASHBY',
            board: slug,
            title,
            loc,
            url: `https://jobs.ashbyhq.com/${slug}/${j.id}/application`
          });
        }
      }
    } catch {}
  }

  console.log('Scanning Lever...');
  for (const slug of leverSlugs) {
    try {
      const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!res.ok) continue;
      const data = await res.json();
      for (const j of data) {
        const title = j.text || '';
        const loc = ((j.categories?.location || '') + ' ' + (j.categories?.allLocations || []).join(' ')).toLowerCase();
        if (/india|bengaluru|bangalore|hyderabad|pune|delhi|gurgaon|gurugram|noida|mumbai|chennai/i.test(loc) &&
            /\b(intern|internship|trainee|apprentice|fellow|analyst)\b/i.test(title)) {
          discovered.push({
            ats: 'LEVER',
            board: slug,
            title,
            loc,
            url: j.applyUrl || `https://jobs.lever.co/${slug}/${j.id}/apply`
          });
        }
      }
    } catch {}
  }

  console.log(`Discovered ${discovered.length} India-based internship openings:`);
  console.log(JSON.stringify(discovered, null, 2));
}

scan();
