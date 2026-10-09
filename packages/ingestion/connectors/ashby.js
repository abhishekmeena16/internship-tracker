/**
 * @typedef {import('./base.js').RawInternship} RawInternship
 */

/**
 * Fetch jobs from Ashby public API
 * @param {{ id: number, atsIdentifier: string, careerUrl: string, name: string }} company
 * @returns {Promise<RawInternship[]>}
 */
export async function fetchInternships(company) {
  if (!company.atsIdentifier) {
    console.warn(`[Ashby] Missing atsIdentifier for ${company.name}`);
    return [];
  }

  const url = `https://api.ashbyhq.com/posting-api/job-board/${company.atsIdentifier}`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      console.warn(`[Ashby] Board '${company.atsIdentifier}' not found for ${company.name} (404)`);
      return [];
    }

    if (!response.ok) {
      console.warn(`[Ashby] API error for ${company.name}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    const jobs = data.jobs || data.results || [];

    if (!Array.isArray(jobs)) {
      return [];
    }

    console.log(`[Ashby] Found ${jobs.length} jobs for ${company.name}`);

    return jobs.map(job => ({
      sourceJobId: job.id || '',
      title: job.title || '',
      location: job.location || job.locationName || 'Not specified',
      applyUrl: job.applicationUrl || `https://jobs.ashbyhq.com/${company.atsIdentifier}/${job.id}`,
      description: job.descriptionHtml || job.descriptionPlain || job.description || '',
      postedAt: job.publishedAt || job.createdAt || undefined
    }));
  } catch (error) {
    console.error(`[Ashby] Network error for ${company.name}:`, error.message);
    return [];
  }
}
