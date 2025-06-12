"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { motion, AnimatePresence } from "framer-motion";
import WatchProgressHandler from "@/components/WatchProgressHandler";
import ControlsOverlay from "./ControlsOverlay";
import Seekbar from "./Seekbar";
import NextUpOverlay from "./NextUpOverlay";
import PlaybackEndOverlay from "./PlaybackEndOverlay";
import AudioTrackSelector from "./AudioTrackSelector";
import SubtitleSelector from "./SubtitleSelector";
import JumpControlsOverlay from "@/components/custom-video-player/JumpControlsOverlay";

export default function CustomVideoPlayer({ sourceUrl, poster, media, nextEpisodeId, onNextEpisode }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hlsRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const infoOverlayTimeoutRef = useRef(null);
  const genreReappearTimerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [accountId, setAccountId] = useState(null);
  const [showInfoOverlay, setShowInfoOverlay] = useState(true);

  // GENRE STATE
  const [genreIndex, setGenreIndex] = useState(0);
  const [showGenreOverlay, setShowGenreOverlay] = useState(false);
  const [genreCycleComplete, setGenreCycleComplete] = useState(false);

  const genresArray = media?.genres?.length ? media.genres : media?.parentTVShow?.genres || [];
  const GENRE_INTRO_DELAY = 2000;  // 2 sec per genre
  const GENRE_REAPPEAR_INTERVAL = 300; // 5 mins (in seconds)
  const GENRE_REAPPEAR_DURATION = 5;  // seconds visible when reappears

  useEffect(() => {
    const acc = JSON.parse(sessionStorage.getItem("loggedInAccount"));
    if (acc?._id) setAccountId(acc._id);
  }, []);

  useEffect(() => {
    infoOverlayTimeoutRef.current = setTimeout(() => setShowInfoOverlay(false), 4000);
    return () => clearTimeout(infoOverlayTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!genresArray.length) return;

    setShowGenreOverlay(true);
    let idx = 0;

    const introInterval = setInterval(() => {
      setGenreIndex(idx);
      idx++;
      if (idx >= genresArray.length) {
        clearInterval(introInterval);
        setGenreCycleComplete(true);
        setTimeout(() => {
          setShowGenreOverlay(false);
        }, GENRE_INTRO_DELAY);
      }
    }, GENRE_INTRO_DELAY);

    return () => clearInterval(introInterval);
  }, [genresArray]);

  // Reappearance after initial cycle
  useEffect(() => {
    if (!genreCycleComplete) return;

    genreReappearTimerRef.current = setInterval(() => {
      setShowGenreOverlay(true);
      setTimeout(() => {
        setShowGenreOverlay(false);
      }, GENRE_REAPPEAR_DURATION * 1000);
    }, GENRE_REAPPEAR_INTERVAL * 1000);

    return () => clearInterval(genreReappearTimerRef.current);
  }, [genreCycleComplete]);

  const handleUserInteraction = () => {
    setShowControls(true);
    setShowInfoOverlay(true);
    clearTimeout(controlsTimeoutRef.current);
    clearTimeout(infoOverlayTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    infoOverlayTimeoutRef.current = setTimeout(() => setShowInfoOverlay(false), 4000);
  };

  useEffect(() => {
    if (!videoRef.current || !sourceUrl) return;
    if (hlsRef.current) hlsRef.current.destroy();

    if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = sourceUrl;
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(sourceUrl);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.ERROR, (event, data) => console.error("HLS.js error:", data));
      hlsRef.current = hls;
    } else {
      console.error("HLS not supported.");
    }

    return () => { if (hlsRef.current) hlsRef.current.destroy(); };
  }, [sourceUrl]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    setCurrentTime(video.currentTime || 0);
    setDuration(video.duration || 0);
    if (video.duration - video.currentTime < 5) setShowOverlay(true);
  };

  const handleSeek = (newTime) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = newTime;
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
    setShowOverlay(false);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-black" onMouseMove={handleUserInteraction}>

      <video
        ref={videoRef}
        poster={poster}
        autoPlay
        playsInline
        muted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setShowOverlay(true)}
        onClick={togglePlayPause}
        className="w-full h-full object-contain"
      />

      {media?.id && media?.type && accountId && (
        <WatchProgressHandler 
          accountId={accountId} 
          mediaId={media.id} 
          type={media.type} 
          videoRef={videoRef} 
        />
      )}

      {/* GENRE CINEMATIC DISPLAY */}
      <AnimatePresence>
        {showGenreOverlay && (
          <motion.div
            key={genreIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="absolute top-8 left-8 z-50 bg-black/70 px-6 py-4 rounded-lg backdrop-blur-md text-left"
          >
            <h2 className="text-xl text-gray-300 mb-3">Themes</h2>
            <h1 className="text-2xl font-bold text-white">{genresArray[genreIndex]}</h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTROLS + SEEKBAR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 flex flex-col justify-end z-40"
      >

        <div className="absolute bottom-0 left-0 right-0 px-6 z-50">
          <Seekbar 
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            videoRef={videoRef}
            poster={poster}
          />
        </div>

        <div className="absolute bottom-16 left-0 right-0 flex justify-center items-center z-40">
          <ControlsOverlay
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
          />

          <JumpControlsOverlay 
            onSkipBack={(seconds) => {
              if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - seconds);
            }}
            onSkipForward={(seconds) => {
              if (videoRef.current) videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + seconds);
            }}
          />
        </div>

        <div className="absolute bottom-36 right-4 flex flex-col gap-4 z-40">
          <AudioTrackSelector videoRef={videoRef} />
          <SubtitleSelector videoRef={videoRef} />
        </div>

      </motion.div>

      {showOverlay && (
        <>
          <PlaybackEndOverlay onReplay={handleReplay} nextEpisodeId={nextEpisodeId} onNextEpisode={onNextEpisode} />
          <NextUpOverlay nextEpisodeId={nextEpisodeId} onNextEpisode={onNextEpisode} />
        </>
      )}
    </div>
  );
}