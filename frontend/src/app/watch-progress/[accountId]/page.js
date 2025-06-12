"use client";

import { useEffect, useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContinueWatchingItems } from "@/utils/watchProgressAPI";
import Navbar from "@/components/navbar";
import CircleLoader from "@/components/circle-loader";
import MediaItem from "@/components/media-item";
import { GlobalContext } from "@/context";
import { fetchWatchContent } from "@/utils";  // ✅ ADD THIS LINE

function formatWatchTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

export default function ContinueWatchingPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredItems, setFilteredItems] = useState([]);
  const { accountId } = useParams();
  const router = useRouter();

  const { setCurrentMediaInfoIdAndType, setShowDetailsPopup } = useContext(GlobalContext);

  useEffect(() => {
    if (!accountId) {
      router.push("/auth/login");
      return;
    }

const fetchItems = async () => {
  try {
    const data = await getContinueWatchingItems(accountId);
    const enriched = await Promise.all(data.map(async (item) => {
      const type = item.mediaType === "tv" ? "episode" : item.mediaType;
      const id = item.mediaId || item._id || item.id;

      try {
        const fullContent = await fetchWatchContent(type, id);
        return {
          ...fullContent,  // inject full media data
          progressInSeconds: item.progressInSeconds || 0,
        };
      } catch (fetchErr) {
        console.error(`❌ Failed to enrich ${id}:`, fetchErr);
        return null; // gracefully handle errors
      }
    }));

    const validItems = enriched.filter((item) => item !== null);
    setItems(validItems);
    setFilteredItems(validItems);
  } catch (err) {
    console.error("❌ Error fetching items:", err);
  } finally {
    setLoading(false);
  }
};

    fetchItems();
  }, [accountId]);

  const filter = (type) => {
    if (type === "all") return setFilteredItems(items);
    setFilteredItems(items.filter((i) => i.type === type));
  };

  if (loading) return <CircleLoader />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white px-4 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Continue Watching</h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button onClick={() => filter("movie")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">Movies</button>
          <button onClick={() => filter("episode")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">Episodes</button>
          <button onClick={() => filter("all")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">All</button>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            You haven’t started watching anything yet.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-5 gap-3 items-center scrollbar-hide md:p-2">
            {filteredItems.map((item) => (
              <div key={`${item.id}-${accountId}`}>
                <MediaItem 
                  media={item} 
                  listView 
                  onClick={() => {
                    setCurrentMediaInfoIdAndType({ type: item.type, id: item.id });
                    setShowDetailsPopup(true);
                  }}
                />
                <p className="text-sm text-gray-400 mt-2">
                  {formatWatchTime(item.progressInSeconds)} watched
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}