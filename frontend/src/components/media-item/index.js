"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { getAllfavorites } from "@/utils";

export default function MediaItem({
  media,
  searchView = false,
  similarMovieView = false,
  listView = false,
  title,
}) {
  const router = useRouter();
  const pathName = usePathname();
  const {
    setShowDetailsPopup,
    loggedInAccount,
    setFavorites,
    setCurrentMediaInfoIdAndType,
    similarMedias,
    searchResults,
    setSearchResults,
    setSimilarMedias,
    setMediaData,
    mediaData,
  } = useContext(GlobalContext);

  const { user } = useAuth();

  async function updateFavorites() {
    const res = await getAllfavorites(user?.id, loggedInAccount?._id);
    if (res) {
      setFavorites(
        res.map((item) => ({
          ...item,
          addedToFavorites: true,
        }))
      );
    }
  }

  function detectMediaType(item) {
    if (item?.type) return item.type;
    if (item?.seasonNumber && item?.episodeNumber) return "episode";
    if (item?.seasons) return "tv";
    return "movie";
  }

  async function handleAddToFavorites(item) {
    const {
      id,
      title,
      description,
      backdrop_path,
      poster_path,
      thumbnail_url_s3,
      thumbnailUrl,
      thumbnail_url,
      posterUrl,
      video_url_s3,
      videoUrl,
    } = item;

    const detectedType = detectMediaType(item);
    let finalTitle = title || "";
    let finalDescription = description || "";
    let imageUrl =
      thumbnail_url_s3 ||
      thumbnailUrl ||
      thumbnail_url ||
      posterUrl ||
      poster_path ||
      backdrop_path ||
      "/fallback.jpg";

    let videoUrlToSave = video_url_s3 || videoUrl || "";

    if (detectedType === "episode" && (!finalTitle || !finalDescription)) {
      try {
        const episodeDetails = await fetch(`/api/v1/episodes/${id}`).then((res) =>
          res.json()
        );
        finalTitle = episodeDetails?.title || "Untitled Episode";
        finalDescription = episodeDetails?.description || "No description available";
        imageUrl =
          episodeDetails?.thumbnail_url_s3 ||
          episodeDetails?.thumbnail_url ||
          imageUrl;
        videoUrlToSave = episodeDetails?.video_url_s3 || videoUrlToSave;
      } catch (err) {
        console.error("❌ Failed to fetch episode details fallback", err);
      }
    }

    const res = await fetch("/api/favorites/add-favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user?.id,
        accountID: loggedInAccount?._id,
        movieID: item.movieID || item._id || item.id,
        type: detectedType,
        title: finalTitle,
        description: finalDescription,
        thumbnail_url_s3: imageUrl,
        video_url_s3: videoUrlToSave,
      }),
    });

    const data = await res.json();

    if (data?.success) {
      if (pathName.includes("my-list")) updateFavorites();

      const updateArray = (arr, setter) => {
        const updated = [...arr];
        const i = updated.findIndex((m) => m.id === id);
        if (i !== -1) updated[i] = { ...updated[i], addedToFavorites: true };
        setter(updated);
      };

      if (searchView) updateArray(searchResults, setSearchResults);
      else if (similarMovieView) updateArray(similarMedias, setSimilarMedias);
      else {
        const updated = [...mediaData];
        const rowIndex = updated.findIndex((row) =>
          row.medias.some((m) => m.id === id)
        );
        if (rowIndex !== -1) {
          const itemIndex = updated[rowIndex].medias.findIndex(
            (m) => m.id === id
          );
          updated[rowIndex].medias[itemIndex] = {
            ...updated[rowIndex].medias[itemIndex],
            addedToFavorites: true,
          };
          setMediaData(updated);
        }
      }
    }
  }

  async function handleRemoveFavorites(item) {
    const res = await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) updateFavorites();
  }

  const isValidImage = (url) => typeof url === "string" && url.startsWith("http");

  function getThumbnailFallback(media) {
    if (isValidImage(media?.video_url_s3)) {
      const base = media.video_url_s3.split("/").slice(0, -1).join("/");
      return `${base}/thumbnail.jpg`;
    }
    return "/fallback.jpg";
  }

  const imageUrl =
    isValidImage(media?.thumbnail_url_s3) ? media.thumbnail_url_s3 :
    isValidImage(media?.thumbnailUrl) ? media.thumbnailUrl :
    isValidImage(media?.posterUrl) ? media.posterUrl :
    isValidImage(media?.thumbnail_url) ? media.thumbnail_url :
    isValidImage(media?.backdrop_path) ? media.backdrop_path :
    getThumbnailFallback(media);

  const type = detectMediaType(media);
  const favoriteIdToUse = media?.movieID;
  const generalIdToUse = media?.movieID|| media?.mediaId || media?.id || media?._id || null;

  if (!generalIdToUse) {
    console.warn("⚠️ Missing media ID:", media);
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="relative w-[85vw] h-[50vw] sm:h-36 sm:min-w-[260px] sm:max-w-[260px] cursor-pointer transform transition duration-500 hover:scale-105 hover:z-[999]">
        <Image
          src={imageUrl}
          alt={media?.title || "Media"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded sm object-cover md:rounded hover:rounded-sm"
          unoptimized
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-50 rounded">
          <button
            onClick={() => {
              if (type === "episode") router.push(`/watch/episode/${generalIdToUse}`);
              else if (type === "tv") router.push(`/tv/${generalIdToUse}`);
              else router.push(`/watch/movie/${generalIdToUse}`);
            }}
            className="text-white bg-white/20 hover:bg-white/40 text-sm px-4 py-2 rounded-full mb-2"
          >
            {(type === "tv" && "View Episodes") ||
              (type === "episode" && "Watch Now") ||
              "Watch Now"}
          </button>

          <div className="flex space-x-3 mt-2">
            <button
              onClick={
                media?.addedToFavorites
                  ? listView
                    ? () => handleRemoveFavorites(media)
                    : null
                  : () => handleAddToFavorites(media)
              }
              className={`${
                media?.addedToFavorites && !listView && "cursor-not-allowed"
              } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black bg-opacity-70 text-white`}
            >
              {media?.addedToFavorites ? (
                <CheckIcon className="h-5 w-5" />
              ) : (
                <PlusIcon className="h-5 w-5" />
              )}
            </button>

            <button
              onClick={() => {
                if (!generalIdToUse) {
                  console.warn("⛔ No ID found for media", media);
                  return;
                }
                const mediaID = media.movieID || media._id || media.id;
                setCurrentMediaInfoIdAndType({ type, id: mediaID });
                setShowDetailsPopup(true);
              }}
              className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black bg-opacity-70 text-white"
            >
              <ChevronDownIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}