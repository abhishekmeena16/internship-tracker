/**
 * @typedef {import('./base.js').RawInternship} RawInternship
 */

/**
 * Fetch jobs from SmartRecruiters public API
 * @param {{ id: number, atsIdentifier: string, careerUrl: string, name: string }} company
 * @returns {Promise<RawInternship[]>}
 */
export async function fetchInternships(company) {
  if (!company.atsIdentifier) {
    console.warn(`[SmartRecruiters] Missing atsIdentifier for ${company.name}`);
    return [];
  }

  const url = `https://api.smartrecruiters.com/v1/companies/${company.atsIdentifier}/postings?limit=100`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      console.warn(`[SmartRecruiters] Company '${company.atsIdentifier}' not found for ${company.name} (404)`);
      return [];
    }

    if (!response.ok) {
      console.warn(`[SmartRecruiters] API error for ${company.name}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const postings = data.content || [];

    if (!Array.isArray(postings)) {
      return [];
    }

    console.log(`[SmartRecruiters] Found ${postings.length} jobs for ${company.name}`);

    return postings.map(posting => ({
      sourceJobId: posting.id || posting.uuid || '',
      title: posting.name || '',
      location: posting.location?.city || posting.location?.country || 'Not specified',
      applyUrl: posting.ref || posting.applyUrl || `https://careers.smartrecruiters.com/${company.atsIdentifier}/${posting.id}`,
      description: posting.jobAd?.sections?.jobDescription?.text || posting.jobAd?.sections?.companyDescription?.text || '',
      postedAt: posting.releasedDate || undefined
    }));
  } catch (error) {
    console.error(`[SmartRecruiters] Network error for ${company.name}:`, error.message);
    return [];
  }
}
