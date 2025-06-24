// utils/authenticatedAxios.js
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${API}/api/v3`; // You can adjust this based on version

// Create the Axios instance
const authenticatedAxios = axios.create({
  baseURL: API_BASE,
});

// Attach token to every request
authenticatedAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
authenticatedAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn('🔐 Token expired or unauthorized. Redirecting to login...');
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default authenticatedAxios;