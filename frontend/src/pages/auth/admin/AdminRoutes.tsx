// src/pages/AdminRoutes.tsx
import { Navigate } from "@tanstack/react-router";
import { useUser } from "../../../hooks/index";
import { useAuthStore } from "../../../stores/useAuthStore";

const AdminRoutes = ({ children }: { children: React.ReactNode }) => {
  const { loading, error } = useUser();
  const user = useAuthStore((s) => s.user);

  if (loading) return <div>Loading...</div>;

  if (error || !user || user?.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default AdminRoutes;
