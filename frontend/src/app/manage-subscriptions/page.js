"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import AuthBackground from "@/components/AuthBackground";

export default function ManageSubscriptions() {
  const { user } = useAuth();
  const router = useRouter();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      const uid = user?.id || localStorage.getItem("userId");
      if (!uid) return;

      try {
        const res = await fetch("/api/subscription/get-user-subscription", {
          headers: {
            "x-uid": uid, // ✅ Switched to consistent UID header
          },
        });

        const data = await res.json();
        if (data.success) {
          setSubscription(data);
        } else {
          console.warn("⚠️ No active subscription found.");
        }
      } catch (err) {
        console.error("❌ Failed to fetch subscription:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading your subscription...
      </div>
    );
  }

  return (
    <AuthBackground>
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl bg-black bg-opacity-70 p-8 rounded-lg shadow-xl">
          <h1 className="text-white text-3xl font-bold mb-4 text-center">Manage Your Subscription</h1>

          {subscription?.planName ? (
            <div className="text-white space-y-4">
              <p><strong>Plan:</strong> {subscription.planName}</p>
              <p><strong>Status:</strong> {subscription.status}</p>
              <p><strong>Billing Cycle:</strong> {subscription.billingCycle}</p>
              <p><strong>Start Date:</strong> {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : "N/A"}</p>
              <p><strong>End Date:</strong> {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : "N/A"}</p>

              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push("/subscribe")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
                >
                  Upgrade / Change Plan
                </button>
                <button
                  onClick={() => alert("Cancel feature coming soon")}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                >
                  Cancel Subscription
                </button>
              </div>
            </div>
          ) : (
            <div className="text-white text-center">
              <p>You do not have an active subscription.</p>
              <button
                onClick={() => router.push("/subscribe")}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
              >
                Subscribe Now
              </button>
            </div>
          )}
        </div>
      </div>
    </AuthBackground>
  );
}