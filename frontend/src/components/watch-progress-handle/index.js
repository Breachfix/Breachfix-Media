"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getAllWatchProgress } from "@/utils/watchProgressAPI";
import AuthBackground from "@/components/AuthBackground";
import CircleLoader from "@/components/circle-loader";

export default function WatchProgressManager() {
  const { user } = useAuth();
  const [watchProgress, setWatchProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const uid = user?.id || localStorage.getItem("userId");
      if (!uid) return;

      const data = await getAllWatchProgress(uid);

      if (Array.isArray(data)) {
        setWatchProgress(data);
      }

      setLoading(false);
    };

    fetchProgress();
  }, [user?.id]);

  if (loading) return <CircleLoader />;

  return (
    <AuthBackground>
      <div className="min-h-screen px-6 py-12 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Watch Progress</h1>

        {watchProgress.length === 0 ? (
          <p className="text-center text-gray-400">No in-progress content found.</p>
        ) : (
          <ul className="space-y-6">
            {watchProgress.map((item) => (
              <li
                key={item._id || `${item.mediaId}-${item.accountId}`}
                className="bg-black bg-opacity-60 p-4 rounded-md shadow-md"
              >
                <p><strong>Title:</strong> {item.title || "Unknown"}</p>
                <p><strong>Type:</strong> {item.mediaType || item.type}</p>
                <p><strong>Last Watched:</strong> {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : "Unknown"}</p>
                <p><strong>Progress:</strong> {item.progressInSeconds != null ? `${Math.floor(item.progressInSeconds)}s` : "Not available"}</p>
                <p><strong>Resume From:</strong> {item.videoUrl || "Unavailable"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthBackground>
  );
}