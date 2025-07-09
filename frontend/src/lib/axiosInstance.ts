import axios from "axios";
import { AUTH_PATH, BASE_URL } from "../constants";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // token expired → auto refresh once
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "TokenExpiredError" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        await axiosInstance.get(`${AUTH_PATH}/refresh-token`);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
