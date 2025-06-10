"use client";

import { useEffect, useContext } from "react";
import { GlobalContext } from "@/context";
import { useAuth } from "@/context/AuthContext";
import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import UnauthPage from "@/components/unauth-page";
import RequireAuth from "@/components/RequireAuth";
import ManageAccounts from "@mui/icons-material/ManageAccounts";
import MediaRow from "@/components/media-row";

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
    favorites,
    setFavorites,
    setCurrentMediaInfoIdAndType,
    setShowDetailsPopup,
  } = useContext(GlobalContext);

  const { user } = useAuth();

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    async function getAllMedias() {
      const [
        trendingTvShows,
        trendingMovies,
        continueWatchingItems,
        allFavorites,
      ] = await Promise.all([
        getTrendingMedias("tv"),
        getTrendingMedias("movie"),
        getContinueWatchingItems(user?.id, loggedInAccount?._id),
        getAllfavorites(user?.id, loggedInAccount?._id),
      ]);

      setFavorites(
        allFavorites.map((item) => ({
          ...item,
          movieID:
            typeof item.movieID === "object" && item.movieID?.$oid
              ? item.movieID.$oid
              : item.movieID,
          addedToFavorites: true,
        }))
      );

      const sections = [];

      if (continueWatchingItems?.length > 0) {
        const formattedContinue = continueWatchingItems.map((item) => ({
          ...item,
          id: item.mediaId || item._id || item.id,
          type: item.type || "movie",
          addedToFavorites: allFavorites?.some(
            (fav) => fav.movieID === item.mediaId
          ),
          onClick: () => {
            const id = item.mediaId || item.id || item._id;
            const type = item.type || "movie";
            setCurrentMediaInfoIdAndType({ id, type });
            setShowDetailsPopup(true);
          },
        }));

        sections.push({
          title: "Continue Watching",
          medias: formattedContinue,
        });
      }

      if (allFavorites?.length > 0) {
        const formattedFavorites = allFavorites.map((item) => {
          const id = item.movieID || item.id || item._id;
          const type =
            item.type ||
            (item.seasons ? "tv" : item.episodeNumber ? "episode" : "movie");

          return {
            ...item,
            id,
            type,
            addedToFavorites: true,
            onClick: async () => {
              try {
                await fetch(`/api/favorites/remove-favorite?id=${item._id}`, {
                  method: "DELETE",
                });

                setFavorites((prev) =>
                  prev.filter((fav) => fav.movieID !== id && fav._id !== id)
                );
              } catch (err) {
                console.error("❌ Failed to remove favorite:", err);
              }
            },
          };
        });

        sections.push({
          title: "My List",
          medias: formattedFavorites,
        });
      }

      const mixedLayers = [
        {
          title: "Trending Movies",
          medias: trendingMovies,
          type: "movie",
          sort: (arr) => arr,
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

      for (const layer of mixedLayers) {
        const sorted = layer.sort(layer.medias).map((media) => ({
          ...media,
          type: layer.type,
          addedToFavorites: allFavorites?.some(
            (fav) => fav.movieID === media.id
          ),
        }));
        sections.push({ title: layer.title, medias: sorted });
      }

      setMediaData(sections);
      setPageLoader(false);
    }

    if (user?.id && loggedInAccount?._id) {
      setPageLoader(true);
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
