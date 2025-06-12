"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { GlobalContext } from "@/context";
import RequireAuth from "@/components/RequireAuth";
import CircleLoader from "@/components/circle-loader";
import { fetchWatchContent } from "@/utils";
import CustomVideoPlayer from "@/components/custom-video-player/CustomVideoPlayer";

export default function WatchPage() {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const { setPageLoader } = useContext(GlobalContext);
  const params = useParams();
  const router = useRouter();

  const [isMobile, setIsMobile] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [displayMode, setDisplayMode] = useState("title"); // title or genre
  const [genreIndex, setGenreIndex] = useState(0);

  let hideHeaderTimeout = null;
  let modeSwitchInterval = null;

  const genresArray = media?.genres?.length ? media.genres : media?.parentTVShow?.genres || [];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoader(true);
        const type = params.id?.[0];
        const rawId = params.id?.[1];
        if (!type || !rawId) throw new Error("Missing type or ID");

        const mediaId = rawId.startsWith("fav-") ? rawId.replace("fav-", "") : rawId;
        const content = await fetchWatchContent(type, mediaId);
        setMedia(content);
      } catch (e) {
        console.error("❌ Error in WatchPage:", e);
        setError(e.message || "Unknown error");
      } finally {
        setPageLoader(false);
      }
    };

    load();
  }, [params]);

  // Header auto-hide
  useEffect(() => {
    if (!media) return;

    hideHeaderTimeout = setTimeout(() => setShowHeader(false), 4000);
    return () => clearTimeout(hideHeaderTimeout);
  }, [media]);

  // Genre switching interval logic
  useEffect(() => {
    if (!media || genresArray.length === 0) return;

    modeSwitchInterval = setInterval(() => {
      setDisplayMode((prevMode) => {
        if (prevMode === "title") {
          setGenreIndex(0);
          return "genre";
        } else {
          if (genreIndex + 1 >= genresArray.length) {
            return "title";  // go back to title after all genres are shown
          }
          setGenreIndex((prev) => prev + 1);
          return "genre";
        }
      });
    }, 3000); // 3 sec for each genre/title

    return () => clearInterval(modeSwitchInterval);
  }, [media, genresArray, genreIndex]);

  const handleMouseMove = () => {
    setShowHeader(true);
    clearTimeout(hideHeaderTimeout);
    hideHeaderTimeout = setTimeout(() => setShowHeader(false), 3000);
  };

  if (!media) return <CircleLoader />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <RequireAuth>
      <motion.div 
        className="relative w-full h-screen bg-black text-white"
        onMouseMove={handleMouseMove}
      >

        <AnimatePresence>
          {showHeader && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 left-0 w-full px-4 py-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-20"
            >
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-white bg-black bg-opacity-50 px-3 py-2 rounded-md hover:bg-opacity-70"
              >
                <ArrowLeft size={20} />
              </button>

              {!isMobile && (
                <span className="text-md font-semibold truncate max-w-[60%] text-white">
                  {displayMode === "title"
                    ? media.title
                    : genresArray[genreIndex] || "No Genre"}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <CustomVideoPlayer
          sourceUrl={media.HLS?.master || media.videoUrl}
          poster={media.posterUrl || media.thumbnailUrl}
          media={media}
          parentTVShow={media.parentTVShow}
          mediaId={media.id}
          type={media.type}
          nextEpisodeId={media.nextEpisodeId}
          onNextEpisode={(nextId) => {
            if (nextId) {
              router.push(`/watch/${media.type}/${nextId}`);
            }
          }}
        />
      </motion.div>
    </RequireAuth>
  );
}