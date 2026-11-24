/**
 * EduMitra AI - API Client Service & Authentication Manager
 * Centralized API service for communicating with the Django REST Framework backend.
 * Provides unified token management, Remember Me (4-day expiration) handling,
 * and automatic session validation.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Retrieves the current authentication token from either localStorage (Remember Me = true)
 * or sessionStorage (Remember Me = false).
 */
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('edumitra_auth_token') || sessionStorage.getItem('edumitra_auth_token') || null;
};

/**
 * Retrieves the stored user profile data.
 */
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('edumitra_user') || sessionStorage.getItem('edumitra_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Retrieves authentication metadata (rememberMe flag and expiry timestamp).
 */
export const getAuthMeta = () => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('edumitra_auth_meta') || sessionStorage.getItem('edumitra_auth_meta');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

/**
 * Persists authentication data in the appropriate storage mechanism:
 * - If rememberMe is true: saves to localStorage (persists across browser restarts for 4 days).
 * - If rememberMe is false: saves to sessionStorage (cleared when browser session/tab is closed).
 */
export const setAuthData = ({ user, token, rememberMe = false, expiresAt = null }) => {
  if (typeof window === 'undefined') return;

  // Clear any existing opposite storage to prevent ghost sessions
  clearAuthData();

  const storage = rememberMe ? localStorage : sessionStorage;

  if (token) {
    storage.setItem('edumitra_auth_token', token);
  }

  if (user) {
    storage.setItem('edumitra_user', typeof user === 'string' ? user : JSON.stringify(user));
  }

  // Calculate default expiration if not provided (96 hours for Remember Me, 24h otherwise)
  const expiryTimestamp = expiresAt
    ? (typeof expiresAt === 'number' ? expiresAt * 1000 : new Date(expiresAt).getTime())
    : Date.now() + (rememberMe ? 4 * 24 * 3600 * 1000 : 24 * 3600 * 1000);

  storage.setItem(
    'edumitra_auth_meta',
    JSON.stringify({
      rememberMe: Boolean(rememberMe),
      expiresAt: expiryTimestamp,
    })
  );
};

/**
 * Clears all authentication credentials from both localStorage and sessionStorage.
 */
export const clearAuthData = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('edumitra_auth_token');
  localStorage.removeItem('edumitra_user');
  localStorage.removeItem('edumitra_auth_meta');
  sessionStorage.removeItem('edumitra_auth_token');
  sessionStorage.removeItem('edumitra_user');
  sessionStorage.removeItem('edumitra_auth_meta');
};

/**
 * Checks whether the client-side authentication has expired based on the stored expiry timestamp.
 */
export const isAuthExpired = () => {
  const meta = getAuthMeta();
  if (!meta || !meta.expiresAt) return false;
  return Date.now() >= meta.expiresAt;
};

/**
 * Checks basic client-side authentication validity.
 */
export const checkAuthValidity = () => {
  const token = getAuthToken();
  const user = getStoredUser();
  if (!token || !user) {
    clearAuthData();
    return false;
  }
  if (isAuthExpired()) {
    clearAuthData();
    return false;
  }
  return true;
};

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = getAuthToken();
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    // If backend reports expired or invalid token (HTTP 401)
    if (response.status === 401) {
      clearAuthData();
      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login';
      }
      const err = new Error(data.detail || data.message || 'Session has expired. Please sign in again.');
      err.status = 401;
      throw err;
    }

    if (!response.ok) {
      const err = new Error(data.detail || data.message || `API Error: ${response.status}`);
      err.status = response.status;
      err.errors = data.errors || {};
      throw err;
    }

    return data;
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  },

  post(endpoint, data, options = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(data), ...options });
  },

  put(endpoint, data, options = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options });
  },

  patch(endpoint, data, options = {}) {
    return this.request(endpoint, { method: 'PATCH', body: JSON.stringify(data), ...options });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  },
};

// Auth API endpoints
export const registerStudent = (payload) => apiClient.post('/auth/register/', payload);
export const loginStudent = (payload) => apiClient.post('/auth/login/', payload);
export const verifyAuthTokenWithBackend = (token = null) => {
  const activeToken = token || getAuthToken();
  return apiClient.post('/auth/verify/', { token: activeToken });
};
export const logoutStudent = async () => {
  try {
    await apiClient.post('/auth/logout/', {});
  } catch {
    // Ignore server error on logout
  } finally {
    clearAuthData();
  }
};
export const getStudentProfile = (email) => apiClient.get(`/auth/profile/?email=${encodeURIComponent(email)}`);
export const updateStudentProfile = (email, payload) => apiClient.patch(`/auth/profile/?email=${encodeURIComponent(email)}`, payload);
export const changePassword = (payload) => apiClient.post('/auth/change-password/', payload);

// AI Study Assistant API endpoints
export const getAISessions = (email, search = '') => {
  const params = new URLSearchParams();
  if (email) params.append('email', email);
  if (search) params.append('search', search);
  const q = params.toString() ? `?${params.toString()}` : '';
  return apiClient.get(`/academics/ai/sessions/${q}`);
};

export const getAISessionDetail = (sessionId, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.get(`/academics/ai/sessions/${sessionId}/${q}`);
};

export const createAISession = (payload, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/academics/ai/sessions/${q}`, payload);
};

export const updateAISession = (sessionId, payload, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.patch(`/academics/ai/sessions/${sessionId}/${q}`, payload);
};

export const deleteAISession = (sessionId, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.delete(`/academics/ai/sessions/${sessionId}/${q}`);
};

export const clearAISession = (sessionId, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/academics/ai/sessions/${sessionId}/clear/${q}`);
};

export const sendAIMessage = (sessionId, payload, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/academics/ai/sessions/${sessionId}/messages/${q}`, payload);
};

export const recordMessageFeedback = (messageId, payload, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/academics/ai/messages/${messageId}/feedback/${q}`, payload);
};

export const generatePracticeMCQs = (sessionId, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/academics/ai/sessions/${sessionId}/generate-mcqs/${q}`);
};

// Resume Builder & Career API endpoints
export const uploadResume = (formData, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.request(`/career/resumes/upload/${q}`, {
    method: 'POST',
    body: formData,
  });
};

export const getLatestResume = (email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.get(`/career/resumes/latest/${q}`);
};

export const deleteResume = (resumeId, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.delete(`/career/resumes/${resumeId}/${q}`);
};

export const getResumeAnalysis = (email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.get(`/career/resumes/analysis/${q}`);
};

export const applyResumeAnalysisAction = (payload, email) => {
  const q = email ? `?email=${encodeURIComponent(email)}` : '';
  return apiClient.post(`/career/resumes/analysis/apply/${q}`, payload);
};

export default apiClient;
