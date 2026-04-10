import axios from 'axios';
import { useAppStore } from '../store/useAppStore';

// Change this to your live API endpoint
const API_URL = 'https://api.sanyogconformity.com/api'; // Or your deployed backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// MOCK FOR LOCAL WEB TESTING (Bypass CORS)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Basic mock for dev preview
    if (error.config?.url?.includes('/auth/send-otp')) {
      console.log('Mocked send-otp');
      return Promise.resolve({ data: { success: true, message: 'OTP sent successfully' } });
    }
    if (error.config?.url?.includes('/auth/verify-otp')) {
      console.log('Mocked verify-otp');
      return Promise.resolve({ data: { success: true, token: 'mock_jwt_token', isNewUser: false } });
    }
    if (error.config?.url?.includes('/me')) {
      console.log('Mocked /me');
      return Promise.resolve({ data: { success: true, user: { name: 'Mock User', email: 'mock@example.com' } } });
    }
    return Promise.reject(error);
  }
);

export default api;
