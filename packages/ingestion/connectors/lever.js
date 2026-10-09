/**
 * @typedef {import('./base.js').RawInternship} RawInternship
 */

/**
 * Fetch jobs from Lever public API
 * @param {{ id: number, atsIdentifier: string, careerUrl: string, name: string }} company
 * @returns {Promise<RawInternship[]>}
 */
export async function fetchInternships(company) {
  if (!company.atsIdentifier) {
    console.warn(`[Lever] Missing atsIdentifier for ${company.name}`);
    return [];
  }

  const url = `https://api.lever.co/v0/postings/${company.atsIdentifier}?mode=json`;

  try {
    const response = await fetch(url);

    if (response.status === 404) {
      console.warn(`[Lever] Board '${company.atsIdentifier}' not found for ${company.name} (404)`);
      return [];
    }

    if (!response.ok) {
      console.warn(`[Lever] API error for ${company.name}: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      return [];
    }

    console.log(`[Lever] Found ${data.length} jobs for ${company.name}`);

    return data.map(posting => ({
      sourceJobId: posting.id || '',
      title: posting.text || '',
      location: posting.categories?.location || 'Not specified',
      applyUrl: posting.hostedUrl || posting.applyUrl || '',
      description: posting.descriptionPlain || posting.description || '',
      postedAt: posting.createdAt ? new Date(posting.createdAt).toISOString() : undefined
    }));
  } catch (error) {
    console.error(`[Lever] Network error for ${company.name}:`, error.message);
    return [];
  }
}
