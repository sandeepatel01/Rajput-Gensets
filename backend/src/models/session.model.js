import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
      },
      refreshToken: {
            type: String,
            required: true,
            unique: true
      },
      keepSignedIn: {
            type: Boolean,
            default: false,
            required: true
      },
      deviceInfo: {
            type: String
      },
      userAgent: {
            type: String,
      },
      ipAddress: {
            type: String
      },
      expiresAt: {
            type: Date,
            required: true
      }
},
      { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);