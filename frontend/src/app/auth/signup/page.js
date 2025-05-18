"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/lib/api"; // adjust if your path is different
import AuthBackground from "@/components/AuthBackground";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const res = await signup({ username, email, password });

      if (res.success) {
        router.push("/auth/login");
      } else {
        setError(res.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
     <AuthBackground>
    <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg text-white w-full max-w-sm space-y-4">
      <h1 className="text-3xl font-bold mb-6">Create Your Account</h1>
      <div className="flex flex-col w-full max-w-sm space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="p-3 rounded text-black"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleSignup}
          disabled={loading}
          className="bg-red-600 hover:bg-[#e50914] p-3 rounded text-white disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-sm mt-2 text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/auth/login")}
            className="text-blue-400 underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
    </AuthBackground>
  );
}