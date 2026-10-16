/**
 * Robust deep verification for ATS job URLs (Workday, Greenhouse, Lever, Ashby, and custom).
 * Returns true ONLY if the job is demonstrably open and accepting candidate applications.
 * Returns false if the requisition is closed, expired, deleted, or erroring (e.g. Workday S22 error).
 */

export async function verifyUrl(url, timeoutMs = 7000) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return false;
  }

  try {
    // 1. WORKDAY DEEP VERIFICATION
    if (url.includes('myworkdayjobs.com')) {
      const cleanUrl = url.replace(/\/apply\/?$/i, '').replace(/\/+$/, '');
      const m = cleanUrl.match(/https:\/\/([^.]+)\.([^.]+)\.myworkdayjobs\.com\/(?:en-US\/)?([^/]+)\/job\/(.+)$/i);
      if (m) {
        const [, tenant, instance, board, path] = m;
        const cxsUrl = `https://${tenant}.${instance}.myworkdayjobs.com/wday/cxs/${tenant}/${board}/job/${path}`;
        try {
          const cxsRes = await fetch(cxsUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json'
            },
            signal: AbortSignal.timeout(timeoutMs)
          });
          if (cxsRes.ok) {
            const data = await cxsRes.json();
            if (data.jobPostingInfo?.title) {
              return true;
            }
          }
          return false;
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    // 2. GREENHOUSE DEEP VERIFICATION
    if (url.includes('greenhouse.io')) {
      const idMatch = url.match(/jobs\/([0-9]+)/);
      const boardMatch = url.match(/greenhouse\.io\/([^/]+)/);
      if (idMatch && boardMatch) {
        const jobId = idMatch[1];
        const board = boardMatch[1];
        try {
          const ghRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs/${jobId}`, {
            signal: AbortSignal.timeout(timeoutMs)
          });
          if (ghRes.ok) {
            const data = await ghRes.json();
            return !!data.title;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }

    // 3. LEVER DEEP VERIFICATION
    if (url.includes('jobs.lever.co')) {
      const m = url.match(/lever\.co\/([^/]+)\/([a-f0-9-]+)/i);
      if (m) {
        const [, board, jobId] = m;
        try {
          const levRes = await fetch(`https://api.lever.co/v0/postings/${board}/${jobId}`, {
            signal: AbortSignal.timeout(timeoutMs)
          });
          if (levRes.ok) {
            const data = await levRes.json();
            return !!data.text;
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }

    // 4. ASHBY DEEP VERIFICATION
    if (url.includes('jobs.ashbyhq.com')) {
      const m = url.match(/ashbyhq\.com\/([^/]+)\/([a-f0-9-]+)/i);
      if (m) {
        const [, board, jobId] = m;
        try {
          const ashbyRes = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${board}`, {
            signal: AbortSignal.timeout(timeoutMs)
          });
          if (ashbyRes.ok) {
            const data = await ashbyRes.json();
            return (data.jobs || []).some(j => j.id === jobId);
          }
          return false;
        } catch (e) {
          return false;
        }
      }
    }

    // 5. STANDARD HTTP VERIFICATION FOR OFFICIAL PORTALS (e.g. Amazon, Stripe)
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow'
    });

    if (res.status >= 200 && res.status < 400) {
      const body = await res.text();
      // Verify page doesn't state job expired
      if (/position is no longer available|job has been closed|this role has closed|job not found/i.test(body)) {
        return false;
      }
      return true;
    }

    return false;
  } catch (err) {
    return false;
  }
}
