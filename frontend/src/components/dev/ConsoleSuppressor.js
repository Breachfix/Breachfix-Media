"use client";

import { useEffect } from "react";

export default function ConsoleSuppressor() {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const suppressedWarnings = [
        "Warning: A tree hydrated but some attributes of the server rendered HTML didn’t match",
      ];

      const originalConsoleError = console.error;
      console.error = (...args) => {
        if (
          typeof args[0] === "string" &&
          suppressedWarnings.some((entry) => args[0].includes(entry))
        ) {
          return;
        }
        originalConsoleError(...args);
      };
    }
  }, []);

  return null;
}