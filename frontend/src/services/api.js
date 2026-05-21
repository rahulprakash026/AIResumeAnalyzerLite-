import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
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

// Response interceptor to handle 401s (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if token is expired/invalid
      localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.access) {
      localStorage.setItem('token', response.data.access);
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};

export const resumeService = {
  uploadResume: async (formData) => {
    const response = await api.post('/resumes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getResumes: async () => {
    const response = await api.get('/resumes/');
    return response.data;
  },
  getAnalysis: async (id) => {
    const response = await api.get(`/analysis/${id}/`);
    return response.data;
  }
};

export const jobService = {
  getJobs: async () => {
    const response = await api.get('/jobs/');
    return response.data;
  },
  createJob: async (jobData) => {
    const response = await api.post('/jobs/', jobData);
    return response.data;
  }
};

export default api;
