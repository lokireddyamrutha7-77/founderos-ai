import axios from "axios";

// Central axios instance - every service file (memory.js, advisor.js, etc.)
// should import and use this, not create its own axios instance.
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
