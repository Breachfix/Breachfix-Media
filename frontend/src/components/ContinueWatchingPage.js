"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { getContinueWatchingItems } from "@/utils/watchProgressAPI";
import Navbar from "@/components/navbar";
import CircleLoader from "@/components/circle-loader";
import { useAuth } from "@/context/AuthContext";
import { GlobalContext } from "@/context";
import Link from "next/link";

function formatWatchTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

export default function ContinueWatchingPage({ uid, accountId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const { loggedInAccount } = useContext(GlobalContext);

  useEffect(() => {
    if (!uid || !accountId) return;

    const fetchItems = async () => {
      try {
        const data = await getContinueWatchingItems(uid, accountId);
        setItems(data || []);
      } catch (err) {
        console.error("Error fetching continue watching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [uid, accountId]);

  // Redirect unauthorized users
  if (!user || !loggedInAccount) {
    router.push("/auth/login");
    return null;
  }

  if (loading) return <CircleLoader />;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white px-4 md:px-12 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Continue Watching</h1>
        <div className="flex justify-center mb-6 space-x-4">
  <button
    onClick={() => setItems((prev) => prev.filter(i => i.mediaType === 'movie'))}
    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
  >
    Movies
  </button>
  <button
    onClick={() => setItems((prev) => prev.filter(i => i.mediaType === 'tv'))}
    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
  >
    TV Shows
  </button>
  <button
    onClick={() => window.location.reload()}
    className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300"
  >
    All
  </button>
</div>

        {items.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            You haven’t started watching anything yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item) => (
              <div
                key={`${item.mediaId}-${item.accountId}-${item.mediaType}`}
                className="bg-zinc-900 bg-opacity-80 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={item.thumbnail || "/fallback.jpg"}
                  onError={(e) => (e.currentTarget.src = "/fallback.jpg")}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-3">
                  <h2 className="text-base font-semibold truncate">{item.title}</h2>
                  <p className="text-sm text-gray-400">
                    {formatWatchTime(item.progressInSeconds)} watched
                  </p>
                  <Link
                    href={`/watch/${item.mediaType}/${item.mediaId}`}
                    className="mt-2 inline-block text-blue-400 underline text-sm"
                  >
                    Resume
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}