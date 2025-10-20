import { connectToDatabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({
    success: true,
    message: "Connected to database",
  });
}
