import { createFileRoute } from "@tanstack/react-router";
import AdminRoutes from "../pages/auth/admin/AdminRoutes";
import Dashboard from "../pages/auth/admin/Dashboard";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminRoutes>
      <Dashboard />
    </AdminRoutes>
  ),
});
