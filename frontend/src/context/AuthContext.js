"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile, logout } from "@/lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const loadUser = async () => {
    try {
      console.log("🔄 Attempting to fetch user profile from API...");
      const res = await fetchUserProfile();
      console.log("✅ Fetched user profile:", res);

      if (res?.id || res?._id) {
        const userId = res.id || res._id;
        setUser({ id: userId, ...res });

        localStorage.setItem("userId", userId);
        sessionStorage.setItem("loggedInAccount", JSON.stringify(res));

        console.log("🎯 User ID found and stored:", userId);
      } else {
        throw new Error("❌ User profile missing ID");
      }
    } catch (err) {
      console.warn("⚠️ Failed to fetch user profile from API. Falling back to storage.");
      const stored =
        sessionStorage.getItem("loggedInAccount") ||
        localStorage.getItem("loggedInAccount");

      if (stored) {
        const parsed = JSON.parse(stored);
        const id = parsed.id || parsed._id || localStorage.getItem("userId");

        if (id) {
          setUser({ id, ...parsed });
          console.log("📦 Loaded user from storage with ID:", id);
        } else {
          setUser(null);
          console.error("🚫 Stored user missing ID");
        }
      } else {
        console.error("🛑 No user found in session/local storage.");
        setUser(null);
      }
    } finally {
      setAuthLoading(false);
      console.log("✅ Finished loading user.");
    }
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
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);