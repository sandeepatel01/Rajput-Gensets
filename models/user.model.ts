import { Schema, model, models } from "mongoose";
import bcrypt, { compare } from "bcryptjs";

export interface IUser {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, select: false },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      url: { type: String, trim: true },
      public_id: { type: String, trim: true },
    },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    isEmailVerified: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null, index: true },
  },

  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods = {
  comparePassword: async function (password: string) {
    return await compare(password, this.password);
  },
};

const User = models?.User || model<IUser>("User", userSchema);

export default User;
