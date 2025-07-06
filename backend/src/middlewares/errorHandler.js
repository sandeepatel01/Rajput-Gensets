import { MulterError } from "multer";
import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (error, req, res, next) => {
      let customError;

      // Duplicate Key Error
      if (error.code === 11000) {
            const field = Object.keys(error.keyValue || {})[0];
            customError = new ApiError(409, `${field} already exists`);
      }

      // Cast Error (e.g., invalid ObjectId)
      else if (error.name === "CastError") {
            customError = new ApiError(400, `Invalid ${error.path}: ${error.value}`);
      }

      // Validation Error
      else if (error.name === "ValidationError") {
            const messages = Object.values(error.errors || {}).map(err => err.message);
            customError = new ApiError(422, messages.join(", "));
      }

      // File Upload Error
      else if (error instanceof MulterError) {
            let message = "File upload error";
            switch (error.code) {
                  case "LIMIT_FILE_SIZE":
                        message = "File too large. Maximum size allowed is 2MB.";
                        break;
                  case "LIMIT_UNEXPECTED_FILE":
                        message = "Too many files. Only 1 file is allowed.";
                        break;
            }
            customError = new ApiError(400, message);
      }

      // Custom ApiError
      else if (error instanceof ApiError) {
            customError = error;
      }

      // Unknown Error
      else {
            customError = new ApiError(500, error.message || "Internal Server Error", error.stack);
      }

      console.error(`[ERROR] ${req.method} ${req.path} → ${customError.message}`);
      if (process.env.NODE_ENV === "development") {
            console.error(customError.stack || error.stack);
      }

      res.status(customError.statusCode).json({
            success: false,
            code: customError.statusCode,
            message: customError.message,
            data: customError.data,
            errors: customError.errors,
            stack: process.env.NODE_ENV === "development" ? customError.stack : undefined,
      });
};
