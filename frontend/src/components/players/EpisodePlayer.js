"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getEpisodeContextById } from "@/utils";
import Hls from "hls.js";
import { ArrowLeft, SkipBack, SkipForward } from "lucide-react";
import WatchProgressHandler from "@/components/watch-progress-handle";

export default function EpisodePlayer({
  episode,
  poster,
  onSkipIntro,
  nextEpisodeId,
  prevEpisodeId,
}) {
  const router = useRouter();
  const episodeId = episode?._id;
  const videoRef = useRef(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const hideControlsTimeout = useRef(null);
  const [canShowSkipIntro, setCanShowSkipIntro] = useState(true);
  const [awaitingPlay, setAwaitingPlay] = useState(false);
  const [uid, setUid] = useState(null);
  const [accountId, setAccountId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const acc = JSON.parse(sessionStorage.getItem("loggedInAccount"));
    if (userId && acc?._id) {
      setUid(userId);
      setAccountId(acc._id);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getEpisodeContextById(episodeId);
      if (res.success && res.episode) {
        setEpisode(res.episode);
      } else {
        console.error("❌ Failed to load episode data");
      }
    };
    if (episodeId) fetchData();
  }, [episodeId]);

  useEffect(() => {
    setShowCountdown(false);
    setCountdown(5);
  }, [episodeId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !nextEpisodeId) return;

    let countdownInterval;

    const handleEnded = () => {
      setShowCountdown(true);
      setCountdown(5);
      let timer = 5;

      countdownInterval = setInterval(() => {
        timer -= 1;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(countdownInterval);
          goToEpisode(nextEpisodeId);
        }
      }, 1000);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      clearInterval(countdownInterval);
      setShowCountdown(false);
      setCountdown(5);
    };
  }, [nextEpisodeId, episodeId]);

useEffect(() => {
  if (!episode || !videoRef.current) return;

  // Fallback logic in case HLS is a string
  const episodeHLS =
    typeof episode.HLS === "string"
      ? { master: episode.HLS }
      : episode.HLS || {};

  const url =
    episodeHLS.master ||
    episode.transcodedVideo ||
    episode.video_url_s3 ||
    episode.trailerUrl;

  if (!url) return;

  const video = videoRef.current;

  if (Hls.isSupported()) {
    const hls = new Hls();
    hls.loadSource(url);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setTimeout(() => {
        video
          .play()
          .catch((err) => {
            console.warn("⚠️ Autoplay blocked:", err);
            setAwaitingPlay(true);
          });
      }, 100);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
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

    return () => hls.destroy();
  } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    video.play().catch((err) => console.warn("⚠️ Autoplay blocked:", err));
  }
}, [episode]);

  useEffect(() => {
    const handleInteraction = () => {
      setHovering(true);
      setShowControls(true);
      clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = setTimeout(() => {
        setHovering(false);
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 60) setCanShowSkipIntro(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const goToEpisode = (id) => {
    if (id) router.push(`/watch/episode/${id}`);
  };

  if (!episode) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div>
          <p className="text-lg">🔄 Loading episode...</p>
          <p className="text-sm text-gray-400">Episode ID: {episodeId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <video
        ref={videoRef}
        controls
        poster={poster || episode.thumbnail_url_s3}
        className="w-full h-full object-contain bg-black"
      >
        {uid && accountId && (
          <WatchProgressHandler
            uid={uid}
            accountId={accountId}
            mediaId={episodeId}
            type="episode"
            videoRef={videoRef}
            onAutoSkipIntro={() => setCanShowSkipIntro(false)}
          />
        )}
        <source
          src={
            (typeof episode.HLS === "string"
               ? episode.HLS
               : episode.HLS?.master) ||
            episode.transcodedVideo ||
            episode.video_url_s3 ||
            episode.trailerUrl
          }
          type="application/x-mpegURL"
        />
        Your browser does not support HLS playback.
      </video>

      {hovering && showControls && canShowSkipIntro && (
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.currentTime = 60;
            if (onSkipIntro) onSkipIntro();
          }}
          className="absolute top-20 right-10 bg-white/20 text-white px-4 py-1 rounded hover:bg-white/30 z-30"
        >
          ⏭ Skip Intro
        </button>
      )}

      {showCountdown && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-md z-30">
          <p>Next episode in {countdown}s...</p>
          <button
            onClick={() => {
              setShowCountdown(false);
              goToEpisode(nextEpisodeId);
            }}
            className="underline mt-1 text-sm transition-opacity duration-500 ease-in-out"
          >
            Skip
          </button>
        </div>
      )}

      {hovering && (
        <div className="absolute bottom-8 w-full flex justify-center gap-4 z-20">
          {prevEpisodeId && (
            <button
              onClick={() => goToEpisode(prevEpisodeId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              <SkipBack size={18} /> Previous
            </button>
          )}
          {nextEpisodeId && (
            <button
              onClick={() => goToEpisode(nextEpisodeId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              Next <SkipForward size={18} />
            </button>
          )}
        </div>
      )}

      {awaitingPlay && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-40 cursor-pointer"
          onClick={() => {
            videoRef.current.muted = false;
            videoRef.current.play();
            setAwaitingPlay(false);
          }}
        >
          <p className="text-white text-xl bg-white/10 px-6 py-3 rounded">▶ Tap to Play</p>
        </div>
      )}
    </div>
  );
}
