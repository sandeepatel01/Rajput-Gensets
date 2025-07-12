import mongoose from "mongoose";
import { ProviderEnum, UserRolesEnum } from "../utils/constants.js";

const userSchema = new mongoose.Schema({
      fullname: {
            type: String,
            required: true
      },
      email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
      },
      password: {
            type: String
      },
      avatar: {
            type: String,
            default:
                  "https://res.cloudinary.com/dye5okklc/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1752310267/rgs_logo_dobjsx.png",
      },
      role: {
            type: String,
            required: true,
            enum: Object.values(UserRolesEnum),
            default: UserRolesEnum.USER
      },
      provider: {
            type: String,
            enum: Object.values(ProviderEnum),
            default: ProviderEnum.CUSTOM
      },
      isVerified: {
            type: Boolean,
            required: true,
            default: false
      },
      verificationToken: {
            type: String
      },
      verificationTokenExpiry: {
            type: Date
      },
      resetPasswordToken: {
            type: String
      },
      resetPasswordTokenExpiry: {
            type: Date
      },
      sessions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Session',
            required: true
      }],

}, { timestamps: true });

export const User = mongoose.model("User", userSchema);