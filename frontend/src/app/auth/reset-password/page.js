"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api";
import AuthBackground from "@/components/AuthBackground";


export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      const res = await resetPassword(email, otp, newPassword);
      setMessage("Password reset successful. You can now log in.");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
    <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg text-white w-full max-w-sm space-y-4">
      <h1 className="text-3xl mb-6 font-bold">Reset Password</h1>
      <div className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          className="p-3 rounded text-black"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          className="p-3 rounded text-black"
          onChange={(e) => setOtp(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          className="p-3 rounded text-black"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button
          onClick={handleReset}
          disabled={loading}
          className="bg-red-600 hover:bg-[#e50914] p-3 rounded text-white disabled:opacity-60"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
    </AuthBackground>
  );
}