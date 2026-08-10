import axios from "axios";

/**
 * Shared API instance — every module (Memory, Advisor, Finance,
 * Inventory, Milestones, Chat, Auth) should import and use THIS
 * instance rather than creating their own axios/fetch calls, so
 * base URL, auth headers, and error handling stay consistent.
 *
 * Backend base URL comes from an environment variable so it can
 * point at localhost during development and the deployed backend
 * URL in staging/production without code changes.
 *
 * Add to your .env file:
 *   VITE_API_BASE_URL=http://localhost:8000
 */

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the auth token (once Person 1's auth is ready) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("founderos_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every response/error to the locked {success, data, error} contract
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject({ success: false, data: null, error: message });
  }
);

export default api;
