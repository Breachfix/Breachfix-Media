"use client";

import { useEffect, useRef } from "react";
import { saveWatchProgress, getSingleWatchProgress as getWatchProgress } from "@/utils/watchProgressAPI";

export default function WatchProgressHandler({
  accountId,
  mediaId,
  type,
  videoRef,
  onLoadProgress,
  onAutoSkipIntro,
}) {
  const lastSaved = useRef(0);

  // 🧠 LOAD progress when video starts
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await getWatchProgress({ accountId, mediaId }); // returns seconds
        if (onLoadProgress && typeof onLoadProgress === "function") {
          onLoadProgress(progress);
        }

        if (progress > 60 && onAutoSkipIntro) {
          onAutoSkipIntro();
        }
      } catch (err) {
        console.warn("❌ Failed to load watch progress:", err.message);
      }
    };

    if (accountId && mediaId) loadProgress();
  }, [accountId, mediaId]);

  // 🧠 SAVE progress every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const current = Math.floor(videoRef?.current?.currentTime || 0);
      if (current && Math.abs(current - lastSaved.current) > 5) {
        lastSaved.current = current;
        console.log("💾 Auto-saving progress at", current, "seconds");
        saveWatchProgress({ accountId, mediaId, type, progressInSeconds: current });
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [videoRef, accountId, mediaId, type]);

  return null;
}