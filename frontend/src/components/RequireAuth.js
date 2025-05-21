"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RequireAuth({ children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user?.id) {
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      router.push("/auth/login");
    }
  }, [authLoading, user]);

  if (authLoading || !user?.id) {
    return <div className="text-center p-10">🔐 Checking authentication...</div>;
  }

  return <>{children}</>;
}