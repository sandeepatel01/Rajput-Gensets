import z from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const RegisterSchema = LoginSchema.extend({
  fullname: z
    .string()
    .min(3, "Fullname must be at least 3 characters")
    .max(50, "Fullname must be at most 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Fullname must contain only letters and spaces"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be at most 32 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});
