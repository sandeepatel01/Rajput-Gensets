import { z } from "zod";

const strongPassword = z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(16, { message: "Password must be at most 16 characters long" })
      .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,}$/, {
            message:
                  "Password must contain at least one uppercase letter, one lowercase letter, number and one special character.",
      });

const registerSchema = z.object({
      fullname: z
            .string()
            .min(6, { message: "Fullname must be at least 6 characters long" })
            .max(50, { message: "Fullname must be at most 50 characters long" }),
      email: z.string().email({ message: "Invalid email address" }),
      password: strongPassword,
});

const loginSchema = registerSchema
      .pick({
            email: true,
            password: true,
      })
      .extend({
            keepSignedIn: z.boolean().default(false),
      });

const emailSchema = registerSchema.pick({
      email: true,
});

const changePasswordSchema = z
      .object({
            currentPassword: strongPassword,
            newPassword: strongPassword,
            confirmNewPassword: z.string(),
      })
      .refine((data) => data.newPassword === data.confirmNewPassword, {
            message: "Confirm password must match the new password",
            path: ["confirmNewPassword"],
      });

const resetPasswordSchema = z
      .object({
            password: strongPassword,
            confirmPassword: z.string(),
      })
      .refine((data) => data.password === data.confirmPassword, {
            message: "Confirm password must match the new password",
            path: ["confirmPassword"],
      });

export const validateRegister = (data) => {
      return registerSchema.safeParse(data);
};

export const validateLogin = (data) => {
      return loginSchema.safeParse(data);
};

export const validateEmail = (data) => {
      return emailSchema.safeParse(data);
};

export const validateChangePassword = (data) => {
      return changePasswordSchema.safeParse(data);
};

export const validateResetPassword = (data) => {
      return resetPasswordSchema.safeParse(data);
};
