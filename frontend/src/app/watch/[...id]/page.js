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

  const { pageLoader, setPageLoader, subscriptionPlan } = useContext(GlobalContext);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") router.push("/browse");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  useEffect(() => {
    async function getContent() {
      try {
        const type = params.id?.[0];
        const id = params.id?.[1];
        if (!type || !id) return setError("Missing type or ID");

        const content = await fetchWatchContent(type, id);
        setMediaDetails(content);

        const allowed = {
          Basic: "480p",
          Standard: "720p",
          Premium: "1080p",
        }[subscriptionPlan] || "480p";

        let primaryUrl = null;

        if (type === "tvShow") {
          const firstEpisode = content.seasons?.[0]?.episodes?.[0];
          primaryUrl =
            firstEpisode?.HLS?.[allowed] ||
            firstEpisode?.HLS?.["480p"] ||
            firstEpisode?.HLS?.["720p"] ||
            firstEpisode?.HLS?.["1080p"] ||
            firstEpisode?.videoUrl ||
            content.previewVideoUrl ||
            content.trailerUrl;
        } else {
          primaryUrl =
            content.HLS?.[allowed] ||
            content.HLS?.["480p"] ||
            content.HLS?.["720p"] ||
            content.HLS?.["1080p"] ||
            content.transcodedVideo ||
            content.videoUrl ||
            content.trailerUrl;
        }

        if (!primaryUrl) {
          setError("No playable video found.");
        } else {
          setSelectedQuality(allowed);
          setVideoUrl(primaryUrl);
        }

        setPageLoader(false);
      } catch (e) {
        console.error("❌ Failed to load content", e);
        setError("Error loading content.");
        setPageLoader(false);
      }
    }

    getContent();
  }, [params, subscriptionPlan, setPageLoader]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;

    let hls;
    const currentTime = video.currentTime || 0;

    const playVideo = () => {
      video.currentTime = currentTime;
      video.play().catch((err) => {
        console.warn("⚠️ Autoplay failed:", err);
      });
    };

    if (Hls.isSupported()) {
      hls = new Hls({ startPosition: currentTime });
      hls.loadSource(videoUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.addEventListener("canplay", playVideo, { once: true });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("🚨 HLS fatal error:", JSON.stringify(data, null, 2));

        if (!data) {
          setError("Unknown video error occurred.");
        } else if (data.details === "manifestLoadError") {
          setError("The video manifest could not be loaded. Please try again later.");
        } else if (data.details === "levelLoadError") {
          setError("Video stream is currently unavailable or corrupted.");
        }

        if (data?.fatal) {
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
    } else if (video.canPlayType("application/vnd.apple.mpegURL")) {
      video.src = videoUrl;
      video.addEventListener("canplay", playVideo, { once: true });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [videoUrl]);

  const handleQualityChange = (quality) => {
  const video = videoRef.current;
  if (!video) return;

  const time = video.currentTime || 0;

  if (hlsRef.current) hlsRef.current.destroy();

  setSelectedQuality(quality);

  const newUrl = mediaDetails.HLS?.[quality] || videoUrl;

  // Wait for the new URL to set, then resume from current time
  setVideoUrl(newUrl);

  const tryResume = () => {
    video.currentTime = time;
    video.play().catch(() => {});
    video.removeEventListener("canplay", tryResume);
  };

  video.addEventListener("canplay", tryResume);
};

  if (pageLoader || !mediaDetails) return <CircleLoader />;

  return (
    <RequireAuth>
      <motion.div
        className="relative w-full h-screen bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute z-10 top-0 left-0 w-full px-4 py-3 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center text-white">
          <button
            onClick={() => router.push("/browse")}
            className="flex items-center gap-2 hover:text-red-500"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline font-medium">Back</span>
          </button>
          <span className="text-lg font-semibold truncate max-w-xs sm:max-w-md md:max-w-xl">
            {mediaDetails.title}
          </span>
          <select
            value={selectedQuality}
            onChange={(e) => handleQualityChange(e.target.value)}
            className="bg-black text-white border border-white rounded px-2 py-1 text-sm"
          >
            {Object.keys(mediaDetails.HLS || {}).map((q) => (
              <option key={q} value={q}>
                {q}
              </option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="text-center text-red-500 pt-20">{error}</div>
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            poster={mediaDetails.posterUrl || mediaDetails.thumbnailUrl}
            className="w-full h-full object-contain"
          />
        )}
      </motion.div>
    </RequireAuth>
  );
}
