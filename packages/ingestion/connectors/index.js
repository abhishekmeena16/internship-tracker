import * as greenhouse from './greenhouse.js';
import * as lever from './lever.js';
import * as ashby from './ashby.js';
import * as smartrecruiters from './smartrecruiters.js';

const connectors = {
  GREENHOUSE: greenhouse,
  LEVER: lever,
  ASHBY: ashby,
  SMARTRECRUITERS: smartrecruiters
};

/**
 * Get the appropriate connector based on the ATS type
 * @param {string} atsType - The ATS type (e.g., 'GREENHOUSE', 'LEVER')
 * @returns {{ fetchInternships: Function } | null} The connector module or null if not found
 */
export function getConnector(atsType) {
  return connectors[atsType] || null;
}
