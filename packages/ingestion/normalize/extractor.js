/**
 * Extract stipend details from description or estimate market standard.
 * @param {string} description - Job description
 * @param {string} [companyName] - Company name for fallback benchmark
 * @param {string} [roleCategory] - Role category for fallback benchmark
 * @returns {{ min: number|null, max: number|null, currency: string }}
 */
export function extractStipend(description = '', companyName = '', roleCategory = 'SDE') {
  const result = { min: null, max: null, currency: 'INR' };
  const descText = (description || '').replace(/&[a-z]+;/g, ' ');

  // Direct regex matches for stipend numbers
  const lpaMatch = descText.match(/(\d+(?:\.\d+)?)\s*LPA/i);
  if (lpaMatch) {
    result.min = Math.round((parseFloat(lpaMatch[1]) * 100000) / 12);
    result.max = Math.round(result.min * 1.25);
    return result;
  }

  const rangeMonthMatch = descText.match(/(?:Rs\.?|₹|INR)?\s*(\d{2,3}(?:,\d{3})*|\d{2,3}k)\s*(?:-|to)\s*(\d{2,3}(?:,\d{3})*|\d{2,3}k)\s*(?:\/|-|per)?\s*(?:month|mo|pm)?/i);
  if (rangeMonthMatch) {
    const parseNum = (s) => {
      s = s.toLowerCase().trim();
      if (s.endsWith('k')) return parseInt(s.replace('k', ''), 10) * 1000;
      return parseInt(s.replace(/,/g, ''), 10);
    };
    const v1 = parseNum(rangeMonthMatch[1]);
    const v2 = parseNum(rangeMonthMatch[2]);
    if (v1 >= 15000 && v2 <= 300000) {
      result.min = v1;
      result.max = v2;
      return result;
    }
  }

  const perMonthMatch = descText.match(/(?:Rs\.?|₹|INR)?\s*(\d{2,3}(?:,\d{3})*)\s*(?:\/|-|per)\s*(?:month|mo|pm)/i);
  if (perMonthMatch) {
    const val = parseInt(perMonthMatch[1].replace(/,/g, ''), 10);
    if (val >= 15000 && val <= 300000) {
      result.min = val;
      result.max = Math.round(val * 1.2);
      return result;
    }
  }

  // Accurate company & sector benchmarks if not explicitly stated in JD text
  const comp = (companyName || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  if (/tower research|graviton|worldquant|d\.?\s*e\.?\s*shaw|alphagrep|optiver|jane street|citadel|hudson river|jump trading|squarepoint|two sigma|millennium|imc trading|qube|g-research|marshall wace|point72|bridgewater|aqr|balyasny|brevan howard|da vinci/i.test(comp)) {
    result.min = 120000;
    result.max = 175000;
    return result;
  }
  if (/research|phd/i.test(descLower) && /marvell|nvidia|adobe|microsoft|google|intel/i.test(comp)) {
    result.min = 85000;
    result.max = 130000;
    return result;
  }
  if (/google|meta|stripe|uber|apple|microsoft|amazon|openai|anthropic|figma|canva|vercel|notion|linear|cursor|palantir|datadog|cloudflare|glean|scale|perplexity|runway|elevenlabs|cockroach|grafana|posthog|planetscale/i.test(comp)) {
    result.min = 85000;
    result.max = 125000;
    return result;
  }
  if (/marvell|micron|nvidia|qualcomm|rubrik|atlassian|adobe|salesforce|databricks|cisco|autodesk|broadcom|analog devices|intel|amd|kla|lam research|applied materials|nxp|infineon|microchip|lattice|rambus|cirrus logic|qorvo|skyworks|ambarella|keysight|ni\b|rohde/i.test(comp)) {
    result.min = 70000;
    result.max = 110000;
    return result;
  }
  if (/flipkart|phonepe|swiggy|zomato|cred|zerodha|postman|browserstack|slice|navi|coindcx|ather|onecard|uni cards|jar|spinny|kuku fm|classplus|boat|noise|wakefit|ola electric/i.test(comp)) {
    result.min = 50000;
    result.max = 80000;
    return result;
  }
  if (/groww|inmobi|glance|meesho|paytm|nykaa|zepto|urban company/i.test(comp)) {
    result.min = 35000;
    result.max = 55000;
    return result;
  }
  if (/infosys|tcs|wipro|cognizant|accenture/i.test(comp)) {
    result.min = 25000;
    result.max = 40000;
    return result;
  }

  if (roleCategory === 'AI_ML') {
    result.min = 50000;
    result.max = 85000;
  } else if (roleCategory === 'SDE') {
    result.min = 45000;
    result.max = 75000;
  } else if (roleCategory === 'DATA') {
    result.min = 40000;
    result.max = 65000;
  } else {
    result.min = 30000;
    result.max = 50000;
  }

  return result;
}

/**
 * Extract duration in months from description or provide realistic estimate.
 * @param {string} description - Job description
 * @returns {number} Duration in months
 */
export function extractDuration(description = '') {
  if (!description) return 6;
  const match = description.match(/(\d+)(?:\s*-\s*\d+)?\s*(month|months|week|weeks)/i);
  if (match) {
    let val = parseInt(match[1], 10);
    if (match[2].toLowerCase().startsWith('week')) {
      val = Math.max(1, Math.round(val / 4));
    }
    if (val >= 1 && val <= 12) return val;
  }
  if (/winter|spring/i.test(description)) return 6;
  if (/summer/i.test(description)) return 2;
  return 6;
}

/**
 * Extract eligibility criteria from description.
 * @param {string} description - Job description
 * @returns {string} Clean eligibility string
 */
export function extractEligibility(description = '') {
  const d = (description || '').toLowerCase();
  
  if (/phd/i.test(d)) {
    return 'Pursuing Ph.D. or Master of Science in Computer Science, Machine Learning, or related field.';
  }
  if (/m\.?\s*tech|postgrad/i.test(d)) {
    return 'Enrolled in B.Tech / M.Tech / Dual Degree in Computer Science, IT, ECE or related engineering disciplines (2025, 2026, or 2027 graduating batch).';
  }
  if (/winter|january|spring/i.test(d)) {
    return 'Final-year or pre-final year students (2025/2026 batch) available for a 6-month full-time internship starting January / Spring.';
  }
  return 'Enrolled in B.Tech / B.E. / M.Tech / Dual Degree in Computer Science, IT, ECE or related technical fields (2025, 2026, or 2027 graduating batch). Minimum 7.0 CGPA or equivalent.';
}

/**
 * Extract skills from title and description.
 * @param {string} title - Job title
 * @param {string} description - Job description
 * @param {string} [roleCategory] - Role Category
 * @returns {string[]} List of matched skills
 */
export function extractSkills(title = '', description = '', roleCategory = 'SDE') {
  const combined = `${title || ''} ${description || ''}`.toLowerCase();
  
  const skillPatterns = [
    { name: 'Python', regex: /\bpython\b/i },
    { name: 'Java', regex: /\bjava\b/i },
    { name: 'JavaScript', regex: /\b(javascript|js)\b/i },
    { name: 'TypeScript', regex: /\b(typescript|ts)\b/i },
    { name: 'React', regex: /\breact(\.js)?\b/i },
    { name: 'Node.js', regex: /\bnode(\.js)?\b/i },
    { name: 'SQL', regex: /\bsql\b/i },
    { name: 'PostgreSQL', regex: /\b(postgres|postgresql)\b/i },
    { name: 'MongoDB', regex: /\bmongo(db)?\b/i },
    { name: 'C++', regex: /(?:^|[\s\/,.;:(])c\+\+(?:$|[\s\/,.;:)]|\b)/i },
    { name: 'C#', regex: /(?:^|[\s\/,.;:(])c#(?:$|[\s\/,.;:)]|\b)/i },
    { name: 'Go', regex: /\b(golang|go)\b/i },
    { name: 'Rust', regex: /\brust\b/i },
    { name: 'AWS', regex: /\baws\b/i },
    { name: 'Docker', regex: /\bdocker\b/i },
    { name: 'Kubernetes', regex: /\b(kubernetes|k8s)\b/i },
    { name: 'Git', regex: /\bgit\b/i },
    { name: 'Linux', regex: /\blinux\b/i },
    { name: 'Machine Learning', regex: /\b(machine learning|ml)\b/i },
    { name: 'Deep Learning', regex: /\bdeep learning\b/i },
    { name: 'PyTorch', regex: /\bpytorch\b/i },
    { name: 'TensorFlow', regex: /\btensorflow\b/i },
    { name: 'Data Structures', regex: /\b(data structures|dsa)\b/i },
    { name: 'Algorithms', regex: /\balgorithms\b/i },
    { name: 'System Design', regex: /\bsystem design\b/i },
    { name: 'Distributed Systems', regex: /\bdistributed systems\b/i },
    { name: 'GraphQL', regex: /\bgraphql\b/i },
    { name: 'Next.js', regex: /\bnext(\.js)?\b/i },
    { name: 'Figma', regex: /\bfigma\b/i },
    { name: 'UI/UX Design', regex: /\b(ui\/ux|user experience|product design)\b/i },
    { name: 'Video Editing', regex: /\b(video edit|premiere|after effects)\b/i },
    { name: 'Content Strategy', regex: /\b(content|youtube|media)\b/i },
    { name: 'Talent Acquisition', regex: /\b(talent acquisition|recruitment|sourcing)\b/i }
  ];

  const matched = skillPatterns
    .filter(({ regex }) => regex.test(combined))
    .map(({ name }) => name);

  if (matched.length > 0) return matched;

  // Fallback defaults by role category if none explicitly detected
  if (roleCategory === 'AI_ML') {
    return ['Python', 'Machine Learning', 'PyTorch', 'Data Structures', 'SQL'];
  }
  if (roleCategory === 'DATA') {
    return ['SQL', 'Python', 'PostgreSQL', 'Data Analysis', 'AWS'];
  }
  if (roleCategory === 'SDE') {
    return ['Data Structures', 'Algorithms', 'Java', 'Python', 'Git'];
  }
  if (/design|ux|ui/i.test(title)) {
    return ['Figma', 'UI/UX Design', 'User Research', 'Prototyping'];
  }
  if (/content|video|youtube/i.test(title)) {
    return ['Video Editing', 'Content Strategy', 'SEO', 'Social Media'];
  }
  if (/recruitment|talent|hr/i.test(title)) {
    return ['Talent Acquisition', 'Communication', 'Candidate Screening', 'HR Operations'];
  }

  return ['Problem Solving', 'Data Structures', 'Communication', 'Teamwork'];
}
