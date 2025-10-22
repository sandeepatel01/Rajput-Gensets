import { connectToDatabase } from "@/lib/db";
import { RegisterSchema } from "@/lib/validation";
import User from "@/models/user.model";
import { ApiResponse } from "@/utils/ApiResponse";
import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { sendMail } from "@/lib/SendMail";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const validationSchema = RegisterSchema.pick({
      fullname: true,
      email: true,
      password: true,
    });

    const payload = await request.json();
    const validatedData = validationSchema.safeParse(payload);

    if (!validatedData.success) {
      return ApiResponse(
        false,
        401,
        "Invalid or missing input fields",
        validatedData.error
      );
    }

    const { fullname, email, password } = validatedData.data;

    const existingUser = await User.exists({ email });

    if (existingUser) {
      return ApiResponse(true, 409, "User already exists");
    }

    const registation = new User({
      fullname,
      email,
      password,
    });

    await registation.save();

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);

    const token = await new SignJWT({ userId: registation._id })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    await sendMail(
      "Email Verification request from Rajput Gensets & Solar",
      email,
      `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`
    );

    return ApiResponse(
      true,
      200,
      "User registered successfully, Please verify your email"
    );
  } catch (error) {}
}
