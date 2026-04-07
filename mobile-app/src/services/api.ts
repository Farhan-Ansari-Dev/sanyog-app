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

export default api;
