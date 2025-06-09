"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getContinueWatchingItems } from "@/utils/watchProgressAPI";
import Navbar from "@/components/navbar";
import CircleLoader from "@/components/circle-loader";
import Link from "next/link";
import MediaItem from "@/components/media-item"; // Make sure this is imported

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

  useEffect(() => {
    if (!accountId) {
      router.push("/auth/login");
      return;
    }

    const fetchItems = async () => {
      try {
        console.log("📡 Fetching continue watching for accountId:", accountId);
        const data = await getContinueWatchingItems(accountId);
        console.log("🎬 Continue watching data:", data);

        // ✅ Normalize thumbnail field
        const normalizedData = (data || []).map(item => ({
          ...item,
          thumbnail_url_s3: item.thumbnail, // use for MediaItem fallback
        }));

        setItems(normalizedData);
        setFilteredItems(normalizedData);
      } catch (err) {
        console.error("❌ Error fetching continue watching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [accountId]);

  const filter = (type) => {
    if (type === "all") return setFilteredItems(items);
    setFilteredItems(items.filter((i) => i.mediaType === type));
  };

  if (loading) return <CircleLoader />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white px-4 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Continue Watching</h1>

        <div className="flex justify-center mb-6 space-x-4">
          <button onClick={() => filter("movie")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">
            Movies
          </button>
          <button onClick={() => filter("tv")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">
            TV Shows
          </button>
          <button onClick={() => filter("all")} className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300">
            All
          </button>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            You haven’t started watching anything yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredItems.map((item) => (
              <div key={`${item.mediaId}-${item.accountId}`}>
                <MediaItem media={item} listView />
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