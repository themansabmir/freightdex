// src/lib/api.ts

import axios, { AxiosInstance } from "axios";
import { constants, NODE_ENV } from "./constants";

export const api: AxiosInstance = axios.create({
  baseURL: constants.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: false,
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    if (NODE_ENV.LOCAL === constants.ACTIVE_ENV) return config;
    const token = localStorage.getItem(constants.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // You can add loading indicator trigger here if using a UI lib

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Optionally log or transform responses here
    return response;
  },
  (error) => {
    // Centralized error handling
    const { response } = error;

    if (!response) {
      console.error("Network error or timeout");
    } else {
      switch (response.status) {
        case 401:
          // Unauthorized - maybe redirect to login
          console.warn("Unauthorized, logging out...");
          localStorage.removeItem("token");
          window.location.href = "/login";
          break;
        case 403:
          console.warn("Forbidden");
          break;
        case 500:
          console.error("Server error");
          break;
        default:
          console.warn("Unhandled error:", response.status);
          break;
      }
    }

    return Promise.reject(error);
  }
);
