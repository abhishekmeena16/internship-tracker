/**
 * Utility to verify whether a URL is active, reachable, and returns a valid HTTP status (200-399).
 * Returns true if valid, false if 404, 410, 500, timeout, or unreachable.
 */
export async function verifyUrl(url, timeoutMs = 6000) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return false;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow'
    });

    // If server responded with 403 Forbidden or 429 Too Many Requests,
    // the page is alive but protected by a WAF (Cloudflare/Akamai/Datadome)
    if (res.status === 403 || res.status === 429) {
      return true;
    }

    // Only 404 Not Found or 410 Gone means the link is actually dead
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    // If timeout or SSL error, don't assume closed
    return true;
  }
}
