import { AUTH_PATH } from "../constants";
import axiosInstance from "../lib/axiosInstance";
import type {
  ApiResponse,
  ForgotPasswordFormData,
  LoginFormData,
  ResendVerificationFormData,
  ResetPasswordFormData,
  Session,
  User,
} from "../types";

export const register = async (data: FormData) => {
  const res = await axiosInstance.post<ApiResponse<User>>(
    `${AUTH_PATH}/register`,
    data
  );
  return res.data;
};

export const login = async (data: LoginFormData) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/login`,
    data
  );
  return res.data;
};

export const googleLogin = async (data: {
  token: string;
  rememberMe?: boolean;
}) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/google-login`,
    data
  );
  return res.data;
};

export const verifyEmail = async (token: string) => {
  const res = await axiosInstance.get<ApiResponse<null>>(
    `${AUTH_PATH}/verify/${token}`
  );
  return res.data;
};

export const resendVerification = async (data: ResendVerificationFormData) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/email/resend`,
    data
  );
  return res.data;
};

export const forgotPassword = async (data: ForgotPasswordFormData) => {
  const res = await axiosInstance.post<
    ApiResponse<null> | ApiResponse<{ code: string }>
  >(`${AUTH_PATH}/password/forgot`, data);
  return res.data;
};

export const resetPassword = async ({
  token,
  password,
  confirmPassword,
}: ResetPasswordFormData) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/password/reset/${token}`,
    { password, confirmPassword }
  );
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/logout`
  );
  return res.data;
};

export const logoutAllSessions = async () => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/logout-all-sessions`
  );
  return res.data;
};

export const logoutSpecificSession = async (sessionId: string) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/session/${sessionId}`
  );
  return res.data;
};

export const fetchUserSessions = async () => {
  const res = await axiosInstance.get<ApiResponse<Session[]>>(`
    ${AUTH_PATH}/sessions`);
  return res.data;
};
