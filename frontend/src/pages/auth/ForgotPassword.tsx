import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";

import { forgotPassword } from "../../services/authService";
import type {
  AxiosErrorResponse,
  ForgotPasswordFormData,
  ApiResponse,
} from "../../types";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ArrowLeft, Loader2, Mail, RefreshCw, Send } from "lucide-react";

type ForgotPasswordResponseData = {
  code?: string;
} | null;

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordFormData>();

  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    try {
      setIsLoading(true);
      const response: ApiResponse<ForgotPasswordResponseData> =
        await forgotPassword(data);

      if (response.data?.code === "OAUTH_USER") {
        toast.success(response.message);
        setEmailSent(false);
        return;
      }

      setEmailSent(true);
      toast.success(response.message);
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err?.response?.data?.message || "Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-900">
        <Card className="w-full bg-zinc-900 max-w-md border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-zinc-50">
              Check your email
            </CardTitle>
            <CardDescription className="text-zinc-300/70">
              We've sent password reset instructions to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Card className="border-white/10 pt-0 text-center w-full bg-zinc-900">
              <CardContent className="pt-6 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="bg-zinc-800 p-4 rounded-full">
                    <Mail className="h-12 w-12 text-zinc-50" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                    Password reset email sent
                  </h3>
                  <p className="text-zinc-300/70 text-sm">
                    We've sent a password reset link to{" "}
                    <strong className="text-zinc-100 font-medium">
                      {getValues("email")}
                    </strong>
                    . Please check your email and follow the instructions.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-zinc-300/70 text-sm">
                    Didn't receive the email? Check your spam folder or try
                    again.
                  </p>
                  <Button
                    onClick={() => setEmailSent(false)}
                    variant="outline"
                    className="w-full cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Send again
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-white/10 mt-6">
              <CardContent className="pt-0 text-center space-y-2">
                <p className="text-zinc-300/70 text-sm">
                  Remember your password?{" "}
                  <span
                    className="text-zinc-100 hover:underline cursor-pointer"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    Back to login
                  </span>
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card className="w-full max-w-md bg-zinc-900 border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Forgot your password?
          </CardTitle>
          <CardDescription className="text-zinc-300/70">
            Enter your email and we'll send you a reset link
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-50">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
              <p className="text-xs text-zinc-300/70 mt-1">
                Enter the email address associated with your account and we'll
                send you a link to reset your password.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
              variant={"outline"}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reset Link
                </>
              )}
            </Button>
          </form>

          <Card className="bg-zinc-900 border-white/10">
            <CardContent className="text-center space-y-1">
              <p className="text-zinc-300/60 text-sm">
                <span
                  onClick={() => navigate({ to: "/login" })}
                  className="hover:text-zinc-200 inline-flex items-center cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to login
                </span>
              </p>
              <p className="text-zinc-300/60 text-sm">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate({ to: "/register" })}
                  className="text-zinc-100 hover:underline cursor-pointer"
                >
                  Sign up
                </span>
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
