"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

export default function NextUpOverlay({ nextEpisodeId, onNextEpisode, delay = 5 }) {
  const [countdown, setCountdown] = useState(delay);

  useEffect(() => {
    if (!nextEpisodeId) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onNextEpisode(nextEpisodeId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextEpisodeId]);

  if (!nextEpisodeId) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/90 text-white p-4 rounded-lg z-50">
      <p className="text-lg mb-2">Next episode in {countdown}s...</p>
      <button onClick={() => onNextEpisode(nextEpisodeId)} className="underline">
        Skip Now <ChevronRight className="h-4 w-4 inline ml-1" />
      </button>
    </div>
  );
}