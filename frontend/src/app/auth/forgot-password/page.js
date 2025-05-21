"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOtp } from "@/lib/api";
import AuthBackground from "@/components/AuthBackground";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await sendOtp({ recipient_email: email });
      setMessage("OTP sent! Check your email.");
      setTimeout(() => {
        router.push("/auth/reset-password");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
    <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg text-white w-full max-w-sm space-y-4">
    
      <h1 className="text-3xl font-bold mb-6">Forgot Password</h1>
      <div className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 rounded text-black"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {message && <p className="text-green-400 text-sm">{message}</p>}
        <button
          onClick={handleSendOtp}
          disabled={loading}
          className="bg-red-600 hover:bg-[#e50914] p-3 rounded text-white disabled:opacity-60"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
        <p className="text-sm text-center">
          Already reset it?{" "}
          <span
            className="text-blue-400 underline cursor-pointer"
            onClick={() => router.push("/auth/login")}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
    </AuthBackground>
  );
}