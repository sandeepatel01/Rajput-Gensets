import { NextResponse } from "next/server";

export const ApiResponse = (
  success: boolean,
  status: number,
  message: string,
  data = {}
) => {
  return NextResponse.json({
    success: success,
    status: status,
    message: message,
    data: data,
  });
};
