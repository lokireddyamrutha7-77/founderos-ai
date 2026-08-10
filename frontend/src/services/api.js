import axios from "axios";

/**
 * Shared API instance - every module (Memory, Advisor, Finance,
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

// Attach the JWT to every request automatically, once the user is logged in.
// Token is stored under "founderos_token" - see AuthContext.jsx.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("founderos_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize every response/error to the locked {success, data, error}
// contract. After this, every api.xxx() call resolves directly to the
// backend's {success, data, error} body - NOT a full axios response object.
// Service files (memory.js, etc.) should destructure {success, data, error}
// straight off the resolved value, not off `.data` of it.
//
// On failure, we reject with a real Error (not a plain object) so existing
// `catch (err) { setError(err.message) }` patterns across the app keep
// working without needing to touch every component.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.error ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;