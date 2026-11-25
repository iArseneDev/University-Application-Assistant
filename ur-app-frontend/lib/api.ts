import axios from 'axios';

// Determine base URL:
// - On the client, always use '/api' so that Next.js rewrites apply.
// - On the server, use the full backend URL (from env) to bypass rewrites.
const getBaseURL = () => {
  if (typeof window === 'undefined') {
    const backendUrl = (process.env.BACKEND_URL || 'http://localhost:8787').replace(/\/+$/, '');
    return backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
  }
  return '/api';
};

export const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
