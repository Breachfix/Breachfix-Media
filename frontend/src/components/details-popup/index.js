"use client";

import { motion } from "framer-motion";
import MuiModal from "@mui/material/Modal";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "@/context";
import {
  getAllfavorites,
  getSimilarTVorMovies,
  getTVorMovieDetailsByID,
  fetchTrailerFromYouTube
} from "@/utils";
import ReactPlayer from "react-player";
import MediaItem from "../media-item";
import { AiFillPlayCircle } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DetailsPopup({ show, setShow }) {
  const {
    mediaDetails,
    setMediaDetails,
    similarMedias,
    setSimilarMedias,
    currentMediaInfoIdAndType,
    setCurrentMediaInfoIdAndType,
    loggedInAccount,
  } = useContext(GlobalContext);

  const [key, setKey] = useState("rgTKJE5Z_sk"); // fallback key
  const router = useRouter();
  const { user } = useAuth();
  const modalRef = useRef(null);

  useEffect(() => {
    if (!currentMediaInfoIdAndType) return;

    async function getMediaDetails() {
      const { type, id } = currentMediaInfoIdAndType;

      // Step 1: Get the full media details
      const extractMediaDetails = await getTVorMovieDetailsByID(type, id);
      setMediaDetails(extractMediaDetails);

      // Step 2: Get similar media and favorites
      const extractSimilarMovies = await getSimilarTVorMovies(type, id);
      const allFavorites = await getAllfavorites(user?.id, loggedInAccount?._id);

      setSimilarMedias(
        extractSimilarMovies.map((item) => ({
          ...item,
          type: type === "movie" ? "movie" : "tv",
          addedToFavorites:
            allFavorites?.map((fav) => fav.movieID).includes(item.id) ?? false,
        }))
      );

      // Step 3: Determine the YouTube key
      let videoKey = extractMediaDetails?.videoKey || null;

      // If not available, try YouTube fallback
      if (!videoKey && extractMediaDetails?.title) {
        const fallbackKey = await fetchTrailerFromYouTube(extractMediaDetails.title);
        if (fallbackKey) videoKey = fallbackKey;
      }

      setKey(videoKey || "rgTKJE5Z_sk"); // fallback if still empty

      // Step 4: Scroll modal to top
      if (modalRef.current) modalRef.current.scrollTop = 0;
    }

    getMediaDetails();
  }, [currentMediaInfoIdAndType, loggedInAccount]);

  function handleClose() {
    setShow(false);
    setCurrentMediaInfoIdAndType(null);
    setMediaDetails(null);
    setKey("rgTKJE5Z_sk");
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <MuiModal
        open={show}
        onClose={handleClose}
        className="fixed !top-7 left-0 right-0 z-50 w-full mx-auto max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide"
      >
        <div ref={modalRef}>
          <button
            onClick={handleClose}
            className="modalButton flex items-center justify-center absolute top-5 right-5 bg-[#181818] hover:bg-[#181818] !z-40 border-none h-9 w-9"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Video Player */}
          <div className="relative pt-[56.25%]">
            <ReactPlayer
              key={key}
              url={`https://www.youtube.com/watch?v=${key}`}
              width="100%"
              height="100%"
              style={{ position: "absolute", top: "0", left: "0" }}
              playing
              controls
            />
            <div className="absolute bottom-[4.25rem] flex w-full items-center justify-between pl-[1.5rem]">
              <div>
                <button
                  onClick={() =>
                    router.push(
                      `/watch/${currentMediaInfoIdAndType?.type}/${currentMediaInfoIdAndType?.id}`
                    )
                  }
                  className="cursor-pointer flex items-center gap-x-2 rounded px-5 py-1.5 text-sm font-semibold transition hover:opacity-75 md:py-2.5 md:px-8 md:text-xl bg-white text-black"
                >
                  <AiFillPlayCircle className="h-4 w-4 text-black md:h-7 md:w-7 cursor-pointer" />
                  Play
                </button>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="rounded-b-md bg-[#181818] p-8">

            <div className="pb-8 text-white space-y-4">

  {/* Title & Year */}
  <div className="flex flex-wrap items-center gap-4 text-2xl font-extrabold tracking-wide">
    <h1 className="text-white uppercase">{mediaDetails?.title || "Untitled"}</h1>
    {mediaDetails?.release_date && (
      <span className="bg-red-600 text-white px-2 py-0.5 rounded text-sm font-semibold">
        {mediaDetails.release_date.split("-")[0]}
      </span>
    )}
    {currentMediaInfoIdAndType?.type && (
      <span className="bg-white text-black px-2 py-0.5 rounded text-xs font-bold">
        {currentMediaInfoIdAndType.type.toUpperCase()}
      </span>
    )}
    <span className="border border-white/50 text-white text-xs px-2 py-0.5 rounded">
      HD
    </span>
  </div>

  {/* Duration / Language */}
  <div className="flex flex-wrap gap-4 text-sm text-gray-300 font-medium">
    {mediaDetails?.duration && (
      <span className="flex items-center gap-1">
        ⏱️ {Math.floor(mediaDetails.duration / 60)} min
      </span>
    )}
    {mediaDetails?.language && (
      <span className="flex items-center gap-1">
        🌍 {mediaDetails.language}
      </span>
    )}
  </div>

  {/* Director */}
  {mediaDetails?.director && (
    <div className="text-sm text-gray-400">
      🎬 <span className="italic">Directed by</span> {mediaDetails.director}
    </div>
  )}

  {/* Genres */}
  {mediaDetails?.genres?.length > 0 && (
    <div className="text-sm text-gray-400">
      🎭 <span className="font-medium">Genres:</span>{" "}
      <span className="text-white">{mediaDetails.genres.join(", ")}</span>
    </div>
  )}

  {/* Pricing */}
  {mediaDetails?.pricing && (
    <div className="text-sm font-semibold text-yellow-400">
      💰 {mediaDetails.pricing.type === "free"
        ? "Free to Watch"
        : mediaDetails.pricing.purchasePrice
        ? `Buy for $${mediaDetails.pricing.purchasePrice}`
        : mediaDetails.pricing.rentalPrice
        ? `Rent for $${mediaDetails.pricing.rentalPrice}`
        : "Premium Access"}
    </div>
  )}

  {/* Description */}
  {mediaDetails?.description && (
  <div className="text-sm text-gray-300 leading-relaxed space-y-3 mt-4">
    {mediaDetails.description.split("\n").map((line, index) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;

      const parts = line.split(urlRegex).filter(Boolean); // Remove empty strings
      return (
        <p key={index} className="whitespace-pre-line break-words">
          {parts.map((part, i) =>
            urlRegex.test(part) ? (
              <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline hover:text-blue-300"
              >
                {part}
              </a>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </p>
      );
    })}
  </div>
)}
</div>

            {/* Similar Content */}
            <h2 className="mt-10 mb-6 cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
              More Like This
            </h2>
            <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
              {similarMedias?.length
                ? similarMedias
                    .filter(
                      (item) =>
                        item.backdrop_path !== null &&
                        item.poster_path !== null
                    )
                    .map((mediaItem) => (
                      <MediaItem
                        key={mediaItem.id || mediaItem._id}
                        media={mediaItem}
                        similarMovieView
                      />
                    ))
                : null}
            </div>
          </div>
        </div>
      </MuiModal>
    </motion.div>
  );
}