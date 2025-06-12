"use client";

import { motion } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react";

export default function ControlsOverlay({
  isPlaying,
  togglePlayPause,
  isMuted,
  toggleMute,
  isFullscreen,
  toggleFullscreen,
}) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black via-black/30 to-transparent p-4 z-20"
    >
      {/* Center Play/Pause Button */}
      <div className="flex justify-center mb-4">
        <button 
          onClick={togglePlayPause} 
          className="bg-white/20 p-4 rounded-full hover:bg-white/40 transition"
        >
          {isPlaying 
            ? <Pause className="h-10 w-10 text-white" /> 
            : <Play className="h-10 w-10 text-white" />}
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-between items-center text-white text-sm px-2">
        <div className="flex items-center gap-4">
          <button onClick={toggleMute}>
            {isMuted 
              ? <VolumeX className="h-6 w-6" /> 
              : <Volume2 className="h-6 w-6" />}
          </button>
        </div>

        <div>
          <button onClick={toggleFullscreen}>
            {isFullscreen 
              ? <Minimize2 className="h-6 w-6" /> 
              : <Maximize2 className="h-6 w-6" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}