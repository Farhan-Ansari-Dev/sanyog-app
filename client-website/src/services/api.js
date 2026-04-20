import axios from "axios";
import { toast } from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach token automatically to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Format response and handle global errors
API.interceptors.response.use(
  (response) => {
    // If our backend pattern {success, data} exists, unwrap it (optional helper)
    return response;
  },
  (error) => {
    // Handle Global 401 Unauthorized
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // Attempt to extract structured error message from our Node backend format
    const errorMsg = error.response?.data?.error || error.response?.data?.message || "A network error occurred. Please try again.";
    
    // Show toast for non-401 global failures to prevent silent fails
    toast.error(errorMsg);
    
    return Promise.reject(error);
  }
);

export default API;