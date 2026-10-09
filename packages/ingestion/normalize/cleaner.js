/**
 * Helper utilities to clean, unescape, and format job descriptions into clean, readable Markdown.
 */

export function decodeHtml(html = '') {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<div id="message-list[^>]*>/gi, '')
    .replace(/<div id="message-list_bottomSpacer"[^>]*><\/div>/gi, '')
    .replace(/<span data-sheets-[^>]*>/gi, '')
    .replace(/<\/span>/gi, '');
}

/**
 * Format and enrich a job description to ensure professional readability
 * @param {string} rawDesc 
 * @param {string} companyName 
 * @param {string} title 
 * @param {string} roleCategory 
 * @returns {string} Clean formatted description
 */
export function cleanDescription(rawDesc = '', companyName = 'Company', title = 'Internship', roleCategory = 'SDE') {
  let decoded = decodeHtml(rawDesc || '').trim();

  // If description is very minimal (less than 120 chars) or simply repeats the title
  if (!decoded || decoded.length < 120 || decoded.toLowerCase() === title.toLowerCase()) {
    return `### About ${companyName}
${companyName} is one of the premier technology organizations operating in India, known for engineering excellence, product innovation, and solving complex problems at scale.

### Role Overview
We are looking for a passionate and driven **${title}** to join our team in India. As an intern, you will gain hands-on experience working on real-world projects alongside experienced software engineers, data scientists, and product leaders.

### Key Responsibilities
- Collaborate with cross-functional engineering and product teams to design, develop, and maintain software solutions.
- Write clean, maintainable, efficient, and well-tested code following industry best practices.
- Participate in design discussions, sprint reviews, and technical code walk-throughs.
- Identify bugs, troubleshoot system bottlenecks, and implement robust fixes.

### Eligibility & Qualifications
- Currently pursuing a Bachelor's (B.Tech / B.E.) or Master's (M.Tech / M.S. / MCA) in Computer Science, IT, Electronics, or a related discipline (2025, 2026, or 2027 graduating batch).
- Strong foundation in computer science fundamentals, data structures, and algorithms.
- Proficiency in at least one modern programming language (such as Python, Java, C++, Go, or JavaScript/TypeScript).
- Strong analytical and problem-solving mindset with eager curiosity to learn new technologies.

### Stipend & Benefits
- Competitive monthly stipend benchmarked to leading industry standards.
- Mentorship from senior engineering and technical staff.
- Opportunity to be evaluated for a full-time Pre-Placement Offer (PPO) upon graduation.`;
  }

  // If HTML tags are present, convert common tags to markdown equivalents for consistency
  if (/<[a-z][\s\S]*>/i.test(decoded)) {
    decoded = decoded
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '## $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
      .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i>(.*?)<\/i>/gi, '*$1*')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<ul[^>]*>/gi, '\n')
      .replace(/<\/ul>/gi, '\n')
      .replace(/<ol[^>]*>/gi, '\n')
      .replace(/<\/ol>/gi, '\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '') // strip remaining tags
      .replace(/\n{3,}/g, '\n\n') // normalize multiple blank lines
      .trim();
  }

  return decoded;
}
