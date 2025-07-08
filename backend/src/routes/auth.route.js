import { Router } from "express";
import { authRateLimiter, forgotPasswordRateLimiter, resendVerificationMailRateLimiter } from "../middlewares/rateLimit.js";
import { upload } from "../middlewares/fileUpload.js";
import {
      forgotPassword,
      getActiveSessions,
      getProfile, login,
      loginWithGoogle,
      logout,
      logoutAllSessions,
      logoutSpecificSession,
      refreshAccessToken,
      register,
      resendVerificationMail,
      resetPassword,
      verifyEmail
} from "../controllers/auth.controller.js";
import { isLoggedIn } from "../middlewares/auth.js";

const router = Router();

router.route("/register").post(
      authRateLimiter,
      upload.fields([{ name: "avatar", maxCount: 1 }]),
      register
);
router.route("/verify/:token").get(verifyEmail);
router.route("/email/resend").post(resendVerificationMailRateLimiter, resendVerificationMail);
router.route("/login").post(authRateLimiter, login);
router.route("/password/forgot").post(forgotPasswordRateLimiter, forgotPassword);
router.route("/password/reset/:token").post(resetPassword);

router.route("/refresh-token").get(refreshAccessToken);

router.route("/logout").post(isLoggedIn, logout);
router.route("/logout-all-sessions").post(isLoggedIn, logoutAllSessions);
router.route("/sessions").get(isLoggedIn, getActiveSessions);
router.route("/session/:sessionId").post(isLoggedIn, logoutSpecificSession);

router.route("/login/google").post(loginWithGoogle);

router.route("/profile").post(isLoggedIn, getProfile);


export default router;