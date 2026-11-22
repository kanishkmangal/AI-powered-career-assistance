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


export default apiClient;
