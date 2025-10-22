import { ApiResponse } from "./ApiResponse";

export const ApiError = (error: any, message: string) => {
  // Handle duplicate key errors
  if (error.code === 11000) {
    const key = Object.keys(error.keyPattern).join(", ");
    return `Duplicate fields: ${key}. These fields must be unique.`;
  }

  let errorObject = {};

  if (process.env.NODE_ENV === "development") {
    errorObject = {
      message: error.message,
      error,
    };
  } else {
    errorObject = { message: message || "Internal Server Error", error };
  }

  return ApiResponse(false, error.code, ...errorObject);
};
