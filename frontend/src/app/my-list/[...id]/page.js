"use client";

import { GlobalContext } from "@/context";
import { getAllfavorites, getSimilarMedia } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import MediaItem from "@/components/media-item";
import CircleLoader from "@/components/circle-loader";
import UnauthPage from "@/components/unauth-page";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import ManageAccounts from "@mui/icons-material/ManageAccounts";

export default function MyList() {
  const _params = useParams();

  const {
    favorites,
    setFavorites,
    pageLoader,
    setPageLoader,
    loggedInAccount,
    setCurrentMediaInfoIdAndType,
    setShowDetailsPopup,
    similarMedias,
    setSimilarMedias,
  } = useContext(GlobalContext);

  const { user } = useAuth();

  useEffect(() => {
    async function extractFavorites() {
      if (!user?.id || !loggedInAccount?._id) return;
      setPageLoader(true);

      try {
        const data = await getAllfavorites(user.id, loggedInAccount._id);
        console.log("📦 Favorites data:", data);

        if (Array.isArray(data)) {
          setFavorites(
            data.map((item) => ({
              ...item,
              movieID: typeof item.movieID === "object" && item.movieID?.$oid
                ? item.movieID.$oid
                : item.movieID,
              addedToFavorites: true,
            }))
          );
        } else {
          console.warn("⚠️ Unexpected favorites response:", data);
        }
      } catch (err) {
        console.error("❌ Error fetching favorites:", err);
      } finally {
        setPageLoader(false);
      }
    }

    extractFavorites();
  }, [loggedInAccount, user]);

  useEffect(() => {
    async function loadSimilarFromFavorites() {
      if (!favorites || favorites.length === 0) return;

      const allSimilar = [];

      for (const fav of favorites) {
        const id = fav.movieID || fav.id || fav._id;
        const type =
          fav.type ||
          (fav.seasons ? "tv" : fav.episodeNumber ? "episode" : "movie");

        if (!id || !type) {
          console.warn("⛔ Skipping invalid favorite", fav);
          continue;
        }

        try {
          const similar = await getSimilarMedia(type, id);
          if (Array.isArray(similar)) {
            allSimilar.push(...similar);
          } else {
            console.warn(`⚠️ getSimilarMedia(${type}, ${id}) returned unexpected result`, similar);
          }
        } catch (err) {
          console.warn("Error loading similar for", id, err);
        }
      }

      // Deduplicate
      const seen = new Set();
      const unique = allSimilar.filter((m) => {
        const mediaId = m.id || m._id || m.movieID;
        if (!mediaId || seen.has(mediaId)) return false;
        seen.add(mediaId);
        return true;
      });

      setSimilarMedias(unique);
    }

    loadSimilarFromFavorites();
  }, [favorites]);

  if (!user) return <UnauthPage />;
  if (!loggedInAccount) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <RequireAuth>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Navbar />
        <div className="mt-[100px] space-y-0.5 md:space-y-2 px-4">
          <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
            My List
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-2">
            {favorites && favorites.length > 0 ? (
              favorites.map((item, index) => (
                <MediaItem
                  key={`${item.movieID || "media"}-${index}`}
                  media={item}
                  listView={true}
                  onClick={() => {
                    const id = item.movieID || item.id || item._id;
                    const type =
                      item.type ||
                      (item.seasons ? "tv" : item.episodeNumber ? "episode" : "movie");

                    setCurrentMediaInfoIdAndType({ id, type });
                    setShowDetailsPopup(true);
                  }}
                />
              ))
            ) : (
              <p className="text-white col-span-full text-center">
                No favorites added yet.
              </p>
            )}
          </div>
        </div>

        {similarMedias && similarMedias.length > 0 && (
          <div className="mt-12 space-y-0.5 md:space-y-2 px-4">
            <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition-colors duration-200 hover:text-white md:text-2xl">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
              {similarMedias.map((item, index) => (
                <MediaItem
                  key={`${item.id || item._id || "similar"}-${index}`}
                  media={item}
                  listView={false}
                  similarMovieView
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </RequireAuth>
  );
}