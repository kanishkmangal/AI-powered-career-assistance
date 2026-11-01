/**
 * EduMitra AI - API Client Service
 * Centralized API service for communicating with the Django REST Framework backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

export const apiClient = {
  baseUrl: API_BASE_URL,

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = localStorage.getItem('edumitra_auth_token');

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const err = new Error(data.message || `API Error: ${response.status}`);
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
export const getStudentProfile = (email) => apiClient.get(`/auth/profile/?email=${encodeURIComponent(email)}`);
export const updateStudentProfile = (email, payload) => apiClient.patch(`/auth/profile/?email=${encodeURIComponent(email)}`, payload);

export default apiClient;
