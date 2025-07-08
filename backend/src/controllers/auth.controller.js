import ms from "ms";
import jwt from "jsonwebtoken";
import { cloudinaryUpload } from "../lib/cloudinary.js";
import { sendResetPasswordMail, sendVerificationMail } from "../lib/sendMail.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler";
import { comparePassword, generateAccessToken, generateRefreshToken, generateToken, hashToken } from "../utils/helper.js";
import { sanitizeUser } from "../utils/sanitizeUser.js";
import { Session } from "../models/session.model.js";
import { generateCookieOptions } from "../lib/generateCookieOptions.js";
import { zodErrorHandler } from "../utils/zodErrorHandler.js";
import { validateEmail, validateLogin, validateRegister, validateResetPassword } from "../validators/authValidation.js";
import { ProviderEnum } from "../utils/constants.js";
import { sessionFormatter } from "../utils/sessionFormatter.js";
import { verifyGoogleToken } from "../utils/verifyGoogleToken.js";

const register = asyncHandler(async (req, res) => {
      const { fullname, email, password } = zodErrorHandler(validateRegister(req.body));

      const existingUser = await User.findOne({
            $or: [
                  { email },
                  { fullname }
            ]
      });

      if (existingUser) {
            throw new ApiError(400, "User already exists");
      };

      const hashedPassword = await hashPassword(password);
      const { token, hashedToken, tokenExpiry } = generateToken();

      let avatarURL;
      if (req.file) {
            try {
                  const uploadedFile = await cloudinaryUpload(req.file.path);
                  avatarURL = uploadedFile?.secure_url;
                  console.log("Avatar uploaded successfully: ", { email, avatarURL });
            } catch (error) {
                  console.error(`Avatar upload failed for ${email}: `, error);
            }
      };

      const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            avatar: avatarURL,
            verificationToken: hashedToken,
            verificationTokenExpiry: tokenExpiry
      });

      await sendVerificationMail(user.fullname, user.email, token);

      console.log("Verification email sent successfully: ", { email, userId: user._id, IP: req.ip });
      console.log("User registered successfully: ", { email, userId: user._id, IP: req.ip });

      const safeUser = sanitizeUser(user);

      res.status(201).json(new ApiResponse(201, "User registered successfully", safeUser));
});

const verifyEmail = asyncHandler(async (req, res) => {
      const { token } = req.params;

      if (!token) throw new ApiError(400, "Token not found");

      const hashedToken = hashToken(token);

      const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpiry: { $gt: Date.now() }
      });

      if (!user) throw new ApiError(400, "Verification token is invalid or expired");

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const hashedRefreshToken = hashToken(refreshToken);

      const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRY));

      await User.findByIdAndUpdate(user._id, {
            isVerified: true,
            verificationToken: null,
            verificationTokenExpiry: null,
      });

      await Session.create({
            userId: user._id,
            userAgent: req.headers["user-agent"],
            ipAddress: req.ip,
            refreshToken: hashedRefreshToken,
            expiresAt,
      });

      console.log("User verified successfully: ", { email: user.email, userId: user._id, IP: req.ip });

      res
            .status(200)
            .cookie("accessToken", accessToken, generateCookieOptions())
            .cookie("refreshToken", refreshToken, generateCookieOptions())
            .json(new ApiResponse(200, "User verified successfully", null));

});

const resendVerificationMail = asyncHandler(async (req, res) => {
      const { email } = zodErrorHandler(validateEmail(req.body));
      const user = await User.findOne({ email });

      if (!user) throw new ApiError(400, "User not found");
      if (user.isVerified) throw new ApiError(400, "User is already verified");

      const { token, hashedToken, tokenExpiry } = generateToken();

      await User.findByIdAndUpdate(email, {
            verificationToken: hashedToken,
            verificationTokenExpiry: tokenExpiry
      });

      await sendVerificationMail(user.fullname, user.email, token);

      console.log("Verification email resent successfully: ", { email, userId: user._id, IP: req.ip });

      res.status(200).json(new ApiResponse(200, "Verification email resent successfully", null));
});

const login = asyncHandler(async (req, res) => {
      const { email, password, keepSignedIn } = zodErrorHandler(validateLogin(req.body));

      const user = await User.findOne({ email });
      if (!user) throw new ApiError(400, "User not found");

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

      if (!user.isVerified) throw new ApiError(400, "User is not verified");

      const userAgent = req.headers["user-agent"];
      const ipAddress = req.ip;

      const existingSession = await Session.findOne({
            userId: user._id,
            userAgent,
            ipAddress
      });

      const existingSessionsCount = await Session.countDocuments({
            userId: user._id,
      });

      if (!existingSession && existingSessionsCount >= process.env.MAX_SESSIONS) {
            throw new ApiError(400, "You have reached the maximum number of sessions. Please log out of an existing session to create a new one.");
      };

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const hashedRefreshToken = hashToken(refreshToken);

      const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRY));

      if (existingSession) {
            await Session.findByIdAndUpdate(existingSession._id, {
                  refreshToken: hashedRefreshToken,
                  expiresAt
            });
      } else {
            await Session.create({
                  userId: user._id,
                  userAgent,
                  ipAddress,
                  refreshToken: hashedRefreshToken,
                  expiresAt,
            });
      };

      console.log("User logged in successfully: ", { email, userId: user._id, IP: req.ip });

      res
            .status(200)
            .cookie("accessToken", accessToken, generateCookieOptions())
            .cookie("refreshToken", refreshToken, generateCookieOptions({ rememberMe: keepSignedIn }))
            .json(new ApiResponse(200, "User logged in successfully", null));

});

const logout = asyncHandler(async (req, res) => {
      const { refreshToken } = req.cookies;
      const { _id: id, email } = req.user;

      if (!refreshToken) throw new ApiError(400, "Refresh token not found");

      const hashedRefreshToken = hashToken(refreshToken);

      try {
            await Session.findOneAndDelete({
                  refreshToken: hashedRefreshToken
            });

            console.log("User logged out successfully: ", { email, userId: id, IP: req.ip });
      } catch (error) {
            console.error("User logout failed: ", { email, userId: id, IP: req.ip });
      }

      res
            .status(200)
            .clearCookie("accessToken", {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
            })
            .clearCookie("refreshToken", {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
            })
            .json(new ApiResponse(200, "User logged out successfully", null));
});

const forgotPassword = asyncHandler(async (req, res) => {
      const { email } = zodErrorHandler(validateEmail(req.body));

      const user = await User.findOne({ email });
      if (!user) {
            return res
                  .status(200)
                  .json(
                        new ApiResponse(200, "if you have an account with us, we will send you an email to forget your password", null)
                  );
      };

      if (!user.provider !== ProviderEnum.CUSTOM) {
            return res
                  .status(200)
                  .json(
                        new ApiResponse(200, "You signed up using Google. Please use Google Sign-in to access your account.", {
                              code: "OAUTH_USER",
                        })
                  );
      };

      const { token, hashedToken, tokenExpiry } = generateToken();

      await User.findByIdAndUpdate(user._id, {
            passwordResetToken: hashedToken,
            passwordResetTokenExpiry: tokenExpiry
      });

      await sendResetPasswordMail(user.fullName, user.email, token);
      console.log("Password forget email sent successfully: ", { email, userId: user._id, IP: req.ip });

      res
            .status(200)
            .json(new ApiResponse(200, "if you have an account with us, we will send you an email to forget your password", null));
});

const resetPassword = asyncHandler(async (req, res) => {
      const { token } = req.params;
      const { password } = zodErrorHandler(validateResetPassword(req.body));

      if (!token) {
            throw new ApiError(400, "Token not found");
      };

      const hashedToken = hashToken(token);
      const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordTokenExpiry: { $gt: Date.now() }
      });

      if (!user) {
            throw new ApiError(400, "Reset password token is invalid or expired");
      };

      const isPasswordValid = await comparePassword(password, user.password);
      if (isPasswordValid) {
            throw new ApiError(400, "New password must be different from the current password");
      };

      const hashedPassword = await hashPassword(password);

      await User.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordTokenExpiry: null
      });

      await Session.deleteMany({ userId: user._id });

      console.log("Password reset successfully: ", { email: user.email, userId: user._id, IP: req.ip });

      res
            .status(200)
            .json(new ApiResponse(200, "Password reset successfully", null));

});

const refreshAccessToken = asyncHandler(async (req, res) => {
      const incomingRefreshToken = req.cookies?.refreshToken;
      if (!incomingRefreshToken) {
            throw new ApiError(400, "Refresh token not found");
      };

      let decodedToken;
      try {
            decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
      } catch (error) {
            throw new ApiError(400, "Invalid refresh token");
      };

      const hashedIncomingRefreshToken = hashToken(incomingRefreshToken);
      const validToken = await Session.findOne({
            refreshToken: hashedIncomingRefreshToken
      });

      if (!validToken) {
            throw new ApiError(400, "Invalid refresh token");
      };

      const incomingUserAgent = req.headers["user-agent"];
      const incomingIP = req.ip;

      if (validToken.userAgent !== incomingUserAgent || validToken.ipAddress !== incomingIP) {
            const result = await Session.deleteOne({ _id: validToken._id });
            if (result.deletedCount === 0) {
                  throw new ApiError(404, "Session not found");
            }

            throw new ApiError(400, "Session has expired. Please log in again.");
      };

      const accessToken = generateAccessToken(decodedToken);
      const refreshToken = generateRefreshToken(decodedToken);

      const hashedRefreshToken = hashToken(refreshToken);

      await Session.findByIdAndUpdate(validToken.id, {
            refreshToken: hashedRefreshToken,
      });

      console.log("Access token refreshed successfully");

      res
            .status(200)
            .cookie("accessToken", accessToken, generateCookieOptions())
            .cookie("refreshToken", refreshToken, generateCookieOptions({ rememberMe: validToken.keepSignedIn }))
            .json(new ApiResponse(200, "Access token refreshed successfully", null));

});

const logoutAllSessions = asyncHandler(async (req, res) => {
      const { id } = req.user;
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
            throw new ApiError(400, "Refresh token not found");
      };

      const hashedRefreshToken = hashToken(refreshToken);

      await Session.deleteMany({
            userId: id,
            refreshToken: { $ne: hashedRefreshToken },
      });

      console.log("Logout all sessions");

      res
            .status(200)
            .json(new ApiResponse(200, "Logout all sessions successfully", null));

});

const getActiveSessions = asyncHandler(async (req, res) => {
      const { id: userId } = req.user;

      const currentRefreshToken = req.cookies.refreshToken;
      const hashedRefreshToken = hashToken(currentRefreshToken);

      const sessions = await Session.find({ userId })
            .select("id ipAddress userAgent updatedAt expiresAt refreshToken")
            .sort({ createdAt: -1 })
            .lean();

      const setCurrentFlag = sessions.map(session => ({
            ...session,
            isCurrent: session.refreshToken === hashedRefreshToken
      }));

      const removeRefreshToken = setCurrentFlag.map(({
            refreshToken,
            ...rest
      }) => rest);
      const formattedSessions = await sessionFormatter(removeRefreshToken);

      res
            .status(200)
            .json(new ApiResponse(200, "Get active sessions successfully", formattedSessions));

});

const logoutSpecificSession = asyncHandler(async (req, res) => {
      const { id } = req.user;
      const { sessionId } = req.params;

      const session = await Session.findById(sessionId);

      if (!session || session.userId.toString() !== id.toString()) {
            throw new CustomError(401, "Invalid session ID");
      }

      await Session.deleteOne({ _id: sessionId });
      console.log("User logged out of specific session");

      res
            .status(200)
            .json(new ApiResponse(200, "User logged out of specific session successfully", null));

});

const loginWithGoogle = asyncHandler(async (req, res) => {
      const { token, keepSignedIn } = req.body;
      const payload = await verifyGoogleToken(token);

      const { name, email, picture } = payload;
      if (!name || !email || !picture) {
            throw new ApiError(400, "Invalid Google token");
      };

      const existingUser = await User.findOne({ email });

      let user = existingUser;
      if (!user) {
            user = await User.create({
                  email,
                  fullname: name,
                  isVerified: true,
                  avatar: picture,
                  provider: ProviderEnum.GOOGLE,
            });
      };

      const userAgent = req.headers["user-agent"];
      const ipAddress = req.ip;

      const existingSession = await Session.findOne({
            userId: user._id,
            userAgent,
            ipAddress
      });

      const existingSessionsCount = await Session.countDocuments({
            userId: user._id,
      });

      if (!existingSession && existingSessionsCount >= process.env.MAX_SESSIONS) {
            throw new ApiError(400, "You have reached the maximum number of sessions. Please log out of an existing session to create a new one.");
      };

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      const hashedRefreshToken = hashToken(refreshToken);
      const expiresAt = new Date(Date.now() + ms(process.env.REFRESH_TOKEN_EXPIRY));

      if (existingSession) {
            // Update refreshToken + expiry for existing session
            await Session.updateOne(
                  { _id: existingSession._id },
                  {
                        $set: {
                              refreshToken: hashedRefreshToken,
                              expiresAt,
                        },
                  }
            );
      } else {
            // Create new session
            await Session.create({
                  userId: user._id,
                  userAgent,
                  ipAddress,
                  refreshToken: hashedRefreshToken,
                  expiresAt,
            });
      };

      console.log(`User ${user.email} logged in with Google successfully`);

      res
            .status(200)
            .cookie("accessToken", accessToken, generateCookieOptions())
            .cookie("refreshToken", refreshToken, generateCookieOptions({ rememberMe: keepSignedIn }))
            .json(new ApiResponse(200, "User logged in with Google successfully", null));

});

const getProfile = asyncHandler(async (req, res) => {
      const { id } = req.user;
      const user = await User.findById(id);

      if (!user) {
            throw new ApiError(404, "User not found");
      };

      const safeUser = sanitizeUser(user);
      console.log("User profile retrieved successfully", { email: user.email, userId: user._id, IP: req.ip });

      res
            .status(200)
            .json(new ApiResponse(200, "Get profile successfully", safeUser));
});

export {
      register,
      verifyEmail,
      resendVerificationMail,
      login,
      logout,
      forgotPassword,
      resetPassword,
      refreshAccessToken,
      logoutAllSessions,
      getActiveSessions,
      logoutSpecificSession,
      loginWithGoogle,
      getProfile
};