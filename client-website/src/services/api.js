import axios from "axios";

const API = axios.create({
  baseURL: "https://api.sanyogconformity.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically to every request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token");

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;