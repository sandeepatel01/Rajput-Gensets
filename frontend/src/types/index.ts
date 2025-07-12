export interface User {
  _id: string;
  fullname: string;
  email: string;
  avatar: string | null;
  role: "user" | "admin";
  provider: "custom" | "google";
  isVerified: boolean;
}

export interface Session {
  _id: string;
  device: string;
  location: string;
  ip: string;
  lastActivity: string | "Unknown";
  status: "active" | "expired";
  current?: boolean;
}

export interface AllUsers {
  id: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "inactive" | "expired";
  lastActivity: string;
  sessionsCount: number;
}

export interface BaseResponse {
  message: string;
  statusCode: number;
  success: boolean;
}

export interface ApiResponse<T> extends BaseResponse {
  data: T;
}

export interface RegisterFormData {
  email: string;
  password: string;
  fullname: string;
  avatar?: File | null;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface ResendVerificationFormData {
  email: string;
}
export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}
