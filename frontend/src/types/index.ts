export interface User {
  id: string;
  fullname: string;
  email: string;
  avatar: string | null;
  role: "user" | "admin";
  provider: "custom" | "google";
  isVerified: boolean;
}

export interface Session {
  id: string;
  deviceId: string;
  location: string;
  ip: string;
  lastActivity: string;
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
