"use client";

import { useRouter } from "next/navigation";

export default function AuthNavbar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-4 sm:px-10 pt-4">
      <img
        src="/breachfix logo.png"
        alt="Breachfix Media"
        width={120}
        height={120}
        className="w-28 sm:w-36 lg:w-52 cursor-pointer"
        onClick={() => router.push("/")}
      />
      <button
        onClick={() => router.push("/auth/login")}
        className="h-8 px-4 text-white bg-[#e50914] rounded"
      >
        Sign In
      </button>
    </header>
  );
}