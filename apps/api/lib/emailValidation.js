/**
 * Comprehensive Email & Domain Validation Utility
 * Validates syntax, blocks typos in popular domains (e.g. gmailll.com),
 * disallows temporary/disposable domains, and validates TLDs.
 */

// Popular email domain typos mapped to their correct versions
const DOMAIN_TYPOS = {
  // Gmail typos
  'gmailll.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmaild.com': 'gmail.com',
  'gmaill.in': 'gmail.com',
  'gmai.co': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmaik.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmeil.com': 'gmail.com',
  'gmaio.com': 'gmail.com',
  'gimail.com': 'gmail.com',
  'gmailll.co': 'gmail.com',

  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co.in': 'yahoo.co.in',
  'yahu.com': 'yahoo.com',
  'yaho.in': 'yahoo.in',
  'yahoo.con': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'ymail.con': 'ymail.com',

  // Outlook & Hotmail typos
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmali.com': 'hotmail.com',
  'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outluk.com': 'outlook.com',
  'outlook.con': 'outlook.com',
  'outlok.in': 'outlook.com',

  // iCloud typos
  'iclud.com': 'icloud.com',
  'iclou.com': 'icloud.com',
  'icoud.com': 'icloud.com',

  // Rediffmail typos
  'redifmail.com': 'rediffmail.com',
  'rediff.com': 'rediffmail.com',
  'redif.com': 'rediffmail.com'
};

// Common disposable / throwaway email domains to reject
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  '10minutemail.com',
  'guerrillamail.com',
  'sharklasers.com',
  'trashmail.com',
  'yopmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'getairmail.com',
  'mohmal.com',
  'throwawaymail.com',
  'crazymailing.com'
]);

// Common invalid TLD typos
const INVALID_TLD_TYPOS = new Set([
  'comm', 'commm', 'coom', 'con', 'cmo', 'nn', 'iin', 'inn', 'orgg', 'nett', 'eduu'
]);

/**
 * Validates an email address thoroughly
 * @param {string} email
 * @returns {{ isValid: boolean, error?: string, cleanEmail?: string }}
 */
export function validateEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Valid email address is required' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // Basic syntax check
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Invalid email address format' };
  }

  // Reject consecutive dots
  if (cleanEmail.includes('..')) {
    return { isValid: false, error: 'Email address cannot contain consecutive dots' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email address must have exactly one @ symbol' };
  }

  const [username, domain] = parts;

  if (!username || username.length > 64) {
    return { isValid: false, error: 'Email username must be between 1 and 64 characters' };
  }

  if (!domain || domain.length > 255) {
    return { isValid: false, error: 'Email domain must be between 1 and 255 characters' };
  }

  // Check for known domain typos (e.g. gmailll.com)
  if (DOMAIN_TYPOS[domain]) {
    return {
      isValid: false,
      error: `Invalid email domain '@${domain}'. Did you mean @${DOMAIN_TYPOS[domain]}?`
    };
  }

  // Check for disposable temporary email domains
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary or disposable email domains are not allowed. Please use your personal or college email.'
    };
  }

  // Check domain structure
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Invalid email domain format' };
  }

  const tld = domainParts[domainParts.length - 1];

  // Check invalid TLD typos (like .comm)
  if (INVALID_TLD_TYPOS.has(tld)) {
    return { isValid: false, error: `Invalid top-level domain '.${tld}'. Please verify your email spelling.` };
  }

  // TLD must be letters only and at least 2 chars
  if (!/^[a-z]{2,24}$/.test(tld)) {
    return { isValid: false, error: `Invalid top-level domain '.${tld}'` };
  }

  // Check each domain label (RFC 1035: alphanumeric, hyphens not at start/end)
  for (const label of domainParts) {
    if (!label || label.length > 63) {
      return { isValid: false, error: 'Invalid domain label length' };
    }
    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(label)) {
      return { isValid: false, error: `Invalid characters in domain part '${label}'` };
    }
  }

  return { isValid: true, cleanEmail };
}
