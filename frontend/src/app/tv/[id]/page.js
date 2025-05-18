"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { PlusIcon, CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { getAllfavorites } from "@/utils";

export default function TVShowDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tvShow, setTvShow] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(0);
  const {
    setFavorites,
    loggedInAccount,
    setShowDetailsPopup,
    setCurrentMediaInfoIdAndType,
    favorites,
  } = useContext(GlobalContext);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchTvShow() {
      try {
        const res = await axios.get(`http://localhost:7001/api/v1/tvShows/${id}`);
        const favoriteIds = favorites.map((fav) => fav.movieID);

        // Mark favorites
        res.data.seasons.forEach((season) => {
          season.episodes = season.episodes.map((ep) => ({
            ...ep,
            addedToFavorites: favoriteIds.includes(ep._id),
          }));
        });

        setTvShow(res.data);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
      }
    }
    if (id) fetchTvShow();
  }, [id, favorites]);

  const handleAddToFavorites = async (episode) => {
    const res = await fetch("/api/favorites/add-favorite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        backdrop_path: episode.thumbnail_url_s3 || episode.thumbnail_url,
        poster_path: episode.thumbnail_url_s3 || episode.thumbnail_url,
        movieID: episode._id,
        type: "episode",
        uid: user?.id,
        accountID: loggedInAccount?._id,
      }),
    });

    const data = await res.json();
    if (data.success) {
      const favs = await getAllfavorites(user?.id, loggedInAccount?._id);
      setFavorites(
        favs.map((item) => ({ ...item, addedToFavorites: true }))
      );
    }
  };

  if (!tvShow) return <div className="text-white p-4">Loading...</div>;

  const currentSeason = tvShow.seasons?.[selectedSeason];
  const firstEpisode = currentSeason?.episodes?.[0];
  const trailerImage =
    firstEpisode?.thumbnail_url_s3 ||
    firstEpisode?.thumbnail_url ||
    "/images/fallback.jpg";

  return (
    <div className="p-4 space-y-6 text-white">
      <div className="relative w-full h-[60vh] rounded overflow-hidden shadow-lg">
        <Image
          src={trailerImage}
          alt="TV Show Banner"
          fill
          className="object-cover rounded"
        />
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-2">{tvShow.title}</h1>
        <p className="text-gray-300 max-w-3xl whitespace-pre-line">
          {tvShow.description}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="season-select" className="text-lg font-semibold">
          Select Season:
        </label>
        <select
          id="season-select"
          className="bg-black border border-white rounded px-2 py-1"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(parseInt(e.target.value))}
        >
          {tvShow.seasons?.map((season, index) => (
            <option key={season._id} value={index}>
              Season {season.number || index + 1}
            </option>
          ))}
        </select>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentSeason?.episodes?.map((episode) => (
          <div
            key={episode._id}
            className="bg-zinc-800 group rounded overflow-hidden shadow hover:shadow-xl transition relative"
          >
            <div className="relative h-48 w-full cursor-pointer">
              <Image
                src={
                  episode.thumbnail_url_s3 ||
                  episode.thumbnail_url ||
                  "/images/fallback.jpg"
                }
                alt={episode.title}
                fill
                className="object-cover"
                onClick={() => router.push(`/watch/episode/${episode._id}`)}
              />
              <div className="absolute bottom-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() =>
                    episode.addedToFavorites
                      ? null
                      : handleAddToFavorites(episode)
                  }
                  className={`$${
                    episode.addedToFavorites ? "cursor-not-allowed" : ""
                  } border p-1 rounded-full bg-black bg-opacity-70`}
                >
                  {episode.addedToFavorites ? (
                    <CheckIcon className="h-6 w-6 text-white" />
                  ) : (
                    <PlusIcon className="h-6 w-6 text-white" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDetailsPopup(true);
                    setCurrentMediaInfoIdAndType({
                      type: "episode",
                      id: episode._id,
                    });
                  }}
                  className="p-1 border rounded-full bg-black bg-opacity-70"
                >
                  <ChevronDownIcon className="h-6 w-6 text-white" />
                </button>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h2 className="text-lg font-bold line-clamp-1">{episode.title}</h2>
              <p className="text-sm text-gray-400 line-clamp-2">{episode.description}</p>
              <p className="text-xs text-gray-500">
                Duration: {Math.ceil(episode.duration / 60)} mins
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
