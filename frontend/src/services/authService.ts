import { AUTH_PATH } from "../constants";
import axiosInstance from "../lib/axiosInstance";
import type { ApiResponse, User } from "../types";

export const registerUser = async (data: FormData) => {
  const res = await axiosInstance.post<ApiResponse<User>>(
    `${AUTH_PATH}/register`,
    data
  );
  return res.data;
};
