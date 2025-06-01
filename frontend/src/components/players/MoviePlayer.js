// src/components/players/MoviePlayer.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

export default function MoviePlayer({ hlsUrl, poster }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [hlsReady, setHlsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;

    const video = videoRef.current;
    const hls = new Hls();

    hls.loadSource(hlsUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log("📦 HLS manifest parsed for Movie");
      setHlsReady(true);
      video.play().catch((err) => console.warn("⚠️ Auto-play failed", err));
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error("💥 HLS fatal error (Movie)", data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            break;
        }
      }
    });

    hlsRef.current = hls;

    return () => {
      hls.destroy();
    };
  }, [hlsUrl]);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      poster={poster || ""}
      className="w-full h-full object-contain"
    />
  );
}

