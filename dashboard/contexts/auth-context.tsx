"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  getAccessToken: () => string | null;
  setAuth: (token: string, user: User) => void;
  hasRole: (role: string) => boolean;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "koompi_auth_token";
const USER_STORAGE_KEY = "koompi_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Check for existing session on mount
  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      setMounted(true);
      try {
        const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);
        // Note: We don't rely solely on storedUser anymore, we verify the token
        // But for initial render speed we can use it, then verify.

        if (storedToken) {
          // Verify with backend
          // Assuming backend running on localhost:8081 for dev, use env var in prod
          const backendUrl = "http://localhost:8081";

          try {
            const res = await fetch(`${backendUrl}/auth/me`, {
              headers: {
                Authorization: `Bearer ${storedToken}`,
              },
            });

            if (res.ok) {
              const userProfile = await res.json();

              setAccessToken(storedToken);
              setUser(userProfile);
              // Update stored user to match backend
              localStorage.setItem(
                USER_STORAGE_KEY,
                JSON.stringify(userProfile),
              );
            } else {
              // Token invalid or expired
              console.warn("Session expired or invalid");
              localStorage.removeItem(AUTH_STORAGE_KEY);
              localStorage.removeItem(USER_STORAGE_KEY);
              setAccessToken(null);
              setUser(null);
            }
          } catch (err) {
            console.error("Failed to verify session:", err);
            // If network error, maybe keep the session? Or fail safe?
            // For now, let's keep it if we have stored user, but warn.
            // Actually, safer to clear if we can't verify, or maybe just leave it
            // and let subsequent API calls fail?
            // Let's fallback to stored user if available but not clear token immediately on network error,
            // only on explicit 401/403.
            // But here we are inside initAuth.
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);

            if (storedUser) {
              setUser(JSON.parse(storedUser));
              setAccessToken(storedToken);
            }
          }
        }
      } catch (error) {
        console.error("Error reading auth from storage:", error);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async () => {
    if (!mounted) return;

    try {
      // Dynamically import to avoid SSR issues
      const { KoompiAuth } = await import("@koompi/oauth");
      const auth = new KoompiAuth({
        clientId: "pk_c347994a-f0db-41eb-bb7e-4899b1f5de30",
        redirectUri: `${window.location.origin}/auth/callback`,
      });
      const authorizeUrl = await auth.createLoginUrl();

      window.location.href = authorizeUrl;
    } catch (error) {
      console.error("Login error:", error);
    }
  }, [mounted]);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setAccessToken(null);
    setUser(null);
    window.location.href = "/";
  }, []);

  const getAccessToken = useCallback(() => {
    return accessToken;
  }, [accessToken]);

  const hasRole = useCallback(
    (role: string) => {
      return user?.role === role;
    },
    [user],
  );

  const isSuperAdmin = useCallback(() => {
    return user?.role === "SuperAdmin";
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === "Admin" || user?.role === "SuperAdmin";
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      getAccessToken,
      setAuth: (token: string, user: User) => {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        setAccessToken(token);
        setUser(user);
      },
      hasRole,
      isSuperAdmin,
      isAdmin,
    }),
    [
      user,
      isLoading,
      login,
      logout,
      getAccessToken,
      hasRole,
      isSuperAdmin,
      isAdmin,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
