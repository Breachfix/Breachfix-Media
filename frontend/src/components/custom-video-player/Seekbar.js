"use client";

import { useEffect, useRef, useState } from "react";

export default function Seekbar({ currentTime, duration, onSeek, videoRef }) {
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [localProgress, setLocalProgress] = useState(currentTime);
  const [previewTime, setPreviewTime] = useState(null);
  const [previewLeft, setPreviewLeft] = useState(0);
  const seekbarRef = useRef();

  useEffect(() => { setLocalProgress(currentTime); }, [currentTime]);

  useEffect(() => {
    if (!videoRef?.current) return;
    const video = videoRef.current;

    const updateBuffered = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const percent = (bufferedEnd / duration) * 100;
        setBufferedPercent(percent);
      }
    };

    video.addEventListener("progress", updateBuffered);
    updateBuffered();

    return () => video.removeEventListener("progress", updateBuffered);
  }, [videoRef, duration]);

  const handleChange = (e) => {
    const newVal = parseFloat(e.target.value);
    setLocalProgress(newVal);
  };

  const handleSeekCommit = (e) => {
    const newVal = parseFloat(e.target.value);
    onSeek(newVal);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleMouseMove = (e) => {
    if (!seekbarRef.current || !duration) return;

    const rect = seekbarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = Math.min(Math.max(percent * duration, 0), duration);
    setPreviewTime(newTime);
    setPreviewLeft(percent * 100);
  };

  return (
    <div className="flex flex-col w-full px-4">
      <div
        ref={seekbarRef}
        className="relative w-full h-2 bg-gray-600 rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPreviewTime(null)}
      >
        {/* Buffered */}
        <div className="absolute top-0 left-0 h-full bg-gray-400" style={{ width: `${bufferedPercent}%` }} />

        {/* Watched */}
        <div className="absolute top-0 left-0 h-full bg-red-500" style={{ width: `${(localProgress / duration) * 100}%` }} />

        {/* Slider */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={localProgress}
          onChange={handleChange}
          onMouseDown={() => setIsSeeking(true)}
          onMouseUp={(e) => { setIsSeeking(false); handleSeekCommit(e); }}
          onTouchStart={() => setIsSeeking(true)}
          onTouchEnd={(e) => { setIsSeeking(false); handleSeekCommit(e); }}
          className="w-full h-2 bg-transparent appearance-none absolute top-0 left-0"
        />

        {/* Thumbnail Preview */}
        {previewTime !== null && (
          <div
            className="absolute bottom-8 transform -translate-x-1/2 bg-black/80 text-white p-2 rounded text-xs"
            style={{ left: `${previewLeft}%` }}
          >
            {/* Here you could render thumbnails */}
            <div className="mb-1">📷</div>
            {formatTime(previewTime)}
          </div>
        )}
      </div>

      <div className="flex justify-between text-xs text-gray-300 mt-1">
        <span>{formatTime(localProgress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}