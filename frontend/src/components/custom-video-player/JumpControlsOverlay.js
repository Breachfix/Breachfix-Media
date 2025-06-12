"use client";

import { motion } from "framer-motion";
import { RotateCcw, RotateCw } from "lucide-react";

export default function JumpControlsOverlay({ onSkipBack, onSkipForward }) {
  return (
    <motion.div 
      className="absolute inset-0 flex justify-between items-center px-16 z-40"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Rewind */}
      <button 
        onClick={() => onSkipBack(10)} 
        className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition"
      >
        <div className="flex flex-col items-center">
          <RotateCcw className="h-10 w-10" />
          <span className="text-sm">10s</span>
        </div>
      </button>

      {/* Forward */}
      <button 
        onClick={() => onSkipForward(10)} 
        className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition"
      >
        <div className="flex flex-col items-center">
          <RotateCw className="h-10 w-10" />
          <span className="text-sm">10s</span>
        </div>
      </button>
    </motion.div>
  );
}