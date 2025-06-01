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
    console.log("💾 Saving favorite with type:", detectedType, "ID:", id);

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
        movieID: id,
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
    console.log("✅ Favorite added:", data);
  }

  async function handleRemoveFavorites(item) {
    const res = await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.success) updateFavorites();
  }

  const isValidImage = (url) => typeof url === "string" && url.startsWith("http");

  const imageUrl = isValidImage(media?.posterUrl)
    ? media.posterUrl
    : isValidImage(media?.thumbnail_url_s3)
    ? media.thumbnail_url_s3
    : isValidImage(media?.thumbnailUrl)
    ? media.thumbnailUrl
    : isValidImage(media?.thumbnail_url)
    ? media.thumbnail_url
    : "/fallback.jpg";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
    >
      <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
        <Image
          src={imageUrl}
          alt={media?.title || "Media"}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded sm object-cover md:rounded hover:rounded-sm"
          onClick={() => {
            const type = detectMediaType(media);
            const idToUse = listView ? media?.movieID : media?.id;
            if (type === "episode") router.push(`/watch/episode/${idToUse}`);
            else if (type === "tv") router.push(`/tv/${idToUse}`);
            else router.push(`/watch/movie/${idToUse}`);
          }}
          unoptimized
        />

        <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
          <button
            onClick={
              media?.addedToFavorites
                ? listView
                  ? () => handleRemoveFavorites(media)
                  : null
                : () => handleAddToFavorites(media)
            }
            className={`$${
              media?.addedToFavorites && !listView && "cursor-not-allowed"
            } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75 text-black`}
          >
            {media?.addedToFavorites ? (
              <CheckIcon color="#ffffff" className="h-7 w-7" />
            ) : (
              <PlusIcon color="#ffffff" className="h-7 w-7" />
            )}
          </button>
          <button
            onClick={() => {
              setShowDetailsPopup(true);
              setCurrentMediaInfoIdAndType({
                type: detectMediaType(media),
                id: listView ? media?.movieID : media?.id,
              });
            }}
            className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full text-sm font-semibold transition hover:opacity-90 border-white bg-black opacity-75"
          >
            <ChevronDownIcon color="#ffffff" className="h-7 w-7" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}