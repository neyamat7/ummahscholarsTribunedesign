"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  registerUser as apiRegisterUser,
  loginUser as apiLoginUser,
  fetchCurrentUserProfile,
  updateUserProfile as apiUpdateUserProfile,
} from "@/lib/api";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  refreshUser: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and hydrate authentication state on client mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("scholar_auth_token");
      const storedUser = localStorage.getItem("scholar_auth_user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        // Fetch fresh profile in background to ensure account is active and sync counts
        fetchCurrentUserProfile(storedToken)
          .then((freshUser) => {
            if (freshUser && freshUser.id) {
              setUser(freshUser);
              localStorage.setItem("scholar_auth_user", JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            // Token might be expired
          });
      } else {
        // Fallback check for legacy visitor user
        const legacyUser = localStorage.getItem("scholar_visitor_user");
        if (legacyUser) {
          try {
            setUser(JSON.parse(legacyUser));
          } catch (e) {}
        }
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const res = await apiLoginUser({ email, password });
    if (res && res.accessToken && res.user) {
      setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem("scholar_auth_token", res.accessToken);
      localStorage.setItem("scholar_auth_user", JSON.stringify(res.user));
      // Sync legacy key so all older listeners stay updated
      localStorage.setItem("scholar_visitor_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || "Login failed");
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const res = await apiRegisterUser({ name, email, password });
    if (res && res.accessToken && res.user) {
      setToken(res.accessToken);
      setUser(res.user);
      localStorage.setItem("scholar_auth_token", res.accessToken);
      localStorage.setItem("scholar_auth_user", JSON.stringify(res.user));
      localStorage.setItem("scholar_visitor_user", JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || "Registration failed");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("scholar_auth_token");
      localStorage.removeItem("scholar_auth_user");
      localStorage.removeItem("scholar_visitor_user");
    } catch (e) {}
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = token || localStorage.getItem("scholar_auth_token");
    if (!activeToken) return null;
    try {
      const freshUser = await fetchCurrentUserProfile(activeToken);
      if (freshUser && freshUser.id) {
        setUser(freshUser);
        localStorage.setItem("scholar_auth_user", JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (e) {
      console.error("Failed to refresh user:", e);
    }
    return null;
  }, [token]);

  const updateProfile = useCallback(
    async ({ name, avatarUrl }) => {
      const updated = await apiUpdateUserProfile({ name, avatarUrl });
      if (updated && updated.id) {
        setUser((prev) => {
          const newUser = { ...(prev || {}), ...updated };
          try {
            localStorage.setItem("scholar_auth_user", JSON.stringify(newUser));
            localStorage.setItem("scholar_visitor_user", JSON.stringify(newUser));
          } catch (e) {}
          return newUser;
        });
        return updated;
      }
      return updated;
    },
    [],
  );

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
