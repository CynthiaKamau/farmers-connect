import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { getAuthToken, deleteAuthToken } from "@/lib/cookies";
import { getProfile } from "@/lib/auth";

// Helper to safely get token (SSR-safe)
const getInitialToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return getAuthToken();
};

// Custom hook to check auth and redirect
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token] = useState<string | null>(getInitialToken);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      router.push("/signin");
      return;
    }
    
    // Fetch user profile to get role
    getProfile()
      .then((profile) => {
        setRole(profile?.role?.name || null);
      })
      .catch(() => {
        setRole(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [router, token]);

  const logout = useCallback(() => {
    deleteAuthToken();
    router.push("/signin");
  }, [router]);

  return { token, isLoading, logout, role };
}

// Hook to get auth header for API calls
export function useAuthHeader() {
  const [token] = useState<string | null>(getInitialToken);

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}
