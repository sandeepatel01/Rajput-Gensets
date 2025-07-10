import { createFileRoute } from "@tanstack/react-router";
import ResendVerification from "../pages/auth/ResendVerification";

export const Route = createFileRoute("/resend-verification")({
  component: ResendVerification,
});
