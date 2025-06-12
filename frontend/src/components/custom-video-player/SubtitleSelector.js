"use client";

import React from "react";

export default function SubtitleSelector({ availableSubtitles = [], selected, onSelect }) {
  if (!Array.isArray(availableSubtitles) || availableSubtitles.length === 0) {
    return null; // No subtitles to display
  }

  return (
    <div className="absolute right-4 bottom-36 bg-black/80 text-white p-3 rounded z-30">
      <h4 className="font-bold mb-2">Subtitles</h4>
      {availableSubtitles.map((lang, index) => (
        <button
          key={index}
          onClick={() => onSelect(lang)}
          className={`block w-full text-left py-1 px-2 rounded hover:bg-white/20 ${
            selected === lang ? "bg-white/30" : ""
          }`}
        >
          {lang || "Unknown"}
        </button>
      ))}
    </div>
  );
}