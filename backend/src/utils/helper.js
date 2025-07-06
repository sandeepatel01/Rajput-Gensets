import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
      return await bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (user) => {
      return jwt.sign(
            {
                  id: user._id,
                  email: user.email,
                  role: user.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
};

export const generateRefreshToken = (user) => {
      return jwt.sign(
            {
                  id: user._id,
                  email: user.email,
                  role: user.role,
            },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
      );
};

export const hashToken = (token) => {
      return crypto.createHash("sha256").update(token).digest("hex");
};

export const generateToken = () => {
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = hashToken(token);
      const tokenExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

      return {
            token,
            hashedToken,
            tokenExpiry,
      };
};