"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TopInfoOverlay({ media, parentTVShow }) {
  if (!media) return null;

  const genresArray = media?.genres?.length 
    ? media.genres 
    : parentTVShow?.genres?.length 
      ? parentTVShow.genres 
      : [];

  const genres = genresArray.length ? genresArray : ["No Genre"];

  const [currentIndex, setCurrentIndex] = useState(-1);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (genres.length === 0) return;

    let index = -1;
    const interval = setInterval(() => {
      index += 1;
      if (index >= genres.length) {
        clearInterval(interval);
        setTimeout(() => setShowOverlay(false), 1000);  // hide after final genre
      } else {
        setCurrentIndex(index);
      }
    }, 2000);  // time per genre

    return () => clearInterval(interval);
  }, [genres]);

  if (!showOverlay) return null;

  return (
    <div className="absolute top-1/3 left-0 right-0 flex justify-center items-center z-40">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-black/50 px-8 py-4 rounded-xl backdrop-blur-md"
      >
        <div className="text-center text-lg text-white tracking-wide">
          {currentIndex === -1 ? "Themes" : genres[currentIndex]}
        </div>
      </motion.div>
    </div>
  );
}