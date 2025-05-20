"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function SubscribeSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      console.log("✅ Session ID:", sessionId);
      setLoading(false);
    }
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-[#ce1254] text-white animate-pulse">
        <p className="text-xl font-medium">Verifying your subscription...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f0f0f] via-[#1e1e1e] to-[#ce1254] text-white px-6">
      {/* Glow effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#ce1254_0%,transparent_40%)] opacity-20 -z-10 blur-3xl" />

      <div className="max-w-lg w-full text-center bg-black bg-opacity-60 p-8 rounded-xl shadow-2xl border border-gray-700 backdrop-blur-md animate-fade-in-down">
        <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4 animate-bounce" />

        <h1 className="text-4xl font-extrabold mb-3 tracking-wide text-white">
          🎉 Subscription Successful!
        </h1>

        <p className="text-lg text-gray-300 mb-6">
          Thank you for joining our <span className="text-yellow-400 font-semibold">faith-powered</span> streaming journey. Your support helps us build a cleaner, God-honoring entertainment world.
        </p>

        <a
          href="/browse"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow-lg transition duration-300"
        >
          Start Watching →
        </a>
      </div>
    </div>
  );
}