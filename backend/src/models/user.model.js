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
            type: {
                  url: String,
                  localpath: String
            },
            default: {
                  url: `https://placehold.co/600x400`,
                  localpath: ""
            }
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