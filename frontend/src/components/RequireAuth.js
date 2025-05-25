"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const path = window.location.pathname;

      // Not logged in
      if (!user?.id) {
        const currentPath = path + window.location.search;
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        router.replace("/auth/login");
        return;
      }

      const allowedWithoutSubscription = [
        "/subscribe/success",
        "/debug/finalize-subscription",
        "/subscribe", // allow subscription page itself
      ];

      const isAllowed = allowedWithoutSubscription.includes(path);
      const hasActiveSub = user?.subscription?.status === "active";

      // If user is not subscribed and page isn't whitelisted, redirect
      if (!hasActiveSub && !isAllowed) {
        router.replace("/subscribe");
        return;
      }

      // ✅ All checks passed, mark auth as checked
      setHasCheckedAuth(true);
    }
  }, [authLoading, user]);

  if (!hasCheckedAuth || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <div className="animate-pulse mb-6 text-3xl font-bold text-red-600 tracking-widest">
          BREACHFIX
        </div>
        <div className="border-4 border-red-600 border-t-transparent rounded-full w-12 h-12 animate-spin mb-4" />
        <p className="text-lg text-gray-300 font-medium tracking-wide">
          Checking your access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}