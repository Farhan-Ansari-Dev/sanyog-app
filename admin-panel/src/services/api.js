import axios from 'axios';
import { getAdminToken, clearAdminToken } from './auth';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

// Request Interceptor: Attach Admin Token
api.interceptors.request.use(
  (config) => {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format response and handle global errors centrally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle Global 401 Unauthorized
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      clearAdminToken();
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Extract structured error message
    const errorMsg = error.response?.data?.error || error.response?.data?.message || "A network error occurred. Please try again.";
    
    toast.error(errorMsg);
    
    return Promise.reject(error);
  }
);

export default api;
