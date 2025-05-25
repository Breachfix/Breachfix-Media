"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllfavorites } from '@/utils/accountAPI';
import {
  getPopularMedias,
  getTopratedMedias,
  getTrendingMedias,
} from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import RequireAuth from "@/components/RequireAuth";


export default function Browse() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);

  const { user } = useAuth();


  useEffect(() => {
    async function getAllMedias() {
      const trendingTvShows = await getTrendingMedias("tv");
      const popularTvShows = await getPopularMedias("tv");
      const topratedTvShows = await getTopratedMedias("tv");

      const trendingMovieShows = await getTrendingMedias("movie");
      const popularMovieShows = await getPopularMedias("movie");
      const topratedMovieShows = await getTopratedMedias("movie");
      const allFavorites = await getAllfavorites(
        user?.id,
        loggedInAccount?._id
      );
      setMediaData([
        ...[
          {
            title: "Trending TV Shows",
            medias: trendingTvShows,
          },
          {
            title: "Popular TV Shows",
            medias: trendingMovieShows,
          },
          {
            title: "Top rated TV Shows",
            medias: trendingTvShows,
          },
        ].map((item) => ({
          ...item,
          medias: Array.isArray(item.medias)
  ? item.medias.map((mediaItem) => ({
      ...mediaItem,
      type: "tv",
      addedToFavorites:
        allFavorites && allFavorites.length
          ? allFavorites.map((fav) => fav.movieID).indexOf(mediaItem.id) > -1
          : false,
    }))
  : [],
        })),
        ...[
          {
            title: "Trending Movies",
            medias: trendingMovieShows,
          },
          {
            title: "Popular Movies",
            medias: trendingTvShows,
          },
          {
            title: "Top rated Movies",
            medias: trendingMovieShows,
          },
        ].map((item) => ({
          ...item,
          medias: Array.isArray(item.medias)
  ? item.medias.map((mediaItem) => ({
      ...mediaItem,
      type: "movie",
      addedToFavorites:
        allFavorites && allFavorites.length
          ? allFavorites.map((fav) => fav.movieID).indexOf(mediaItem.id) > -1
          : false,
    }))
  : [],
        })),
      ]);

      setPageLoader(false);
    }

    getAllMedias();
  }, [user?.id, loggedInAccount?._id]);

  if (!user) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  console.log(mediaData);

  return (
    <RequireAuth>
    <main className="flex min-h-screen flex-col">
      <CommonLayout mediaData={mediaData} />
    </main>
    </RequireAuth>
  );
}
