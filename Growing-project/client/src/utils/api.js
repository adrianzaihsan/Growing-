import axios from "axios";

const API_BASE_URL = "http://localhost:5001/api";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Initialize token from localStorage
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default api;
