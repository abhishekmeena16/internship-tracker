/**
 * Parses and validates pagination query parameters
 * @param {Object} query - The request query object
 * @returns {{page: number, limit: number, skip: number}}
 */
export const validatePagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 6));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Safely parses integer values
 * @param {string} value 
 * @param {number} defaultValue 
 * @returns {number}
 */
export const parseIntSafe = (value, defaultValue = 0) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};
