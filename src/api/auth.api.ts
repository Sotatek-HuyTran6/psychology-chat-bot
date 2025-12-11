import axiosInstance from '../config/axios.config';
import type {
  ApiResponse,
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
  User,
} from '../types/auth.types';

// Base endpoint
const AUTH_ENDPOINTS = {
  SIGN_UP: '/users',
  SIGN_IN: '/auth/login',
  SIGN_OUT: '/auth/signout',
  REFRESH: '/auth/refresh',
  ME: '/auth/profile',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  VERIFY_EMAIL: '/auth/verify-email',
};

// Auth API Service
export const authApi = {
  /**
   * Đăng ký tài khoản mới
   */
  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.SIGN_UP, data);
    return response.data!;
  },

  /**
   * Đăng nhập
   */
  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post<AuthResponse>(AUTH_ENDPOINTS.SIGN_IN, data);

    // Lưu tokens vào localStorage
    if (response.data) {
      const { access_token, refresh_token, user } = response.data;

      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return response.data!;
  },

  /**
   * Đăng xuất
   */
  signOut: async (): Promise<void> => {
    try {
      await axiosInstance.post(AUTH_ENDPOINTS.SIGN_OUT);
    } finally {
      // Clear localStorage dù API có lỗi hay không
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth-storage');
    }
  },

  /**
   * Refresh access token
   */
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<ApiResponse<RefreshTokenResponse>>(
      AUTH_ENDPOINTS.REFRESH,
      data,
    );
    return response.data.data!;
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await axiosInstance.get<ApiResponse<User>>(AUTH_ENDPOINTS.ME);
    return response.data.data!;
  },

  /**
   * Quên mật khẩu - Gửi email reset
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<void> => {
    await axiosInstance.post<ApiResponse>(AUTH_ENDPOINTS.FORGOT_PASSWORD, data);
  },

  /**
   * Reset mật khẩu với token
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    await axiosInstance.post<ApiResponse>(AUTH_ENDPOINTS.RESET_PASSWORD, data);
  },

  /**
   * Đổi mật khẩu (khi đã đăng nhập)
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await axiosInstance.put<ApiResponse>(AUTH_ENDPOINTS.CHANGE_PASSWORD, data);
  },

  /**
   * Xác thực email
   */
  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post<ApiResponse>(`${AUTH_ENDPOINTS.VERIFY_EMAIL}/${token}`);
  },

  /**
   * Kiểm tra user có đăng nhập không
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  /**
   * Lấy access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  /**
   * Lấy refresh token
   */
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  /**
   * Lấy user từ localStorage
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authApi;
