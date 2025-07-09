import { useEffect, useState } from "react";
import { fetchProfile } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";

export const useUser = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchProfile();
        setUser(res.data);
      } catch {
        logout();
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return { loading, error };
};
