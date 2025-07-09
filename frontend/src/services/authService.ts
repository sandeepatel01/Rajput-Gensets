import { AUTH_PATH } from "../constants";
import axiosInstance from "../lib/axiosInstance";
import type { ApiResponse, LoginFormData, User } from "../types";

export const registerUser = async (data: FormData) => {
  const res = await axiosInstance.post<ApiResponse<User>>(
    `${AUTH_PATH}/register`,
    data
  );
  return res.data;
};

export const loginUser = async (data: LoginFormData) => {
  const res = await axiosInstance.post<ApiResponse<null>>(
    `${AUTH_PATH}/login`,
    data
  );
  return res.data;
};
