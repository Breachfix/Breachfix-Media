"use client";
import { useEffect } from "react";

export default function SuppressHydrationWarning() {
  useEffect(() => {
    const originalError = console.error;

    console.error = (...args) => {
      const msg = args[0];
      if (
        typeof msg === "string" &&
        msg.includes("hydrated but some attributes")
      ) {
        return;
      }
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}