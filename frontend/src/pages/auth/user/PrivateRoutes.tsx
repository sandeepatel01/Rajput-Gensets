import { Navigate } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useUser } from "../../../hooks/index";

const PrivateRoutes = ({ children }: { children: React.ReactNode }) => {
  const { loading, error } = useUser();
  const user = useAuthStore((s) => s.user);

  if (loading) return <div>Loading...</div>;

  if (error || !user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default PrivateRoutes;
