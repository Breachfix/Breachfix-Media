// "use client";

// import { useRouter, useParams } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { getEpisodeContextById } from "@/utils";
// import Hls from "hls.js";
// import { ArrowLeft, SkipBack, SkipForward } from "lucide-react";
// import WatchProgressHandler from "@/components/WatchProgressHandler";

// export default function EpisodePlayer({
//   episode,
//   poster,
//   onSkipIntro,
//   nextEpisodeId,
//   prevEpisodeId,
// }) {
//   const router = useRouter();
//   const { id } = useParams(); // ✅ id is an array
//   const type = id?.[0];       // ✅ 'episode'
//   const mediaId = id?.[1];    // ✅ 'abc123'
//   const videoRef = useRef(null);
//   const episodeId = episode?._id;
//   const [showCountdown, setShowCountdown] = useState(false);
//   const [countdown, setCountdown] = useState(5);
//   const [hovering, setHovering] = useState(false);
//   const [showControls, setShowControls] = useState(false);
//   const hideControlsTimeout = useRef(null);
//   const [canShowSkipIntro, setCanShowSkipIntro] = useState(true);
//   const [awaitingPlay, setAwaitingPlay] = useState(false);
//   const [accountId, setAccountId] = useState(null);
 

//   useEffect(() => {
//     console.log("🎥 EpisodePlayer URL params:", { type, mediaId });
//     // You can now use mediaId and type for watch progress or other logic
//   }, [type, mediaId]);

// useEffect(() => {
//   const acc = JSON.parse(sessionStorage.getItem("loggedInAccount"));
//   if (acc?._id) {
//     setAccountId(acc._id);
//   }
// }, []);


//   useEffect(() => {
//     setShowCountdown(false);
//     setCountdown(5);
//   }, [episodeId]);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !nextEpisodeId) return;

//     let countdownInterval;

//     const handleEnded = () => {
//       setShowCountdown(true);
//       setCountdown(5);
//       let timer = 5;

//       countdownInterval = setInterval(() => {
//         timer -= 1;
//         setCountdown(timer);
//         if (timer === 0) {
//           clearInterval(countdownInterval);
//           goToEpisode(nextEpisodeId);
//         }
//       }, 1000);
//     };

//     video.addEventListener("ended", handleEnded);

//     return () => {
//       video.removeEventListener("ended", handleEnded);
//       clearInterval(countdownInterval);
//       setShowCountdown(false);
//       setCountdown(5);
//     };
//   }, [nextEpisodeId, episodeId]);

// useEffect(() => {
//   if (!episode || !videoRef.current) return;

//   // Fallback logic in case HLS is a string
//   const episodeHLS =
//     typeof episode.HLS === "string"
//       ? { master: episode.HLS }
//       : episode.HLS || {};

//   const url =
//     episodeHLS.master ||
//     episode.transcodedVideo ||
//     episode.video_url_s3 ||
//     episode.trailerUrl;

//   if (!url) return;

//   const video = videoRef.current;

//   if (Hls.isSupported()) {
//     const hls = new Hls();
//     hls.loadSource(url);
//     hls.attachMedia(video);
//     hls.on(Hls.Events.MANIFEST_PARSED, () => {
//       setTimeout(() => {
//         video
//           .play()
//           .catch((err) => {
//             console.warn("⚠️ Autoplay blocked:", err);
//             setAwaitingPlay(true);
//           });
//       }, 100);
//     });

//     hls.on(Hls.Events.ERROR, (event, data) => {
//       if (data?.fatal) {
//         switch (data.type) {
//           case Hls.ErrorTypes.NETWORK_ERROR:
//             hls.startLoad();
//             break;
//           case Hls.ErrorTypes.MEDIA_ERROR:
//             hls.recoverMediaError();
//             break;
//           default:
//             hls.destroy();
//             break;
//         }
//       }
//     });

//     return () => hls.destroy();
//   } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
//     video.src = url;
//     video.play().catch((err) => console.warn("⚠️ Autoplay blocked:", err));
//   }
// }, [episode]);
// useEffect(() => {
//   const applyResumeProgress = async () => {
//     if (!videoRef.current || !episodeId || !accountId) return;
//     try {
//       const res = await fetch(
//         `/api/watch-progress/get?accountId=${accountId}&mediaId=${episodeId}`
//       );
//       const data = await res.json();
//       if (data.success && typeof data.data === "number") {
//         const progressSeconds = data.data;
//         if (progressSeconds > 5) {
//           videoRef.current.onloadedmetadata = () => {
//   videoRef.current.currentTime = progressSeconds;
// };
//           console.log("⏩ Resumed from:", progressSeconds, "seconds");
//         }
//       } else {
//         console.log("🆕 No previous watch progress found");
//       }
//     } catch (err) {
//       console.error("⚠️ Failed to fetch resume progress:", err);
//     }
//   };

//   applyResumeProgress();
// }, [episodeId, accountId]);

//   useEffect(() => {
//     const handleInteraction = () => {
//       setHovering(true);
//       setShowControls(true);
//       clearTimeout(hideControlsTimeout.current);
//       hideControlsTimeout.current = setTimeout(() => {
//         setHovering(false);
//         setShowControls(false);
//       }, 3000);
//     };

//     window.addEventListener("mousemove", handleInteraction);
//     window.addEventListener("touchstart", handleInteraction);

//     return () => {
//       window.removeEventListener("mousemove", handleInteraction);
//       window.removeEventListener("touchstart", handleInteraction);
//       clearTimeout(hideControlsTimeout.current);
//     };
//   }, []);

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     const handleTimeUpdate = () => {
//       if (video.currentTime > 60) setCanShowSkipIntro(false);
//     };

//     video.addEventListener("timeupdate", handleTimeUpdate);
//     return () => video.removeEventListener("timeupdate", handleTimeUpdate);
//   }, []);

//   const goToEpisode = (id) => {
//     if (id) router.push(`/watch/episode/${id}`);
//   };

//   if (!episode) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black text-white">
//         <div>
//           <p className="text-lg">🔄 Loading episode...</p>
//           <p className="text-sm text-gray-400">Episode ID: {episodeId}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-screen bg-black text-white">
//       <video
//         ref={videoRef}
//         controls
//         poster={poster || episode.thumbnail_url_s3}
//         className="w-full h-full object-contain bg-black"
//       >
//         {mediaId && type && accountId && (
//           <WatchProgressHandler
//             accountId={accountId}
//             mediaId={mediaId}
//             type={type}
//             videoRef={videoRef}
//             onAutoSkipIntro={() => setCanShowSkipIntro(false)}
//           />
//         )}
//         Your browser does not support HLS playback.
//       </video>

//       {hovering && showControls && canShowSkipIntro && (
//         <button
//           onClick={() => {
//             if (videoRef.current) videoRef.current.currentTime = 60;
//             if (onSkipIntro) onSkipIntro();
//           }}
//           className="absolute top-20 right-10 bg-white/20 text-white px-4 py-1 rounded hover:bg-white/30 z-30"
//         >
//           ⏭ Skip Intro
//         </button>
//       )}

//       {showCountdown && (
//         <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-md z-30">
//           <p>Next episode in {countdown}s...</p>
//           <button
//             onClick={() => {
//               setShowCountdown(false);
//               goToEpisode(nextEpisodeId);
//             }}
//             className="underline mt-1 text-sm transition-opacity duration-500 ease-in-out"
//           >
//             Skip
//           </button>
//         </div>
//       )}

//       {hovering && (
//         <div className="absolute bottom-8 w-full flex justify-center gap-4 z-20">
//           {prevEpisodeId && (
//             <button
//               onClick={() => goToEpisode(prevEpisodeId)}
//               className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
//             >
//               <SkipBack size={18} /> Previous
//             </button>
//           )}
//           {nextEpisodeId && (
//             <button
//               onClick={() => goToEpisode(nextEpisodeId)}
//               className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
//             >
//               Next <SkipForward size={18} />
//             </button>
//           )}
//         </div>
//       )}

//       {awaitingPlay && (
//         <div
//           className="absolute inset-0 bg-black/80 flex items-center justify-center z-40 cursor-pointer"
//           onClick={() => {
//             videoRef.current.muted = false;
//             videoRef.current.play();
//             setAwaitingPlay(false);
//           }}
//         >
//           <p className="text-white text-xl bg-white/10 px-6 py-3 rounded">▶ Tap to Play</p>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { SkipBack, SkipForward } from "lucide-react";
import WatchProgressHandler from "@/components/WatchProgressHandler";

export default function EpisodePlayer({
  episode,
  poster,
  onSkipIntro,
  nextEpisodeId,
  prevEpisodeId,
}) {
  const { id } = useParams(); // from /watch/[type]/[mediaId]
 const type = id?.[0];
  const mediaId = id?.[1];
  const router = useRouter();
  const videoRef = useRef(null);
  const hideControlsTimeout = useRef(null);
  const episodeId = episode?._id;
  const [accountId, setAccountId] = useState(null);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [hovering, setHovering] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [canShowSkipIntro, setCanShowSkipIntro] = useState(true);
  const [awaitingPlay, setAwaitingPlay] = useState(false);
  const [resumeTime, setResumeTime] = useState(null);
  const [showResumeOverlay, setShowResumeOverlay] = useState(false);

  useEffect(() => {
    const acc = JSON.parse(sessionStorage.getItem("loggedInAccount"));
    if (acc?._id) setAccountId(acc._id);
  }, []);

 useEffect(() => {
  if (!type || !mediaId) {
    console.warn("🚨 Invalid URL. Missing type or mediaId.");
    router.push("/404");
  }
}, [type, mediaId]);

  useEffect(() => {
    setShowCountdown(false);
    setCountdown(5);
  }, [episodeId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !nextEpisodeId) return;

    const handleEnded = () => {
      setShowCountdown(true);
      let timer = 5;
      setCountdown(timer);

      const countdownInterval = setInterval(() => {
        timer--;
        setCountdown(timer);
        if (timer === 0) {
          clearInterval(countdownInterval);
          goToEpisode(nextEpisodeId);
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    };

    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [nextEpisodeId, episodeId]);

  useEffect(() => {
    if (!episode || !videoRef.current) return;

    const episodeHLS = typeof episode.HLS === "string" ? { master: episode.HLS } : episode.HLS || {};
    const url = episodeHLS.master || episode.transcodedVideo || episode.video_url_s3 || episode.trailerUrl;
    if (!url) return;

    const video = videoRef.current;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setTimeout(() => {
          video.play().catch((err) => {
            console.warn("⚠️ Autoplay blocked:", err);
            setAwaitingPlay(true);
          });
        }, 100);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data?.fatal) {
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
          else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          else hls.destroy();
        }
      });

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      video.play().catch((err) => console.warn("⚠️ Autoplay blocked:", err));
    }
  }, [episode]);

  // useEffect(() => {
  //   const fetchProgress = async () => {
  //     if (!videoRef.current || !episodeId || !accountId) return;
  //     try {
  //       const res = await fetch(`/api/watch-progress/get?accountId=${accountId}&mediaId=${episodeId}`);
  //       const data = await res.json();
  //       if (data.success && typeof data.data === "number" && data.data > 5) {
  //         videoRef.current.onloadedmetadata = () => {
  //           videoRef.current.currentTime = data.data;
  //         };
  //       }
  //     } catch (err) {
  //       console.error("⚠️ Failed to fetch resume progress:", err);
  //     }
  //   };
  //   fetchProgress();
  // }, [episodeId, accountId]);

  useEffect(() => {
    const handleInteraction = () => {
      setHovering(true);
      setShowControls(true);
      clearTimeout(hideControlsTimeout.current);
      hideControlsTimeout.current = setTimeout(() => {
        setHovering(false);
        setShowControls(false);
      }, 3000);
    };

    window.addEventListener("mousemove", handleInteraction);
    window.addEventListener("touchstart", handleInteraction);

    return () => {
      window.removeEventListener("mousemove", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      clearTimeout(hideControlsTimeout.current);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleTimeUpdate = () => {
      if (video.currentTime > 60) setCanShowSkipIntro(false);
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const goToEpisode = (id) => {
    if (id) router.push(`/watch/episode/${id}`);
  };

  if (!episode) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div>
          <p className="text-lg">🔄 Loading episode...</p>
          <p className="text-sm text-gray-400">Episode ID: {episodeId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black text-white">
      <video
        ref={videoRef}
        controls
        muted  // ✅ Add this to allow autoplay on Chrome
        playsInline 
        poster={poster || episode.thumbnail_url_s3}
        className="w-full h-full object-contain bg-black"
      >
        {mediaId && type && accountId && (
          <WatchProgressHandler
            accountId={accountId}
            mediaId={mediaId}
            type={type}
            videoRef={videoRef}
            onLoadProgress={(resumeTime) => {
              if (videoRef.current && resumeTime > 5) {
                videoRef.current.onloadedmetadata = () => {
                  videoRef.current.currentTime = resumeTime;
                }; 

      setResumeTime(timeInSeconds);
      setShowResumeOverlay(true);

      setTimeout(() => setShowResumeOverlay(false), 4000); 
              }
            }}
            onAutoSkipIntro={() => setCanShowSkipIntro(false)}
          />
        )}
        Your browser does not support HLS playback.
      </video>

      {hovering && showControls && canShowSkipIntro && (
        <button
          onClick={() => {
            if (videoRef.current) videoRef.current.currentTime = 60;
            if (onSkipIntro) onSkipIntro();
          }}
          className="absolute top-20 right-10 bg-white/20 text-white px-4 py-1 rounded hover:bg-white/30 z-30"
        >
          ⏭ Skip Intro
        </button>
      )}

      {showCountdown && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded shadow-md z-30">
          <p>Next episode in {countdown}s...</p>
          <button
            onClick={() => {
              setShowCountdown(false);
              goToEpisode(nextEpisodeId);
            }}
            className="underline mt-1 text-sm"
          >
            Skip
          </button>
        </div>
      )}

      {hovering && (
        <div className="absolute bottom-8 w-full flex justify-center gap-4 z-20">
          {prevEpisodeId && (
            <button
              onClick={() => goToEpisode(prevEpisodeId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              <SkipBack size={18} /> Previous
            </button>
          )}
          {nextEpisodeId && (
            <button
              onClick={() => goToEpisode(nextEpisodeId)}
              className="flex items-center gap-1 bg-white/10 px-4 py-2 rounded hover:bg-white/20"
            >
              Next <SkipForward size={18} />
            </button>
          )}
        </div>
      )}

      {awaitingPlay && (
        <div
          className="absolute inset-0 bg-black/80 flex items-center justify-center z-40 cursor-pointer"
          onClick={() => {
            videoRef.current.muted = false;
            videoRef.current.play();
            setAwaitingPlay(false);
          }}
        >
          <p className="text-white text-xl bg-white/10 px-6 py-3 rounded">▶ Tap to Play</p>
        </div>
      )}
      {showResumeOverlay && resumeTime !== null && (
  <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-2 rounded-lg shadow-lg text-sm z-50">
    ⏪ Resuming from {Math.floor(resumeTime / 60)}m {Math.floor(resumeTime % 60)}s
  </div>
)}
    </div>
  );
}
