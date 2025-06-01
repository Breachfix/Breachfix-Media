// src/components/players/EpisodePlayer.jsx
"use client";

import ReactPlayer from "react-player";

export default function EpisodePlayer({ url, poster }) {
  return (
    <div className="w-full h-full">
      <ReactPlayer
        url={url}
        controls
        playing
        width="100%"
        height="100%"
        config={{
          file: {
            attributes: {
              poster: poster || "",
            },
          },
        }}
      />
    </div>
  );
}
