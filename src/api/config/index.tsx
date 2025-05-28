// src/lib/api.ts

import axios, { AxiosInstance } from 'axios';
import { constants, NODE_ENV } from './constants';

export const api: AxiosInstance = axios.create({
  baseURL: constants.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

// ✅ Request Interceptor
api.interceptors.request.use(
  (config) => {
    // if (NODE_ENV.LOCAL === constants.ACTIVE_ENV) return config;
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
    // You can transform or log responses here
    return response;
  },
  (error) => {
    const { response } = error;

    const message = response?.data?.message || response?.data?.error || error?.message || 'Unknown error occurred';

    if (!response) {
      // Network error (timeout, DNS fail, etc)
      console.error('Network error or timeout');
      return Promise.reject(new Error('Network error or timeout'));
    }

    // Optional: Log or handle specific status codes
    switch (response.status) {
      case 401:
        console.warn('Unauthorized, logging out...');
        localStorage.removeItem(constants.TOKEN);
        localStorage.removeItem('admin');
        window.location.href = '/';
        break;

      case 403:
        console.warn('Forbidden');
        break;

      case 500:
        console.error('Server error');
        break;

      default:
        console.warn('Unhandled error:', response.status);
        break;
    }

    // Always return the standardized error
    return Promise.reject(new Error(message));
  }
);
