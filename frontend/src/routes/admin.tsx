import { createFileRoute } from "@tanstack/react-router";
import AdminRoutes from "../pages/auth/admin/AdminRoutes";
import AdminDashboard from "../pages/auth/admin/AdminDashboard";

export const Route = createFileRoute("/admin")({
  component: () => (
    <AdminRoutes>
      <AdminDashboard />
    </AdminRoutes>
  ),
});
