import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
            statusCode: 429,
            message: "Too many requests, please try again later.",
            date: null,
            success: false
      }
});

export const resendVerificationMailRateLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // limit each IP to 5 requests per windowMs
      message: {
            statusCode: 429,
            message: "Too many requests, please try again later.",
            date: null,
            success: false
      }
});

export const forgotPasswordRateLimiter = rateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 5, // limit each IP to 5 requests per windowMs
      message: {
            statusCode: 429,
            message: "Too many requests, please try again later.",
            date: null,
            success: false
      }
});