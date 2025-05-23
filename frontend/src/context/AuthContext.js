"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile, logout } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔄 Utility to get current logged-in sub-account (profile)
  const getLoggedInAccount = () =>
    JSON.parse(sessionStorage.getItem("loggedInAccount")) || null;

  // 🔄 Utility to get UID
  const getUserId = () => user?.id || localStorage.getItem("userId");

  // 🔐 Load fallback from storage if API fails
const loadUserFromStorage = () => {
  const storedUserId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  if (storedUserId) {
    setUser({ id: storedUserId });
    console.log("📦 Loaded main user ID from storage:", storedUserId);
  } else {
    setUser(null);
    console.error("❌ No user ID found in storage.");
  }
};

  const loadUser = async () => {
    try {
      console.log("🔄 Attempting to fetch user profile from API...");
      const res = await fetchUserProfile();
      console.log("✅ Fetched user profile:", res);

      if (res?.id || res?._id) {
        const userId = res.id || res._id;
        setUser({ id: userId, ...res });
        sessionStorage.setItem("userId", userId);
        localStorage.setItem("userId", userId);
        console.log("🎯 User ID found and stored:", userId);
      } else {
        throw new Error("❌ User profile missing ID");
      }
    } catch (err) {
      console.warn("⚠️ Failed to fetch user profile from API. Falling back to storage.");
      loadUserFromStorage();
    } finally {
      setAuthLoading(false);
      console.log("✅ Finished loading user.");
    }
  };

  // 🔄 Manually trigger user reload after login
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
    sessionStorage.removeItem("loggedInAccount");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");

    console.log("👋 User logged out and all data cleared.");
    window.location.href = "/auth/login";
  };

useEffect(() => {
  const token = localStorage.getItem('authToken');
  if (token) {
    loadUser();
  } else {
    setAuthLoading(false); // No token, don’t call profile
  }
}, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        handleLogout,
        getLoggedInAccount,
        getUserId,
        reloadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
