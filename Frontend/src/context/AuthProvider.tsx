import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import axios from "axios";

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<any>(null);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const [authentication, setAuthentication] = useState<boolean>(
    !!localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const fetchProfile = async () => {
      if (!accessToken) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setUser(res.data.user);
        setAuthentication(true);
      } catch (error: any) {
        if (error.response?.status === 401 && refreshToken) {
          try {
            const refreshRes = await axios.post(
              `${import.meta.env.VITE_BACKEND_URL}/api/auth/refresh-token`,
              {
                refreshToken,
              }
            );

            const newAccessToken = refreshRes.data.accessToken;
            localStorage.setItem("accessToken", newAccessToken);
            setAccessToken(newAccessToken);

            const retryRes = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
              {
                headers: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              }
            );

            setUser(retryRes.data.user);
            setAuthentication(true);
          } catch {
            logout();
          }
        } else {
          logout();
        }
      }
    };

    fetchProfile();
  }, [accessToken, refreshToken]);

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setAuthentication(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        logout,
        authentication,
        setAuthentication,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
