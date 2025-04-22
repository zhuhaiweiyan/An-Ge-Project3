// axios instance for all requests
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // assumes backend is served under /api
});

// attach JWT if any
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
