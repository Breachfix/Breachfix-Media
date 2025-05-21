"use client";

import CircleLoader from "@/components/circle-loader";
import { GlobalContext } from "@/context";
import { fetchWatchContent } from "@/utils";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import ReactPlayer from "react-player";
import RequireAuth from "@/components/RequireAuth";

export default function Watch() {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const params = useParams();
  const { pageLoader, setPageLoader } = useContext(GlobalContext);

  useEffect(() => {
    async function getMediaDetails() {
      try {
        const type = params.id?.[0];
        const id = params.id?.[1];

        if (!type || !id) {
          console.error("❌ Missing type or ID in URL params");
          return;
        }

        const content = await fetchWatchContent(type, id);
        setMediaDetails(content);
        setVideoUrl(content.videoUrl);
        setPageLoader(false);
      } catch (error) {
        console.error("❌ Failed to fetch media details:", error);
      }
    }

    getMediaDetails();
  }, [params]);

  if (pageLoader || !mediaDetails) return <CircleLoader />;

  return (
    <RequireAuth>
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <ReactPlayer
        url={videoUrl}
        width="100%"
        height="100%"
        style={{ position: "absolute", top: "0", left: "0" }}
        playing
        controls
      />
    </motion.div>
    </RequireAuth>
  );
}
