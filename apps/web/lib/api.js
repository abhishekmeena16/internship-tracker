/**
 * @typedef {Object} Internship
 * @property {string} id
 * @property {string} title
 * @property {string} companyName
 * @property {string} applyUrl
 * @property {string} location
 * @property {boolean} isRemote
 * @property {string} stipend
 * @property {string} duration
 * @property {string[]} skills
 * @property {string} status
 * @property {string} postedDate
 */

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:4000';
};

/**
 * Fetch internships with query parameters
 * @param {Object} params 
 * @returns {Promise<{data: Internship[], total: number, page: number, totalPages: number}>}
 */
export const fetchInternships = async (params = {}) => {
  try {
    const url = new URL(`${getApiUrl()}/api/internships`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value);
      }
    });
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error('Failed to fetch internships:', res.statusText);
      return { data: [], total: 0, page: 1, totalPages: 1 };
    }
    return await res.json();
  } catch (err) {
    console.warn('Network error fetching internships:', err.message);
    return { data: [], total: 0, page: 1, totalPages: 1 };
  }
};

/**
 * Fetch a single internship by ID
 * @param {string} id 
 * @returns {Promise<Internship|null>}
 */
export const fetchInternship = async (id) => {
  try {
    const res = await fetch(`${getApiUrl()}/api/internships/${id}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch internship');
    }
    return await res.json();
  } catch (err) {
    console.warn('Network error fetching internship detail:', err.message);
    return null;
  }
};

/**
 * Fetch companies
 * @param {Object} params 
 * @returns {Promise<{data: any[], total: number}>}
 */
export const fetchCompanies = async (params = {}) => {
  try {
    const url = new URL(`${getApiUrl()}/api/companies`);
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value);
    });
    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) {
      console.error('Failed to fetch companies');
      return { data: [], total: 0 };
    }
    return await res.json();
  } catch (err) {
    console.warn('Network error fetching companies:', err.message);
    return { data: [], total: 0 };
  }
};

/**
 * Fetch a single company by slug
 * @param {string} slug
 * @returns {Promise<any>}
 */
export const fetchCompany = async (slug) => {
  try {
    const res = await fetch(`${getApiUrl()}/api/companies/${slug}`, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error('Failed to fetch company');
    }
    return await res.json();
  } catch (err) {
    console.warn('Network error fetching company detail:', err.message);
    return null;
  }
};

/**
 * Fetch filter options
 * @returns {Promise<any>}
 */
export const fetchFilters = async () => {
  try {
    const res = await fetch(`${getApiUrl()}/api/filters`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error('Failed to fetch filters');
      return {};
    }
    return await res.json();
  } catch (err) {
    console.warn('Network error fetching filters:', err.message);
    return {};
  }
};

/**
 * Register user with Email and Password (returns JWT)
 */
export const registerUser = async (email, password, name = '') => {
  const res = await fetch(`${getApiUrl()}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to register account');
  }
  return data;
};

/**
 * Login user with Email and Password (returns JWT)
 */
export const loginUser = async (email, password) => {
  const res = await fetch(`${getApiUrl()}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid email or password');
  }
  return data;
};

/**
 * Send OTP verification code to email
 */
export const sendOtp = async (email, name = '') => {
  const res = await fetch(`${getApiUrl()}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to send verification code');
  }
  return data;
};

/**
 * Verify OTP and login user
 */
export const verifyOtp = async (email, otp, name = '') => {
  const res = await fetch(`${getApiUrl()}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, name })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Invalid or expired verification code');
  }
  return data;
};

/**
 * Fetch current user profile
 */
export const getMe = async (token) => {
  if (!token) return null;
  const res = await fetch(`${getApiUrl()}/api/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return null;
  return res.json();
};

/**
 * Fetch user bookmarks
 */
export const fetchBookmarks = async (token) => {
  if (!token) return { data: [] };
  const res = await fetch(`${getApiUrl()}/api/bookmarks`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) return { data: [] };
  return res.json();
};

/**
 * Save / Bookmark an internship
 */
export const saveBookmark = async (internshipId, token) => {
  const res = await fetch(`${getApiUrl()}/api/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ internshipId })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to save internship');
  }
  return data;
};

/**
 * Remove bookmark
 */
export const removeBookmark = async (internshipId, token) => {
  const res = await fetch(`${getApiUrl()}/api/bookmarks/${internshipId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return res.json();
};

/**
 * Fetch live tracker stats and crawl status
 */
export const fetchTrackerStats = async () => {
  try {
    const res = await fetch(`${getApiUrl()}/api/internships/stats`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};


