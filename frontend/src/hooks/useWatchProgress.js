"use client";

// src/hooks/useWatchProgress.js
import { useEffect, useState } from "react";

export default function useWatchProgress({ uid, accountId, mediaId, type }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid || !accountId || !mediaId || !type) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `/api/watch-progress/get?uid=${uid}&accountId=${accountId}&mediaId=${mediaId}`
        );
        const data = await res.json();
        if (data.success) {
          setProgress(data.data);
        }
      } catch (err) {
        console.error("❌ Failed to load progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [uid, accountId, mediaId, type]);

  const saveProgress = async (progressInSeconds) => {
    if (!uid || !accountId || !mediaId || !type) return;

    try {
      await fetch("/api/watch-progress/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, accountId, mediaId, type, progressInSeconds }),
      });
    } catch (err) {
      console.warn("⚠️ Failed to save progress:", err);
    }
  };

  return { progress, loading, saveProgress };
}