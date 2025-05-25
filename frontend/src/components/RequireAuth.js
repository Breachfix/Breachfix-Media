"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUserSubscription } from "@/lib/subscriptionManager";

export default function RequireAuth({ children }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    const checkAuthAndSubscription = async () => {
      if (authLoading) return;

      const path = window.location.pathname;

      // Not logged in
      if (!user?.id) {
        const currentPath = path + window.location.search;
        sessionStorage.setItem("redirectAfterLogin", currentPath);
        router.replace("/auth/login");
        return;
      }

      try {
        const subscription = await getUserSubscription(user.id);
        const isActive = subscription?.isActive;

        const allowedWithoutSub = [
          "/subscribe",
          "/subscribe/success",
          "/debug/finalize-subscription",
        ];

        const isAllowed = allowedWithoutSub.includes(path);

        // If they are already subscribed but still on subscribe page — redirect to /browse
        if (isActive && isAllowed) {
          router.replace("/browse");
          return;
        }

        // If NOT subscribed and trying to access a protected page — redirect to /subscribe
        if (!isActive && !isAllowed) {
          router.replace("/subscribe");
          return;
        }

        setHasCheckedAuth(true);
      } catch (err) {
        console.error("❌ Subscription check failed:", err);
        router.replace("/subscribe"); // fallback
      }
    };

    checkAuthAndSubscription();
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