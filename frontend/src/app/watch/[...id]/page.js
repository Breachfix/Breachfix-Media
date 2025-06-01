// src/app/watch/page.jsx (WatchPage)
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
  const { setPageLoader, subscriptionPlan } = useContext(GlobalContext);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setPageLoader(true);
        const type = params.id?.[0];
        const id = params.id?.[1];
        if (!type || !id) throw new Error("Missing type or ID");

        const content = await fetchWatchContent(type, id);
        setMedia({ ...content, type });
      } catch (e) {
        setError(e.message || "Unknown error");
      } finally {
        setPageLoader(false);
      }
    };
    load();
  }, [params]);

  if (!media) return <CircleLoader />;

  const getPlayableUrl = () => {
    if (media.type === "movie") return media.HLS?.master;
    return media.videoUrl || media.transcodedVideo || media.trailerUrl;
  };

  return (
    <RequireAuth>
      <motion.div className="relative w-full h-screen bg-black text-white">
        <div className="absolute top-0 left-0 w-full px-4 py-3 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center z-10">
          <button onClick={() => router.push("/browse")} className="flex items-center gap-2">
            <ArrowLeft size={20} /> <span className="hidden sm:inline">Back</span>
          </button>
          <span className="text-lg font-semibold truncate">{media.title}</span>
        </div>

        {error ? (
          <div className="text-red-500 text-center pt-20">{error}</div>
        ) : media.type === "movie" ? (
          <MoviePlayer hlsUrl={getPlayableUrl()} poster={media.posterUrl || media.thumbnailUrl} />
        ) : (
          <EpisodePlayer url={getPlayableUrl()} poster={media.posterUrl || media.thumbnailUrl} />
        )}
      </motion.div>
    </RequireAuth>
  );
}
