"use client";

import { useEffect, useState, useContext } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/navbar";
import RequireAuth from "@/components/RequireAuth";
import { GlobalContext } from "@/context";
import MediaItem from "@/components/media-item";

export default function TVShowDetailPage() {
  const { id } = useParams();
  const [tvShow, setTvShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const { favorites } = useContext(GlobalContext);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_URL = `${API}/api/v1`;

  useEffect(() => {
    async function fetchTvShow() {
      try {
        const res = await fetch(`${API_URL}/tvShows/${id}`);
        const data = await res.json();

        const favoriteIds = favorites.map((fav) => fav.movieID || fav._id || fav.id);

        data.seasons.forEach((season) => {
          season.episodes = season.episodes.map((ep) => ({
            ...ep,
            type: "episode",
            addedToFavorites: favoriteIds.includes(ep._id || ep.id),
          }));
        });

        setTvShow(data);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      }
    }

    if (id) fetchTvShow();
  }, [id, favorites]);
  

  if (!tvShow) return <div className="text-white p-4">Loading...</div>;

  const currentSeason = tvShow.seasons?.[selectedSeason];
  const firstEpisode = currentSeason?.episodes?.[0] ?? {};
  const trailerImage =
    firstEpisode?.thumbnail_url_s3 ||
    firstEpisode?.thumbnail_url ||
    "/images/fallback.jpg";

  return (
    <RequireAuth>
      <div className="bg-black min-h-screen">
        <Navbar />

        {/* Banner */}
        <div className="relative w-full h-[70vh] md:h-[60vh] lg:h-[50vh]">
          <img
            src={trailerImage}
            alt={firstEpisode.title}
            className="object-cover object-center w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

          <div className="absolute bottom-10 left-4 md:left-10 z-20 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
              {currentSeason.title || firstEpisode.title}
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base line-clamp-3">
              {currentSeason.description || firstEpisode.description}
            </p>
          </div>
        </div>

        {/* Season Select */}
        <div className="text-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <label htmlFor="season-select" className="font-semibold text-sm">
              Select Season:
            </label>
            <select
              id="season-select"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
              className="bg-zinc-900 border border-white px-2 py-1 rounded"
            >
              {tvShow.seasons?.map((season, index) => (
                <option key={season._id} value={index}>
                  Season {season.number}
                </option>
              ))}
            </select>
          </div>

          {/* Episode Grid using MediaItem */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSeason?.episodes?.map((episode) => (
              <MediaItem
                key={episode._id || episode.id}
                media={episode}
                type="episode"
              />
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
