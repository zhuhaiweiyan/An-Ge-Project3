// axios instance for all requests
import axios from "axios";

const api = axios.create({
  baseURL: "https://an-ge-project3.onrender.com/api",
  withCredentials: true,
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
