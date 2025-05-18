"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AiFillPlayCircle } from "react-icons/ai";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { fetchHeroContent } from "@/utils";

export default function Banner() {
  const [media, setMedia] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchHero = async () => {
      try {
        console.log("📡 Fetching hero content...");
        const data = await fetchHeroContent();
        console.log("✅ Received hero media:", data);
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
    : "/fallback.jpg";

  return (
    <section className="relative w-screen h-screen overflow-hidden">
      {/* Fullscreen Background Image */}
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
      <div className="relative z-10 h-full flex flex-col justify-end px-4 md:px-12 pb-20 text-white">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-md max-w-5xl">
          {media.title || media.name || media.original_name}
        </h1>

        {showDescription && (
          <p className="bg-black/60 p-4 rounded-md max-w-3xl text-sm md:text-base lg:text-lg mb-4">
            {media.description || "No description provided."}
          </p>
        )}

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => {
              const path = `/watch/${media.type}/${media.id}`;
              console.log("▶️ Navigating to:", path);
              router.push(path);
            }}
            className="flex items-center gap-2 bg-white text-black font-semibold rounded px-6 py-2 text-sm md:text-lg hover:opacity-90 transition"
          >
            <AiFillPlayCircle className="w-5 h-5 md:w-7 md:h-7" />
            Play
          </button>

          <button
            onClick={() => setShowDescription((prev) => !prev)}
            className="flex items-center gap-2 bg-white/30 text-white font-semibold rounded px-6 py-2 text-sm md:text-lg hover:bg-white/40 transition"
          >
            <IoMdInformationCircleOutline className="w-5 h-5 md:w-7 md:h-7" />
            {showDescription ? "Hide Info" : "More Info"}
          </button>
        </div>
      </div>
    </section>
  );
}