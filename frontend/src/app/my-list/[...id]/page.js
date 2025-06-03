// src/app/my-list/[...id]/page.js
"use client";

import { GlobalContext } from "@/context";
import { getAllfavorites } from "@/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar";
import MediaItem from "@/components/media-item";
import CircleLoader from "@/components/circle-loader";
import UnauthPage from "@/components/unauth-page";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";

export default function MyList() {

const _params = useParams();
  const {
    favorites,
    setFavorites,
    pageLoader,
    setPageLoader,
    loggedInAccount,
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
            data.map((item) => ({ ...item, addedToFavorites: true }))
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
        <div className="grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
          {favorites && favorites.length > 0 ? (
            favorites.map((item, index) => (
              <MediaItem
                key={`${item.mediaId || item.movieID || item._id || "media"}-${index}`}
                media={item}
                listView={true}
              />
            ))
          ) : (
            <p className="text-white col-span-5 text-center">
              No favorites added yet.
            </p>
          )}
        </div>
      </div>
    </motion.div>
    </RequireAuth>
  );
}
