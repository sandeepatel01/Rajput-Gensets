import ms from "ms";
import { cloudinaryUpload } from "../lib/cloudinary";
import { sendVerificationMail } from "../lib/sendMail";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateAccessToken, generateRefreshToken, generateToken, hashToken } from "../utils/helper";
import { sanitizeUser } from "../utils/sanitizeUser";
import { Session } from "../models/session.model";
import { generateCookieOptions } from "../lib/generateCookieOptions";

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

export {
      register,
      verifyEmail
}