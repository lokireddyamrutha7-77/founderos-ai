import axios from "axios";

// Central axios instance - every service file (memory.js, advisor.js, etc.)
// should import and use this, not create its own axios instance.
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT to every request automatically, once the user is logged in.
// ASSUMPTION (confirm with Person 1): the login flow stores the token in
// localStorage under the key "token". If Person 1's login page stores it
// under a different key or in a different place, update this one spot.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;