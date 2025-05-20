"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import AuthBackground from "@/components/AuthBackground";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login({ email, password });
      if (res.success) {
        sessionStorage.setItem("loggedInAccount", JSON.stringify(res.user));
        window.location.href = "/browser";
      } else {
        // 🔁 Redirect to error page
        router.push(`/auth/error?error=${encodeURIComponent(res.message || "Login failed")}`);
      }
    } catch (err) {
      router.push(`/auth/error?error=${encodeURIComponent(err.message || "Login error")}`);
    }
  };

  return (
    <AuthBackground>
      <div className="bg-black bg-opacity-60 p-8 rounded shadow-lg text-white w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <input
          type="email"
          placeholder="Email"
          className="p-3 rounded text-black w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="p-3 rounded text-black w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-red-600 hover:bg-[#e50914] p-3 rounded text-white"
        >
          Sign In
        </button>
        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/auth/signup")}
            className="text-blue-400 underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </AuthBackground>
  );
}