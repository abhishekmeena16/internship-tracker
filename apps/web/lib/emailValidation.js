/**
 * Client-Side Email & Domain Validation Utility
 * Validates syntax, blocks typos in popular domains (e.g. gmailll.com),
 * and gives real-time suggestions.
 */

const DOMAIN_TYPOS = {
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

  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yaho.co.in': 'yahoo.co.in',
  'yahu.com': 'yahoo.com',
  'yaho.in': 'yahoo.in',
  'yahoo.con': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'ymail.con': 'ymail.com',

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

  'iclud.com': 'icloud.com',
  'iclou.com': 'icloud.com',
  'icoud.com': 'icloud.com',

  'redifmail.com': 'rediffmail.com',
  'rediff.com': 'rediffmail.com',
  'redif.com': 'rediffmail.com'
};

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

const INVALID_TLD_TYPOS = new Set([
  'comm', 'commm', 'coom', 'con', 'cmo', 'nn', 'iin', 'inn', 'orgg', 'nett', 'eduu'
]);

export function validateEmailClient(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Valid email address is required' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicRegex.test(cleanEmail)) {
    return { isValid: false, error: 'Invalid email address format' };
  }

  if (cleanEmail.includes('..')) {
    return { isValid: false, error: 'Email address cannot contain consecutive dots' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Email address must have exactly one @ symbol' };
  }

  const [, domain] = parts;

  if (DOMAIN_TYPOS[domain]) {
    return {
      isValid: false,
      error: `Invalid email domain '@${domain}'. Did you mean @${DOMAIN_TYPOS[domain]}?`
    };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Temporary or disposable email domains are not allowed. Please use your personal or college email.'
    };
  }

  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, error: 'Invalid email domain format' };
  }

  const tld = domainParts[domainParts.length - 1];

  if (INVALID_TLD_TYPOS.has(tld)) {
    return { isValid: false, error: `Invalid top-level domain '.${tld}'. Please verify your email spelling.` };
  }

  if (!/^[a-z]{2,24}$/.test(tld)) {
    return { isValid: false, error: `Invalid top-level domain '.${tld}'` };
  }

  return { isValid: true, cleanEmail };
}
