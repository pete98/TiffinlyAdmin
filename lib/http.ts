import axios from "axios";

// TODO: Replace with actual backend URL when available
// const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
const BACKEND_URL = "/api";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use(
  (config) => {
    // Auth0 session will be handled by Next.js middleware
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = "/api/auth/login";
    }
    return Promise.reject(error);
  }
);
