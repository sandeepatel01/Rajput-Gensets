import { AUTH_PATH } from "../constants";
import axiosInstance from "../lib/axiosInstance";
import type {
  ApiResponse,
  LoginFormData,
  ResendVerificationFormData,
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
