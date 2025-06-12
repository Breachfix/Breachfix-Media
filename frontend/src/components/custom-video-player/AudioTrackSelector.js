"use client";

import React from "react";

export default function AudioTrackSelector({ availableTracks = [], selected, onSelect }) {
  if (!Array.isArray(availableTracks) || availableTracks.length === 0) {
    return null; // No audio tracks to display
  }

  return (
    <div className="absolute right-4 bottom-56 bg-black/80 text-white p-3 rounded z-30">
      <h4 className="font-bold mb-2">Audio</h4>
      {availableTracks.map((track, index) => (
        <button
          key={index}
          onClick={() => onSelect(track)}
          className={`block w-full text-left py-1 px-2 rounded hover:bg-white/20 ${
            selected === track ? "bg-white/30" : ""
          }`}
        >
          {track || "Default"}
        </button>
      ))}
    </div>
  );
}