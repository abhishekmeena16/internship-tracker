/**
 * Determine if a job is an internship based on title and description.
 * Uses strict word boundary matching to avoid false positives (e.g. "internal", "international").
 * 
 * @param {string} title - Job title
 * @param {string} [description] - Job description
 * @returns {boolean} True if it is an internship
 */
export function isInternship(title, description = '') {
  if (!title) return false;

  // Exclude recruiter, staffing, and executive roles that merely manage interns
  const excludeTitleRegex = /\b(recruiter|recruiting|talent acquisition|sourcer|manager|director|lead|head of|vp|vice president)\b/i;
  // Note: if title is e.g. "Lead Intern", allow it only if "intern" is present and not recruiter
  if (/\b(recruiter|recruiting|talent acquisition|sourcer)\b/i.test(title)) {
    return false;
  }

  // Title matching is primary and most accurate
  const titleRegex = /\b(intern|internship|interns|co-op|coop|trainee|apprentice|fellowship|working student)\b/i;
  if (titleRegex.test(title)) {
    return true;
  }

  // If title doesn't match, check description for explicit candidate internship phrases
  if (description) {
    const descRegex = /\b(internship program|summer intern|student intern|engineering intern|graduate trainee program|co-op program)\b/i;
    // Don't match if title contains senior/principal/staff/director
    if (excludeTitleRegex.test(title)) {
      return false;
    }
    return descRegex.test(description);
  }

  return false;
}
