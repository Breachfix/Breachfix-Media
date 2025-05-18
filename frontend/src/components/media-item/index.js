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
import { useAuth } from "@/context/AuthContext"; // ✅ this is your custom context
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
    if (res)
      setFavorites(
        res.map((item) => ({
          ...item,
          addedToFavorites: true,
        }))
      );
  }

async function handleAddToFavorites(item) {
  const {
    id,
    type,
    title,
    description,
    backdrop_path,
    poster_path,
    thumbnail_url_s3,
    thumbnailUrl,
    thumbnail_url,
    posterUrl,
    video_url_s3,       // ✅ new
    videoUrl,           // ✅ optional fallback
  } = item;

  // Choose the best available thumbnail
  const imageUrl =
    thumbnail_url_s3 ||
    thumbnailUrl ||
    thumbnail_url ||
    posterUrl ||
    poster_path ||
    backdrop_path ||
    "/fallback.jpg";

  // Choose the video URL
  const videoUrlToSave = video_url_s3 || videoUrl || "";

  const res = await fetch("/api/favorites/add-favorite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uid: user?.id,
      accountID: loggedInAccount?._id,
      movieID: id,
      type,
      title,
      description,
      thumbnail_url_s3: imageUrl,
      video_url_s3: videoUrlToSave, // ✅ now included
    }),
  });

  const data = await res.json();

  if (data && data.success) {
    if (pathName.includes("my-list")) updateFavorites();

    if (searchView) {
      const updated = [...searchResults];
      const i = updated.findIndex((m) => m.id === id);
      updated[i] = { ...updated[i], addedToFavorites: true };
      setSearchResults(updated);
    } else if (similarMovieView) {
      const updated = [...similarMedias];
      const i = updated.findIndex((m) => m.id === id);
      updated[i] = { ...updated[i], addedToFavorites: true };
      setSimilarMedias(updated);
    } else {
      const updated = [...mediaData];
      const rowIndex = updated.findIndex((row) => row.title === title);
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

  console.log("MEDIA ITEM:", media);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
        <Image
  src={imageUrl}
  alt={media?.title || "Media"}
  layout="fill"
  className="rounded sm object-cover md:rounded hover:rounded-sm"
  onClick={() => {
    if (media?.type === "tv") {
      router.push(`/tv/${listView ? media?.movieID : media?.id}`);
    } else {
      router.push(`/watch/movie/${listView ? media?.movieID : media?.id}`);
    }
  }}
  
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
            className={`${
              media?.addedToFavorites && !listView && "cursor-not-allowed"
            } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white   bg-black opacity-75 text-black`}
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
                type: media?.type,
                id: listView ? media?.movieID : media?.id,
              });
            }}
            className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90  border-white  bg-black opacity-75 "
          >
            <ChevronDownIcon color="#fffffff" className="h-7 w-7" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
