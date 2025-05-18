"use client";

import { useSearchParams } from "next/navigation";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "An unknown error occurred.";

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white px-4">
      <h1 className="text-3xl font-bold text-red-500 mb-4">Login Error</h1>
      <p className="text-lg text-center max-w-md">
        {decodeURIComponent(error)}
      </p>
      <button
        onClick={() => window.history.back()}
        className="mt-6 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
      >
        Go Back
      </button>
    </div>
  );
}