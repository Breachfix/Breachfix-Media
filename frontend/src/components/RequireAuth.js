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
      // Not logged in
      if (!user?.id) {
        const currentPath = window.location.pathname + window.location.search;
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        router.replace("/auth/login");
        return;
      }

      // Logged in but not subscribed
      const allowedWithoutActiveSubscription = [
            "/subscribe/success",
             "/debug/finalize-subscription",
      ];

      if (
           !allowedWithoutActiveSubscription.includes(window.location.pathname) &&
           (!user.subscription || user.subscription.status !== "active")
         ) {
            router.replace("/subscribe");
             return;
           }
      

      setHasCheckedAuth(true);
    }
  }, [authLoading, user]);

  if (!hasCheckedAuth || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        {/* Netflix-style shimmer logo or animated ring */}
        <div className="animate-pulse mb-6 text-3xl font-bold text-red-600 tracking-widest">
          BREACHFIX
        </div>

        {/* Loading spinner */}
        <div className="border-4 border-red-600 border-t-transparent rounded-full w-12 h-12 animate-spin mb-4" />

        <p className="text-lg text-gray-300 font-medium tracking-wide">
          Checking your access...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}