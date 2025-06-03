"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  AiFillPlayCircle,
  AiOutlinePlus,
  AiOutlineCheck,
  AiOutlineDown,
} from "react-icons/ai";
import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import { getAllfavorites } from "@/utils";
import Navbar from "@/components/navbar";
import RequireAuth from "@/components/RequireAuth";

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
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  const API_URL = `${API}/api/v1`;

  useEffect(() => {
    async function fetchTvShow() {
      try {
        const res = await fetch(`${API_URL}/tvShows/${id}`);
        const data = await res.json();
        const favoriteIds = favorites.map((fav) => fav.movieID);

        data.seasons.forEach((season) => {
          season.episodes = season.episodes.map((ep) => ({
            ...ep,
            type: "episode",
            addedToFavorites: favoriteIds.includes(ep._id),
          }));
        });

        setTvShow(data);
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
        movieID: episode._id,
        type: "episode",
        uid: user?.id,
        accountID: loggedInAccount?._id,
        title: episode.title,
        description: episode.description,
        thumbnail_url_s3: episode.thumbnail_url_s3 || episode.thumbnail_url,
        video_url_s3: episode.video_url_s3 || "",
      }),
    });

    const data = await res.json();
    if (data.success) {
      const favs = await getAllfavorites(user?.id, loggedInAccount?._id);
      setFavorites(favs.map((item) => ({ ...item, addedToFavorites: true })));
    }
  };

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
          <Image
            src={trailerImage}
            alt={tvShow.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

          <div className="absolute bottom-10 left-4 md:left-10 z-20 text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-2">
              {tvShow.title}
            </h1>
            <p className="text-gray-300 max-w-2xl text-sm md:text-base line-clamp-3">
              {tvShow.description}
            </p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => router.push(`/watch/episode/${firstEpisode._id}`)}
                className="flex items-center gap-2 bg-white text-black font-semibold rounded px-4 py-2 text-sm hover:opacity-90 transition"
              >
                <AiFillPlayCircle className="w-5 h-5" /> Play
              </button>
            </div>
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
                  Season {season.number || index + 1}
                </option>
              ))}
            </select>
          </div>

          {/* Episode Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentSeason?.episodes?.map((episode) => (
              <div
                key={episode._id}
                className="bg-zinc-900 rounded shadow hover:shadow-xl transition relative group"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={
                      episode.thumbnail_url_s3 ||
                      episode.thumbnail_url ||
                      "/images/fallback.jpg"
                    }
                    alt={episode.title}
                    fill
                    className="object-cover rounded-t"
                  />
                  <div className="absolute inset-0 flex justify-between items-center px-3 py-2 opacity-0 group-hover:opacity-100 bg-black/40 transition">
                    <button
                      onClick={() => router.push(`/watch/episode/${episode._id}`)}
                      className="bg-white text-black rounded-full p-1"
                    >
                      <AiFillPlayCircle className="h-6 w-6" />
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          episode.addedToFavorites ? null : handleAddToFavorites(episode)
                        }
                        className={`rounded-full p-1 ${
                          episode.addedToFavorites ? "cursor-not-allowed" : ""
                        } bg-white text-black`}
                      >
                        {episode.addedToFavorites ? (
                          <AiOutlineCheck className="h-6 w-6" />
                        ) : (
                          <AiOutlinePlus className="h-6 w-6" />
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
                        className="rounded-full p-1 bg-white text-black"
                      >
                        <AiOutlineDown className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-3">
                  <h2 className="text-md font-bold line-clamp-1">
                    S{selectedSeason + 1}:E{episode.episodeNumber || 1} - {episode.title}
                  </h2>
                  <p className="text-sm text-gray-400 line-clamp-2">{episode.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Duration: {Math.ceil(episode.duration / 60)} mins
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}