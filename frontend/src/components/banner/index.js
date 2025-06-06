"use client";

import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillPlayCircle } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { fetchHeroContent } from "@/utils";
import { GlobalContext } from "@/context";
import DetailsPopup from "@/components/details-popup";

export default function Banner() {
  const [media, setMedia] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();
  const { setCurrentMediaInfoIdAndType } = useContext(GlobalContext);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await fetchHeroContent(); // already includes normalized type
        setMedia(data);
      } catch (err) {
        console.error("❌ Error fetching hero content:", err);
      }
    };

    fetchHero();
  }, []);

  if (!media) return null;

  const thumbnailToUse = media.thumbnail?.startsWith("http")
    ? media.thumbnail
    : media.thumbnail_url_s3?.startsWith("http")
    ? media.thumbnail_url_s3
    : "/fallback.jpg";

  const handlePlay = () => {
    const { type, id } = media;
    if (!type || !id) return;

    let path = "";
    if (type === "movie") path = `/watch/movie/${id}`;
    else if (type === "episode") path = `/watch/episode/${id}`;
    else if (type === "tv") path = `/tv/${id}`;
    router.push(path);
  };

  const handleMoreInfo = () => {
    if (media?.type && media?.id) {
      setCurrentMediaInfoIdAndType({ type: media.type, id: media.id });
      setShowPopup(true);
    }
  };

  return (
    <>
      {showPopup && (
        <DetailsPopup show={showPopup} setShow={setShowPopup} />
      )}

      <section className="relative w-full min-h-[45vh] max-h-[100vh] md:h-[60vh] lg:h-[50vh]">
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={thumbnailToUse}
            alt="Hero Banner"
            fill
            priority
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute -bottom-8 left-0 right-0 z-20 px-4 md:px-12 pb-10 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2 max-w-5xl drop-shadow-md">
            {media.title || media.name || media.original_name}
          </h1>

          <div className="flex flex-wrap gap-4 mt-2">
            <button
              onClick={handlePlay}
              className="flex items-center gap-2 bg-white text-black font-semibold rounded px-6 py-2 text-sm md:text-lg hover:opacity-90 transition"
            >
              <AiFillPlayCircle className="w-5 h-5 md:w-7 md:h-7" />
              Play
            </button>

            <button
              onClick={handleMoreInfo}
              className="flex items-center gap-2 bg-white/30 text-white font-semibold rounded px-6 py-2 text-sm md:text-lg hover:bg-white/40 transition"
            >
              <IoMdInformationCircleOutline className="w-5 h-5 md:w-7 md:h-7" />
              More Info
            </button>
          </div>
        </div>
      </section>
    </>
  );
}