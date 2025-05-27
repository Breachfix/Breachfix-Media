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
    const checkAccess = async () => {
      if (authLoading) return;

      const path = window.location.pathname;
      const isPublic = ["/subscribe", "/subscribe/success", "/debug/finalize-subscription"].includes(path);

      if (!user?.id) {
        sessionStorage.setItem("redirectAfterLogin", path + window.location.search);
        router.replace("/auth/login");
        return;
      }

      try {
        const subscription = await getUserSubscription(user.id);
        const isActive = subscription?.isActive;

        if (!isActive && !isPublic) {
          // ❌ Not subscribed — go to subscription page
          router.replace("/subscribe");
          return;
        }

        if (isActive && isPublic) {
          // ✅ Subscribed — instead of redirecting to /browse, go to /account-manager
          router.replace("/manage-accounts");
          return;
        }

        // ✅ All good, allow rendering
        setHasCheckedAuth(true);
      } catch (err) {
        console.error("❌ Subscription check failed:", err);
        router.replace("/subscribe");
      }
    };

    checkAccess();
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