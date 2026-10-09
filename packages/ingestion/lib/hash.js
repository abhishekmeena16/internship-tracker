import crypto from 'crypto';

/**
 * Generate a dedup hash for an internship posting.
 * @param {string} input - The string to hash
 * @returns {string} The resulting SHA-256 hash in hex format
 */
export function generateHash(input) {
  return crypto.createHash('sha256').update(input).digest('hex');
}
