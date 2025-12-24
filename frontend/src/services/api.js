import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  register: async (email, password, role = 'client') => {
    const response = await api.post('/auth/register', { email, password, role });
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// CV services
export const cvService = {
  generate: async (cvText, jobDescription, templateId = 'modern-professional') => {
    const response = await api.post('/cv/generate', {
      cvText,
      jobDescription,
      templateId,
    });
    return response.data;
  },

  analyzeMatch: async (cvText, jobDescription) => {
    const response = await api.post('/cv/analyze-match', {
      cvText,
      jobDescription,
    });
    return response.data;
  },

  createFromScratch: async (cvData, templateId = 'modern-professional', jobDescription = '') => {
    const response = await api.post('/cv/create-from-scratch', {
      cvData,
      templateId,
      jobDescription,
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/cv/history');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/cv/${id}`);
    return response.data;
  },
};

// Service d'upload et OCR
export const uploadService = {
  extractText: async (file) => {
    const formData = new FormData();
    formData.append('cvFile', file);

    const response = await api.post('/upload/extract', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for OCR
    });
    return response.data;
  },
};

// Services Admin
export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  updateUserRole: async (id, role) => {
    const response = await api.put(`/admin/users/${id}/role`, { role });
    return response.data;
  },
};

export default api;

