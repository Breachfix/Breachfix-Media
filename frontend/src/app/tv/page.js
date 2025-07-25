"use client";

import CircleLoader from "@/components/circle-loader";
import CommonLayout from "@/components/common-layout";
import UnauthPage from "@/components/unauth-page";
import { GlobalContext } from "@/context";
import { getAllfavorites, getTVorMoviesByGenre } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useContext, useEffect } from "react";
import RequireAuth from "@/components/RequireAuth";

export default function TV() {
  const { user } = useAuth();
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getAllMedias() {
      try {
        const genres = [
          "Prophecy", "Bible", "Faith", "Healing", "Family", "Creation",
          "EndTime", "Truth", "Witness", "Health", "Discipleship",
          "Testimony", "Sabbath", "Hope", "Love",
        ];

        const allFavorites = await getAllfavorites(user?.id, loggedInAccount?._id);
        const favoriteIds = new Set(
          (Array.isArray(allFavorites) ? allFavorites : []).map(fav => fav.movieID)
        );

        const mediaRows = await Promise.allSettled(
          genres.map(async (genre) => {
            const medias = await getTVorMoviesByGenre("tv", genre);

            return {
              title: genre,
              medias: Array.isArray(medias)
                ? medias.map(mediaItem => {
                    const id = mediaItem.id || mediaItem._id;
                    return {
                      ...mediaItem,
                      type: "tv",
                      addedToFavorites: favoriteIds.has(id),
                    };
                  })
                : [],
            };
          })
        );

        const validMediaRows = mediaRows
          .filter(result => result.status === "fulfilled")
          .map(result => result.value);

        setMediaData(validMediaRows);
        setPageLoader(false);
      } catch (error) {
        console.error("❌ Error fetching TV media data:", error);
        setMediaData([]);
        setPageLoader(false);
      }
    }

    getAllMedias();
  }, [loggedInAccount, user]);

  if (user === null) return <UnauthPage />;
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