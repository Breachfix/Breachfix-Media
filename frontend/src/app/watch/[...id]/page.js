// "use client";

// import CircleLoader from "@/components/circle-loader";
// import { GlobalContext } from "@/context";
// import { fetchWatchContent } from "@/utils";
// import { useParams } from "next/navigation";
// import { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import ReactPlayer from "react-player";
// import RequireAuth from "@/components/RequireAuth";

// export default function Watch() {
//   const [mediaDetails, setMediaDetails] = useState(null);
//   const [videoUrl, setVideoUrl] = useState(null);

//   const params = useParams();
//   const { pageLoader, setPageLoader } = useContext(GlobalContext);

//   useEffect(() => {
//     async function getMediaDetails() {
//       try {
//         const type = params.id?.[0];
//         const id = params.id?.[1];

//         if (!type || !id) {
//           console.error("❌ Missing type or ID in URL params");
//           return;
//         }

//         const content = await fetchWatchContent(type, id);
//         setMediaDetails(content);
//         setVideoUrl(content.videoUrl);
//         setPageLoader(false);
//       } catch (error) {
//         console.error("❌ Failed to fetch media details:", error);
//       }
//     }

//     getMediaDetails();
//   }, [params]);

//   if (pageLoader || !mediaDetails) return <CircleLoader />;

//   return (
//     <RequireAuth>
//     <motion.div
//       initial={{ opacity: 0, scale: 0.5 }}
//       animate={{ opacity: 1, scale: 1 }}
//       transition={{
//         duration: 0.8,
//         delay: 0.5,
//         ease: [0, 0.71, 0.2, 1.01],
//       }}
//     >
//       <ReactPlayer
//         url={videoUrl}
//         width="100%"
//         height="100%"
//         style={{ position: "absolute", top: "0", left: "0" }}
//         playing
//         controls
//       />
//     </motion.div>
//     </RequireAuth>
//   );
// }

"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import videojs from "video.js";
import "video.js/dist/video-js.css";

import CircleLoader from "@/components/circle-loader";
import RequireAuth from "@/components/RequireAuth";
import { GlobalContext } from "@/context";
import { fetchWatchContent } from "@/utils";

export default function Watch() {
  const [mediaDetails, setMediaDetails] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const { pageLoader, setPageLoader } = useContext(GlobalContext);
  const params = useParams();

  const videoNode = useRef(null);       // DOM element for <video>
  const playerRef = useRef(null);       // Video.js player instance

  // Fetch media details
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

  // Initialize Video.js player
  useEffect(() => {
    if (videoUrl && videoNode.current) {
      const player = videojs(videoNode.current, {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        sources: [
          {
            src: videoUrl,
            type: "application/x-mpegURL", // HLS stream
          },
        ],
      });

      playerRef.current = player;

      return () => {
        if (player) {
          player.dispose();
        }
      };
    }
  }, [videoUrl]);

  if (pageLoader || !mediaDetails) return <CircleLoader />;

  return (
    <RequireAuth>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="video-container w-full h-full"
      >
        <div data-vjs-player>
          <video
            ref={videoNode}
            className="video-js vjs-big-play-centered vjs-default-skin w-full h-full"
            playsInline
          />
        </div>
      </motion.div>
    </RequireAuth>
  );
}