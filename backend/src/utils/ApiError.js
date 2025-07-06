class ApiError extends Error {
      constructor(statusCode, message = "Something went wrong", stack = "", errors = null) {
            super(message);
            this.statusCode = statusCode;
            this.success = false;
            this.data = null;
            this.errors = errors;
            this.name = "ApiError";

            if (stack) {
                  this.stack = stack;
            } else {
                  Error.captureStackTrace(this, this.constructor);
            }
      }
}

export { ApiError };
