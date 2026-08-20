"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  registerUser as apiRegisterUser,
  loginUser as apiLoginUser,
  fetchCurrentUserProfile,
  updateUserProfile as apiUpdateUserProfile,
} from "@/lib/api";

const TOKEN_KEY = "scholar_auth_token";
const USER_KEY = "scholar_auth_user";
const LEGACY_USER_KEY = "scholar_visitor_user";

function getStoredScholarToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

function getStoredScholarUser() {
  if (typeof window === "undefined") return null;
  try {
    const saved =
      localStorage.getItem(USER_KEY) ||
      sessionStorage.getItem(USER_KEY) ||
      localStorage.getItem(LEGACY_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (e) {
    return null;
  }
}

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
      const storedToken = getStoredScholarToken();
      const storedUser = getStoredScholarUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);

        // Fetch fresh profile in background to ensure account is active and sync counts
        fetchCurrentUserProfile(storedToken)
          .then((freshUser) => {
            if (freshUser && freshUser.id) {
              setUser(freshUser);
              const activeStorage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
              activeStorage.setItem(USER_KEY, JSON.stringify(freshUser));
            }
          })
          .catch(() => {
            // Token might be expired
          });
      } else if (storedUser) {
        setUser(storedUser);
      }
    } catch (e) {
      console.error("Auth hydration error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password, rememberMe = true }) => {
    const res = await apiLoginUser({ email, password });
    if (res && res.accessToken && res.user) {
      setToken(res.accessToken);
      setUser(res.user);

      const targetStorage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      // Clean other storage to prevent stale session conflicts
      otherStorage.removeItem(TOKEN_KEY);
      otherStorage.removeItem(USER_KEY);
      otherStorage.removeItem(LEGACY_USER_KEY);

      targetStorage.setItem(TOKEN_KEY, res.accessToken);
      targetStorage.setItem(USER_KEY, JSON.stringify(res.user));
      targetStorage.setItem(LEGACY_USER_KEY, JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || "Login failed");
  }, []);

  const register = useCallback(async ({ name, email, password, rememberMe = true }) => {
    const res = await apiRegisterUser({ name, email, password });
    if (res && res.accessToken && res.user) {
      setToken(res.accessToken);
      setUser(res.user);

      const targetStorage = rememberMe ? localStorage : sessionStorage;
      const otherStorage = rememberMe ? sessionStorage : localStorage;

      otherStorage.removeItem(TOKEN_KEY);
      otherStorage.removeItem(USER_KEY);
      otherStorage.removeItem(LEGACY_USER_KEY);

      targetStorage.setItem(TOKEN_KEY, res.accessToken);
      targetStorage.setItem(USER_KEY, JSON.stringify(res.user));
      targetStorage.setItem(LEGACY_USER_KEY, JSON.stringify(res.user));
      return res.user;
    }
    throw new Error(res?.message || "Registration failed");
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LEGACY_USER_KEY);
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(LEGACY_USER_KEY);
    } catch (e) {}
  }, []);

  const refreshUser = useCallback(async () => {
    const activeToken = token || getStoredScholarToken();
    if (!activeToken) return null;
    try {
      const freshUser = await fetchCurrentUserProfile(activeToken);
      if (freshUser && freshUser.id) {
        setUser(freshUser);
        const activeStorage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
        activeStorage.setItem(USER_KEY, JSON.stringify(freshUser));
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
            const activeStorage = localStorage.getItem(TOKEN_KEY) ? localStorage : sessionStorage;
            activeStorage.setItem(USER_KEY, JSON.stringify(newUser));
            activeStorage.setItem(LEGACY_USER_KEY, JSON.stringify(newUser));
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
