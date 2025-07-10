import { createFileRoute } from "@tanstack/react-router";
import EmailVerification from "../../pages/auth/EmailVerification";

export const Route = createFileRoute("/verify-email/$token")({
  component: EmailVerification,
});
