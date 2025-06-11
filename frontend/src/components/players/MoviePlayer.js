"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { SkipBack, SkipForward } from "lucide-react";
import { getNextPrevMediaByGenre } from "@/utils";
import WatchProgressHandler from "@/components/WatchProgressHandler";

export default function MoviePlayer({
  hlsUrl,
  poster,
  nextMovieId: propNextMovieId,
  prevMovieId: propPrevMovieId,
  onSkipIntro,
  onNavigate,
  movie,
  mediaId, type 
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  const [awaitingPlay, setAwaitingPlay] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [canShowSkipIntro, setCanShowSkipIntro] = useState(true);
  const [resumeTime, setResumeTime] = useState(null);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [hlsReady, setHlsReady] = useState(false);

  const [nextId, setNextId] = useState(propNextMovieId || null);
  const [prevId, setPrevId] = useState(propPrevMovieId || null);
  const [accountId, setAccountId] = useState(null);

  const hideControlsTimeout = useRef(null);

  // ✅ Load accountId
  useEffect(() => {
    const acc = JSON.parse(sessionStorage.getItem("loggedInAccount"));
    if (acc?._id) setAccountId(acc._id);
  }, []);

  // ✅ Setup HLS player
  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return;

    const video = videoRef.current;
    const hls = new Hls();

    hls.loadSource(hlsUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setHlsReady(true);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
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
    return () => hls.destroy();
  }, [hlsUrl]);

  // ✅ Resume logic: play only when all are ready
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsReady || !isMetadataLoaded) return;

    if (resumeTime !== null) {
      video.currentTime = resumeTime;
    }

    video.play().catch((err) => {
      console.warn("⚠️ Auto-play failed", err);
      setAwaitingPlay(true);
    });
  }, [resumeTime, hlsReady, isMetadataLoaded]);

  // ✅ Interaction controls
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

  // ✅ Skip intro logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.currentTime > 60) setCanShowSkipIntro(false);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // ✅ Next/Prev
  useEffect(() => {
    const fetchRelated = async () => {
      if (!movie?.genre || !movie?._id) return;
      const { next, prev } = await getNextPrevMediaByGenre("movie", movie.genre, movie._id);
      setNextId(next);
      setPrevId(prev);
    };

    fetchRelated();
  }, [movie]);

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <video
        ref={videoRef}
        controls
        autoPlay
        muted  // ✅ Add this to allow autoplay on Chrome
        playsInline 
        poster={poster || ""}
        onLoadedMetadata={() => setIsMetadataLoaded(true)} // ✅ Needed for resume
        className="w-full h-full object-contain"
      />

      {/* Tap to play fallback */}
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

      {/* Skip Intro */}
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

      {/* Watch Progress Handler */}
      {mediaId && type && accountId && (
        <WatchProgressHandler
          accountId={accountId}
          mediaId={mediaId}
          type={type}
          videoRef={videoRef}
          onAutoSkipIntro={() => setCanShowSkipIntro(false)}
          onLoadProgress={(progress) => {
            if (progress?.currentTime > 0) {
              setResumeTime(progress.currentTime);
            } else {
              setShouldPlay(true);
            }
          }}
        />
      )}

      {/* Prev/Next Navigation */}
      {hovering && showControls && (
        <div className="absolute bottom-8 w-full flex justify-center gap-4 z-20">
          {prevId && (
            <button
              onClick={() => onNavigate(prevId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              <SkipBack size={18} /> Previous
            </button>
          )}
          {nextId && (
            <button
              onClick={() => onNavigate(nextId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              Next <SkipForward size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}