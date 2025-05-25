"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/context/AuthContext"; // ✅ IMPORT

export default function SubscribeSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { reloadUser } = useAuth(); // ✅ Access reloadUser
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const confirmAndReload = async () => {
      if (!sessionId) return;

      try {
        const res = await fetch(`/api/stripe/finalize-subscription?session_id=${sessionId}`);
        const data = await res.json();

        if (data.success) {
          console.log("✅ Finalized subscription:", data.subscription);
          await reloadUser(); // ✅ 🔁 Reload the user profile so RequireAuth has fresh data
        } else {
          console.warn("⚠️ Subscription finalization failed:", data.message);
        }
      } catch (error) {
        console.error("❌ Finalization error:", error);
      } finally {
        setLoading(false);
      }
    };

    confirmAndReload();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl font-medium">Verifying your subscription...</p>
      </div>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <div className="text-center p-10 bg-gray-900 rounded-lg">
          <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">🎉 Subscription Successful!</h1>
          <p className="text-gray-300 mb-6">Thank you for joining. You're all set to explore!</p>
          <a
            href="/browse"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded text-white font-semibold transition"
          >
            Start Watching →
          </a>
        </div>
      </div>
    </RequireAuth>
  );
}