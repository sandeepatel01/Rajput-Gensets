import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../pages/auth/user/Dashboard";
import PrivateRoutes from "../pages/auth/user/PrivateRoutes";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <PrivateRoutes>
      <Dashboard />
    </PrivateRoutes>
  ),
});
