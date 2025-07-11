import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff, Loader2, Lock, LogIn, Mail } from "lucide-react";

import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";

import type { LoginFormData, AxiosErrorResponse } from "../../types/index";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  fetchProfile,
  googleLogin,
  login as loginUser,
} from "../../services/authService";

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      setIsLoading(true);
      const response = await loginUser(data);
      const profile = await fetchProfile();
      setUser(profile.data);

      toast.success(response.message);
      navigate({ to: "/dashboard" });
    } catch (error: unknown) {
      const err = error as AxiosErrorResponse;
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card className="w-full bg-zinc-900 max-w-md border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-300/70">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Google Login */}
          <div className="flex items-center justify-center w-full">
            <GoogleLogin
              theme="outline"
              text="continue_with"
              onSuccess={async (credentialResponse) => {
                try {
                  const idToken = credentialResponse.credential;
                  if (!idToken) throw new Error("Google token missing");
                  await googleLogin({ token: idToken, rememberMe });

                  const profile = await fetchProfile();
                  setUser(profile.data);

                  toast.success("Login successful.");
                  navigate({ to: "/dashboard" });
                } catch (error: unknown) {
                  const err = error as AxiosErrorResponse;
                  toast.error(
                    err.response?.data?.message || "Google login failed."
                  );
                }
              }}
              onError={() => toast.error("Google login failed.")}
            />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-300/70">
                Or continue with
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-50">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                <Input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-50">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-300/70" />
                <Input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Min 6 characters" },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 border rounded border-white/10 bg-zinc-900 text-zinc-200 focus-visible:ring-zinc-50 focus-visible:ring-[1px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-300/70 hover:text-zinc-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm text-zinc-300/90 cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-zinc-300/90 hover:text-zinc-400"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full cursor-pointer py-5 rounded-[4px] text-zinc-700"
              variant="outline"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Bottom Links */}
          <div className="flex flex-col gap-2">
            <div className="text-center text-sm">
              <span className="text-zinc-300/60">Don’t have an account? </span>
              <Link
                to="/register"
                className="hover:underline text-zinc-200 font-medium"
              >
                Sign up
              </Link>
            </div>
            <div className="text-center text-sm">
              <span className="text-zinc-300/60">
                Need to verify your email?{" "}
              </span>
              <Link
                to="/resend-verification"
                className="hover:underline text-zinc-200 font-medium"
              >
                Resend verification
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
