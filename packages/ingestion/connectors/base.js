/**
 * @typedef {Object} RawInternship
 * @property {string} sourceJobId
 * @property {string} title
 * @property {string} location
 * @property {string} applyUrl
 * @property {string} description
 * @property {string} [postedAt]
 */

/**
 * Base connector interface. Should be implemented by specific ATS connectors.
 * 
 * @param {{ id: number, atsIdentifier: string, careerUrl: string }} company
 * @returns {Promise<RawInternship[]>}
 */
export async function fetchInternships(company) {
  throw new Error('Not implemented — use a specific connector');
}
