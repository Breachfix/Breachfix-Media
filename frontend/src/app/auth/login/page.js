"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import AuthBackground from "@/components/AuthBackground";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const { reloadUser } = useAuth();

    const handleLogin = async (e) => {
    e.preventDefault(); // ✅ Prevent page reload
    try {
      const res = await login({ email, password });

      if (res.success) {
        const user = res.user;
        sessionStorage.setItem("loggedInAccount", JSON.stringify(user));
        localStorage.setItem("authToken", res.token);
        localStorage.setItem("userId", user.id);
        setLoginError(false);

         // ✅ Reload context so RequireAuth doesn't fire incorrectly
         await reloadUser();

        const redirectPath = sessionStorage.getItem("redirectAfterLogin");

        if (redirectPath) {
          sessionStorage.removeItem("redirectAfterLogin");
          await router.replace(redirectPath); // ✅ Use await
          return;
        }

        if (!user.subscription || user.subscription.status !== "active") {
          await router.replace("/subscribe");
          return;
        }

        await router.replace("/browse");
      } else {
        setLoginError(true);
      }
    } catch (err) {
      setLoginError(true);
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

        {/* 🔐 Show Forgot Password on error */}
        {loginError && (
          <p className="text-sm text-center text-yellow-300">
            <span
              onClick={() => router.push("/auth/forgot-password")}
              className="underline cursor-pointer"
            >
              Forgot your password?
            </span>
          </p>
        )}

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