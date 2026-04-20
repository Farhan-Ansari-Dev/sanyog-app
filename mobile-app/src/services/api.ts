import axios from 'axios';
import { useAppStore } from '../store/useAppStore';
import Toast from 'react-native-toast-message';

// Standardized environment execution
const API_URL = 'http://localhost:5000' || 'https://api.sanyogconformity.com'; 

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = useAppStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Format response and handle global errors centrally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle Global 401 Unauthorized
    if (error.response?.status === 401) {
      useAppStore.getState().clearAuth();
      Toast.show({
        type: 'error',
        text1: 'Session Expired',
        text2: 'Please log in again.'
      });
      return Promise.reject(error);
    }

    // Extract structured error message matching backend standard
    const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "A network error occurred.";
    
    // OFFLINE CATCHING (Network Request Queue bounds)
    if (error.message === 'Network Error' || error.message.includes('timeout')) {
      if (error.config.method !== 'get') {
        const store = useAppStore.getState();
        store.queueOfflineRequest({
           url: error.config.url,
           method: error.config.method,
           data: error.config.data
        });
        Toast.show({
          type: 'error',
          text1: 'You are offline.',
          text2: 'Request saved. We will retry when internet returns.'
        });
        return Promise.reject(error);
      }
    }

    Toast.show({
      type: 'error',
      text1: 'Request Failed',
      text2: errorMsg
    });
    
    return Promise.reject(error);
  }
);

export default api;
