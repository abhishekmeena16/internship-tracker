/**
 * @typedef {import('./base.js').RawInternship} RawInternship
 */

/**
 * Fetch jobs from Greenhouse public API
 * @param {{ id: number, atsIdentifier: string, careerUrl: string, name: string }} company
 * @returns {Promise<RawInternship[]>}
 */
export async function fetchInternships(company) {
  if (!company.atsIdentifier) {
    console.warn(`[Greenhouse] Missing atsIdentifier for ${company.name}`);
    return [];
  }

  const url = `https://boards-api.greenhouse.io/v1/boards/${company.atsIdentifier}/jobs?content=true`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      console.warn(`[Greenhouse] Board '${company.atsIdentifier}' not found for ${company.name} (404)`);
      return [];
    }

    if (!response.ok) {
      console.warn(`[Greenhouse] API error for ${company.name}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (!data || !data.jobs || !Array.isArray(data.jobs)) {
      return [];
    }

    console.log(`[Greenhouse] Found ${data.jobs.length} jobs for ${company.name}`);

    return data.jobs.map(job => ({
      sourceJobId: job.id.toString(),
      title: job.title || '',
      location: job.location?.name || 'Not specified',
      applyUrl: job.absolute_url || '',
      description: job.content || '',
      postedAt: job.updated_at || undefined
    }));
  } catch (error) {
    console.error(`[Greenhouse] Network error for ${company.name}:`, error.message);
    return [];
  }
}
