"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthBackground from "@/components/AuthBackground"; // Reuse that fancy BG

export default function LogoutConfirmationPage() {
  const { handleLogout, authLoading, user } = useAuth();
  const router = useRouter();
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirmLogout = async () => {
    setConfirmed(true);
    await handleLogout();
    window.location.assign("/");
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.assign("/");
    }
  }, [authLoading, user]);

  return (
    <AuthBackground>
      <div className="w-full max-w-lg bg-black bg-opacity-80 p-8 rounded-lg text-center shadow-2xl space-y-6 text-white">
        <h1 className="text-3xl font-extrabold tracking-tight">
          😢 Leaving so soon?
        </h1>
        <p className="text-gray-300 text-lg">
          Every great binge needs a break. Are you sure you want to log out?
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={handleConfirmLogout}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded text-white font-semibold"
          >
            Yes, Log Out
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-500 hover:bg-gray-600 rounded text-white font-semibold"
          >
            Nope, Stay
          </button>
        </div>

        {confirmed && (
          <p className="text-sm text-gray-400 animate-pulse">
            Logging out...
          </p>
        )}
      </div>
    </AuthBackground>
  );
}