// components/subscription/HandleCanceledParam.js
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HandleCanceledParam({ setCanceled }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const isCanceled = searchParams.get("canceled") === "true";
    if (isCanceled) {
      setCanceled(true);
      setTimeout(() => router.replace("/subscribe"), 3000);
    }
  }, []);

  return null;
}