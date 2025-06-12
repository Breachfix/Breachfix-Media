"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function PlaybackEndOverlay({ onReplay, nextEpisodeId, onNextEpisode }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/80 text-white z-50">
      <h2 className="text-xl mb-4">Playback finished</h2>
      <div className="flex gap-4">
        <button onClick={onReplay} className="bg-white text-black font-bold py-2 px-6 rounded text-lg">Replay</button>
        {nextEpisodeId && (
          <button onClick={() => onNextEpisode(nextEpisodeId)} className="bg-red-600 text-white font-bold py-2 px-6 rounded text-lg flex items-center gap-2">
            Next Episode <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
}