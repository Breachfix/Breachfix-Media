"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Hls from "hls.js";
import { ArrowLeft } from "lucide-react";

import CircleLoader from "@/components/circle-loader";
import RequireAuth from "@/components/RequireAuth";
import { GlobalContext } from "@/context";
import { fetchWatchContent } from "@/utils";

export default function Watch() {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [selectedQuality, setSelectedQuality] = useState("480p");
  const [error, setError] = useState(null);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const params = useParams();
  const router = useRouter();
  const { pageLoader, setPageLoader, subscriptionPlan } = useContext(GlobalContext);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") router.push("/browse");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    async function getMediaDetails() {
      try {
        const type = params.id?.[0];
        const id = params.id?.[1];

        if (!type || !id) {
          setError("Missing content type or ID.");
          return;
        }

        const content = await fetchWatchContent(type, id);
        setMediaDetails(content);

        const allowedQuality = {
          Basic: "480p",
          Standard: "720p",
          Premium: "1080p",
        }[subscriptionPlan] || "480p";

        const fallbackUrl =
          content.HLS?.[allowedQuality] ||
          content.HLS?.["480p"] ||
          content.HLS?.["720p"] ||
          content.HLS?.["1080p"] ||
          content.transcodedVideo?.hlsUrl ||
          content.transcodedVideo ||
          content.videoUrl ||
          content.trailerUrl;

        if (!fallbackUrl) {
          setError("Video not available.");
        } else {
          setSelectedQuality(allowedQuality);
          setVideoUrl(fallbackUrl);
        }

        setPageLoader(false);
      } catch (err) {
        console.error("❌ Failed to load content:", err);
        setError("Failed to load video.");
        setPageLoader(false);
      }
    }

    getMediaDetails();
  }, [params]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const playAttempt = () => video.play().catch(() => {});
        video.addEventListener("click", playAttempt);
        setTimeout(playAttempt, 100);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
  try {
    console.error("🚨 HLS.js error", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("🚨 HLS.js error: Could not stringify error object", data);
  }

  if (data?.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.warn("📡 Network error — trying to recover...");
        hls.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.warn("🎞 Media error — attempting to recover...");
        hls.recoverMediaError();
        break;
      default:
        console.error("❌ Fatal error — destroying player");
        hls.destroy();
        break;
    }
  }
});

      

      hlsRef.current = hls;
    } else if (video.canPlayType("application/vnd.apple.mpegURL")) {
      video.src = videoUrl;
      video.addEventListener("canplay", () => video.play().catch(() => {}));
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  const handleQualityChange = (q) => {
    if (mediaDetails?.HLS?.[q]) {
      const currentTime = videoRef.current?.currentTime || 0;
      if (hlsRef.current) hlsRef.current.destroy();
      setVideoUrl(mediaDetails.HLS[q]);
      setSelectedQuality(q);
      const video = videoRef.current;
      const onCanPlay = () => {
        video.currentTime = currentTime;
        video.play().catch(() => {});
        video.removeEventListener("canplay", onCanPlay);
      };
      video.addEventListener("canplay", onCanPlay);
    }
  };

  if (pageLoader || !mediaDetails) return <CircleLoader />;

  return (
    <RequireAuth>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-screen bg-black"
      >
        <div className="absolute z-10 top-0 left-0 w-full flex flex-wrap justify-between items-center px-4 py-3 bg-gradient-to-b from-black/80 to-transparent text-white text-sm md:text-base">
          <button
            onClick={() => router.push("/browse")}
            className="flex items-center gap-2 text-white hover:text-red-500"
          >
            <ArrowLeft size={20} />
            <span className="font-medium hidden sm:inline">Back to Browse</span>
          </button>
          <span className="truncate text-center w-full sm:w-auto sm:flex-1 text-lg font-semibold">
            {mediaDetails?.title}
          </span>
          <select
            value={selectedQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="bg-black text-white border border-white rounded px-2 py-1 text-sm mt-2 sm:mt-0"
          >
            {Object.keys(mediaDetails?.HLS || {}).map((q) => (
              <option key={q} value={q}>{q}</option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="text-center text-red-500 pt-10">{error}</div>
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            controls
            autoPlay
            playsInline
            poster={mediaDetails?.posterUrl || mediaDetails?.thumbnailUrl}
          />
        )}
      </motion.div>
    </RequireAuth>
  );
}