"use client";

import { useEffect, useContext } from "react";
import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import UnauthPage from "@/components/unauth-page";
import RequireAuth from "@/components/RequireAuth";
import ManageAccounts from "@mui/icons-material/ManageAccounts";

import {
  getTrendingMedias,
  getPopularMedias,
  getTopratedMedias,
} from "@/utils";
import { getAllfavorites } from "@/utils/accountAPI";
import { getContinueWatchingItems } from "@/utils/watchProgressAPI";

export default function Browse() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);
  const { user } = useAuth();

  // Utility to shuffle array
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    async function getAllMedias() {
      const [trendingTvShows, trendingMovies, continueWatchingItems, allFavorites] = await Promise.all([
        getTrendingMedias("tv"),
        getTrendingMedias("movie"),
        getContinueWatchingItems(user?.id, loggedInAccount?._id),
        getAllfavorites(user?.id, loggedInAccount?._id),
      ]);

      const sections = [];

      // ✅ Continue Watching First
      if (continueWatchingItems?.length > 0) {
        sections.push({
          title: "Continue Watching",
          medias: continueWatchingItems.map((item) => ({
            ...item,
            type: item.type || "movie",
            addedToFavorites: allFavorites?.some((fav) => fav.movieID === item.mediaId),
          })),
        });
      }

      // 🟦 Build Mixed Content Layers with Sorting Variants
      const mixedLayers = [
        {
          title: "Trending Movies",
          medias: trendingMovies,
          type: "movie",
          sort: (arr) => arr, // no sort
        },
        {
          title: "Trending TV Shows",
          medias: trendingTvShows,
          type: "tv",
          sort: (arr) => arr,
        },
        {
          title: "Popular Movies",
          medias: trendingMovies,
          type: "movie",
          sort: (arr) => [...arr].reverse(),
        },
        {
          title: "Popular TV Shows",
          medias: trendingTvShows,
          type: "tv",
          sort: (arr) => [...arr].reverse(),
        },
        
        {
          title: "Top Rated Movies",
          medias: trendingMovies,
          type: "movie",
          sort: shuffle,
        },
        
        
        {
          title: "Top Rated TV Shows",
          medias: trendingTvShows,
          type: "tv",
          sort: shuffle,
        },
      ];

      // 🔁 Process each layer and assign favorites
      for (const layer of mixedLayers) {
        const sortedMedias = layer.sort(layer.medias).map((media) => ({
          ...media,
          type: layer.type,
          addedToFavorites: allFavorites?.some((fav) => fav.movieID === media.id),
        }));
        sections.push({ title: layer.title, medias: sortedMedias });
      }

      setMediaData(sections);
      setPageLoader(false);
    }

    if (user?.id && loggedInAccount?._id) {
      getAllMedias();
    }
  }, [user?.id, loggedInAccount?._id]);

  if (!user) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <RequireAuth>
      <main className="flex min-h-screen flex-col">
        <CommonLayout mediaData={mediaData} />
      </main>
    </RequireAuth>
  );
}