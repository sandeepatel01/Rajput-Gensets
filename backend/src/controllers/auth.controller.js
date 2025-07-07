import ms from "ms";
import { cloudinaryUpload } from "../lib/cloudinary";
import { sendVerificationMail } from "../lib/sendMail";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { comparePassword, generateAccessToken, generateRefreshToken, generateToken, hashToken } from "../utils/helper";
import { sanitizeUser } from "../utils/sanitizeUser";
import { Session } from "../models/session.model";
import { generateCookieOptions } from "../lib/generateCookieOptions";
import { zodErrorHandler } from "../utils/zodErrorHandler";
import { validateEmail, validateLogin } from "../validators/authValidation";
import { ht } from "date-fns/locale";

const register = asyncHandler(async (req, res) => {
      const { fullname, email, password } = req.body;

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

export {
      register,
      verifyEmail,
      resendVerificationMail,
      login,
      logout
}