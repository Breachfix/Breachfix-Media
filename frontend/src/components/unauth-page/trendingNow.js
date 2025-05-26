"use client";

import { useEffect, useState, useRef } from "react";
import { getTrendingMedias } from "@/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function TrendingNow() {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    async function fetchTrending() {
      try {
        const trending = await getTrendingMedias("movie");

        const formatted = trending?.slice(0, 10).map((item, i) => ({
          id: item.id,
          title: item.title || item.name || "Untitled",
          image: item.thumbnailUrl || "/images/placeholder.jpg",
        }));

        setItems(formatted);
      } catch (error) {
        console.error("\u274C Failed to fetch trending media:", error);
      }
    }

    fetchTrending();
  }, []);

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="bg-black text-white py-12 px-4 sm:px-10 relative">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Trending Now</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full z-30 hidden sm:block hover:bg-black/80"
        >
          <ChevronLeftIcon className="h-6 w-6 text-white" />
        </button>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pr-6"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative min-w-[120px] sm:min-w-[160px] rounded-xl overflow-hidden group"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-190 h-90% sm:h-90% object-cover rounded-lg transition-transform group-hover:scale-105"
              />

              {/* Fade overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent rounded-lg" />

              {/* Netflix-style Ranking Number */}
              <div className="absolute -left-3 bottom-3 sm:bottom-4 sm:-left-0 z-40 text-white font-extrabold text-4xl sm:text-5xl">
                <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)] stroke-white stroke-[4]">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/60 p-2 rounded-full z-30 hidden sm:block hover:bg-black/80"
        >
          <ChevronRightIcon className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-black/90 to-transparent" />
    </section>
  );
}