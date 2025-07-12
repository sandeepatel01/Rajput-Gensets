import { useEffect, useState } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "react-toastify";
import { CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { fetchProfile, verifyEmail } from "../../services/authService";
import { useAuthStore } from "../../stores/useAuthStore";
import type { AxiosErrorResponse } from "../../types";

const EmailVerification = () => {
  const { token } = useParams({ strict: false }); // token from URL
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const verifyAndFetchProfile = async () => {
      if (!token) return;

      try {
        const res = await verifyEmail(token);
        if (res.success) {
          toast.success(res.message || "Email verified successfully.");
          setVerificationStatus("success");

          const profile = await fetchProfile();
          setUser(profile.data);

          let seconds = 3;
          setCountdown(seconds);
          const interval = setInterval(() => {
            seconds -= 1;
            setCountdown(seconds);
            if (seconds <= 0) clearInterval(interval);
          }, 1000);

          setTimeout(() => {
            toast.success("Login successful");
            navigate({ to: "/dashboard" });
          }, 3000);
        } else {
          throw new Error("Verification failed");
        }
      } catch (error: unknown) {
        const err = error as AxiosErrorResponse;
        toast.error(
          err?.response?.data?.message || "Email verification failed"
        );
        setVerificationStatus("error");
      }
    };

    verifyAndFetchProfile();
  }, [token]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "loading":
        return (
          <div className="text-center text-zinc-50 space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-zinc-200" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Verifying your email
              </h2>
              <p className="text-zinc-300/70">
                Please wait while we verify your email address...
              </p>
            </div>
          </div>
        );

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                Email Verified!
              </h2>
              <p className="text-zinc-300/70">
                Your email has been successfully verified. You can now access
                all features of your account.
              </p>
              <p className="text-sm text-zinc-100 mt-2">
                Redirecting to your dashboard in{" "}
                <span className="font-medium">{countdown}</span> second
                {countdown !== 1 && "s"}...
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: "/login" })}
              className="w-full"
              variant={"outline"}
            >
              Continue to Login
            </Button>
          </div>
        );

      case "error":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-200 mb-2">
                Verification Failed
              </h2>
              <p className="text-zinc-300/70">
                We couldn't verify your email. The link may be invalid or
                expired.
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: "/resend-verification" })}
              className="w-full"
              variant={"outline"}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend Verification Email
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <Card className="w-full max-w-md bg-zinc-900 border-white/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-50">
            Email Verification
          </CardTitle>
          <CardDescription className="text-zinc-300/70">
            Verify your email address to complete registration
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default EmailVerification;
