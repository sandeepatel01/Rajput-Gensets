import { cloudinaryUpload } from "../lib/cloudinary";
import { sendVerificationMail } from "../lib/sendMail";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { generateToken, hashPassword } from "../utils/helper";
import { sanitizeUser } from "../utils/sanitizeUser";

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

export {
      register
}