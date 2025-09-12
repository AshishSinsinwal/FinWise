// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://finwise-2rjk.onrender.com/api",
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
