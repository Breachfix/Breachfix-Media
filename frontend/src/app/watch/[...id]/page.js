"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { GlobalContext } from "@/context";
import RequireAuth from "@/components/RequireAuth";
import CircleLoader from "@/components/circle-loader";
import { fetchWatchContent } from "@/utils";
import MoviePlayer from "@/components/players/MoviePlayer";
import EpisodePlayer from "@/components/players/EpisodePlayer";

export default function WatchPage() {
  const [media, setMedia] = useState(null);
  const [error, setError] = useState(null);
  const { setPageLoader } = useContext(GlobalContext);
  const params = useParams();
  const router = useRouter();

  const [showHeader, setShowHeader] = useState(true);
  const [showGenres, setShowGenres] = useState(true);

useEffect(() => {
  const load = async () => {
    try {
      setPageLoader(true);

      const type = params.id?.[0];
      const rawId = params.id?.[1];
      if (!type || !rawId) throw new Error("Missing type or ID");

      // Normalize the ID (if coming from favorites or shared media object)
      const mediaId = rawId.startsWith("fav-")
        ? rawId.replace("fav-", "") // Example: use a prefix convention if you pass it from favorites
        : rawId;

      const content = await fetchWatchContent(type, mediaId); // ✅ Will auto-detect movieID/etc inside

      setMedia({
        ...content,
        type,
        nextEpisodeId: content.nextEpisodeId || null,
        prevEpisodeId: content.prevEpisodeId || null,
      });
    } catch (e) {
      console.error("❌ Error in WatchPage:", e);
      setError(e.message || "Unknown error");
    } finally {
      setPageLoader(false);
    }
  };

  load();
}, [params]);

  useEffect(() => {
    // Hide header and genres after 5 seconds
    const timeout = setTimeout(() => {
      setShowHeader(false);
      setShowGenres(true);

      // Show genres again at 60s (midway preview behavior)
      const genreTimeout = setTimeout(() => {
        setShowGenres(false);
      }, 8000);

      return () => clearTimeout(genreTimeout);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [media]);

  useEffect(() => {
    const showUI = () => {
      setShowHeader(true);
      setShowGenres(true);

      // Hide again after 3 seconds
      const timeout = setTimeout(() => {
        setShowHeader(false);
        setShowGenres(false);
      }, 3000);

      return () => clearTimeout(timeout);
    };

    window.addEventListener("mousemove", showUI);
    window.addEventListener("touchstart", showUI);

    return () => {
      window.removeEventListener("mousemove", showUI);
      window.removeEventListener("touchstart", showUI);
    };
  }, []);

  if (!media) return <CircleLoader />;

  const getPlayableUrl = () => {
    if (media.type === "movie") return media.HLS?.master;
    return media.videoUrl || media.transcodedVideo || media.trailerUrl;
  };

  const renderGenres = () => {
    if (!media.genres || media.genres.length === 0 || !showGenres) return null;
    return (
      <div className="absolute top-16 left-0 w-full px-4 z-10 flex gap-2 flex-wrap text-sm text-gray-300 transition-opacity duration-700 ease-in-out">
        {media.genres.map((genre) => (
          <span key={genre} className="bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
            {genre}
          </span>
        ))}
      </div>
    );
  };

  return (
    <RequireAuth>
      <motion.div className="relative w-full h-screen bg-black text-white">
        {showHeader && (
          <div className="absolute top-0 left-0 w-full px-4 py-3 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center z-10 transition-opacity duration-700 ease-in-out">
            <button onClick={() => router.push("/browse")} className="flex items-center gap-2">
              <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
            </button>
            <span className="text-lg font-semibold truncate">{media.title}</span>
          </div>
        )}

        {renderGenres()}

        {error ? (
          <div className="text-red-500 text-center pt-20">{error}</div>
        ) : media.type === "movie" ? (
          <MoviePlayer hlsUrl={getPlayableUrl()} poster={media.posterUrl || media.thumbnailUrl} />
        ) : (
          <EpisodePlayer
            episodeId={media.id || media._id}
            url={getPlayableUrl()}
            poster={media.posterUrl || media.thumbnailUrl}
            nextEpisodeId={media.nextEpisodeId}
            prevEpisodeId={media.prevEpisodeId}
            tvShowId={media.tvShowId}
            seasonNumber={media.seasonNumber}
            episodeNumber={media.episodeNumber}
          />
        )}
      </motion.div>
    </RequireAuth>
  );
}