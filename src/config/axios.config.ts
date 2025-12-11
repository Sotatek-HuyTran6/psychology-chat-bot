import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios, { AxiosError } from 'axios';

// Base URL cho API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Biến để lưu promise refresh token đang chạy
let refreshTokenPromise: Promise<string> | null = null;

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Log error (chỉ trong development)
    if (import.meta.env.DEV) {
      console.error('❌ Response Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    // Handle 401 Unauthorized - Token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      try {
        // Nếu đã có một refresh token request đang chạy, chờ nó
        if (!refreshTokenPromise) {
          refreshTokenPromise = (async () => {
            try {
              const refreshToken = localStorage.getItem('refresh_token');

              if (!refreshToken) {
                throw new Error('No refresh token');
              }

              // Call API refresh token
              const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                refresh_token: refreshToken,
              });

              const { access_token: accessToken, refresh_token: newRefreshToken } = response.data;

              // Lưu token mới
              localStorage.setItem('access_token', accessToken);
              if (newRefreshToken) {
                localStorage.setItem('refresh_token', newRefreshToken);
              }

              return accessToken;
            } finally {
              // Reset promise sau khi hoàn thành
              refreshTokenPromise = null;
            }
          })();
        }

        // Chờ refresh token hoàn thành
        const newAccessToken = await refreshTokenPromise;

        // Retry request với token mới
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        refreshTokenPromise = null;
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied. You do not have permission.');
      // Có thể show notification hoặc redirect
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found.');
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Internal server error. Please try again later.');
    }

    // Handle Network Error
    if (!error.response) {
      console.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  },
);

// Helper function để logout
const handleLogout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('mental-health-storage');
  localStorage.removeItem('mental-health-storage');
  window.location.reload();
};

export default axiosInstance;
