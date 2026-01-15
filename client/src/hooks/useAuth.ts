import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuthToken, deleteAuthToken } from "@/lib/cookies";
import { getProfile } from "@/lib/auth";

// Custom hook to check auth and redirect
export function useAuth() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      router.push("/signin");
      setIsLoading(false);
    } else {
      setToken(storedToken);
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
    }
  }, [router]);

  const logout = () => {
    deleteAuthToken();
    router.push("/signin");
  };

  return { token, isLoading, logout, role };
}

// Hook to get auth header for API calls
export function useAuthHeader() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(getAuthToken());
  }, []);

  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
}
