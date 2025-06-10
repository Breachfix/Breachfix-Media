"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile, logout } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const getUserId = () => user?.id || localStorage.getItem("userId");
  const getLoggedInAccount = () => {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(sessionStorage.getItem("loggedInAccount")) || null;
    } catch (err) {
      console.warn("❌ Error accessing sessionStorage:", err.message);
      return null;
    }
  }
  return null;
};

  const loadUserFromStorage = () => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setUser({ id: userId });
      console.log("📦 Fallback: Loaded user from localStorage:", userId);
    } else {
      console.warn("⚠️ No userId found in localStorage");
      setUser(null);
    }
  };

  const loadUser = async () => {
    try {
      const res = await fetchUserProfile();
      const userId = res?.user?.id || res?.user?._id;
      if (!userId) throw new Error("❌ User ID missing from profile");

      setUser({ id: userId, ...res.user });
      localStorage.setItem("userId", userId);
    } catch (err) {
      console.warn("⚠️ Profile fetch failed, using fallback.");
      loadUserFromStorage();
    } finally {
      setAuthLoading(false);
    }
  };

  const reloadUser = async () => {
    setAuthLoading(true);
    await loadUser();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error("Logout error:", e);
    }

    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("loggedInAccount");

    window.location.href = "/auth/login";
  };

useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const isExpired = payload.exp * 1000 < Date.now();

    if (isExpired) {
      console.warn("⏰ Token expired, logging out...");
      handleLogout();
    } else {
      loadUser();
    }
  } else {
    setAuthLoading(false);
  }
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        handleLogout,
        getUserId,
        getLoggedInAccount,
        reloadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);