"use client";

import { useEffect, useState } from "react";
import {
  enable2FA,
  verifyTwoFactor,
  disable2FA,
  fetchUserProfile,
} from "@/lib/api";
import AuthBackground from "@/components/AuthBackground";

export default function TwoFactorPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("email");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState("initial"); // initial | verify
  const [loading, setLoading] = useState(false);

  // Fetch current 2FA status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const user = await fetchUserProfile();
        if (user?.is2FAEnabled) {
          setIsEnabled(true);
        }
      } catch (err) {
        console.error("Error fetching 2FA status");
      }
    };
    fetchStatus();
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await enable2FA({ method: selectedMethod });
      setMessage("2FA initiated. Please check your email/SMS or TOTP app.");
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to enable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await verifyTwoFactor({ code });
      if (res.success) {
        setMessage("2FA verified and enabled successfully!");
        setIsEnabled(true);
        setStep("initial");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await disable2FA();
      setMessage("Two-Factor Authentication disabled.");
      setIsEnabled(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthBackground>
    <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg text-white w-full max-w-sm space-y-4">
      <h1 className="text-3xl font-bold mb-6">Two-Factor Authentication</h1>

      {message && <p className="text-green-400 mb-3">{message}</p>}
      {error && <p className="text-red-500 mb-3">{error}</p>}

      {!isEnabled && step === "initial" && (
        <div className="w-full max-w-sm space-y-4">
          <label className="block text-sm font-medium mb-1">Choose Method:</label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-black p-2 rounded w-full"
          >
            <option value="email">Email</option>
            <option value="sms">SMS</option>
            <option value="totp">Authenticator App (TOTP)</option>
          </select>
          <button
            onClick={handleEnable}
            className="w-full bg-red-600 hover:bg-[#e50914] p-3 rounded text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Enabling..." : "Enable 2FA"}
          </button>
        </div>
      )}

      {step === "verify" && (
        <div className="w-full max-w-sm space-y-4">
          <input
            type="text"
            placeholder="Enter the verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="p-3 rounded text-black w-full"
          />
          <button
            onClick={handleVerify}
            className="w-full bg-red-600 hover:bg-[#e50914] p-3 rounded text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify 2FA"}
          </button>
        </div>
      )}

      {isEnabled && (
        <div className="mt-8">
          <p className="mb-3 text-green-300">2FA is currently enabled.</p>
          <button
            onClick={handleDisable}
            className="bg-yellow-500 hover:bg-yellow-600 p-3 rounded text-black disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Disabling..." : "Disable 2FA"}
          </button>
        </div>
      )}
    </div>
    </AuthBackground>
  );
}