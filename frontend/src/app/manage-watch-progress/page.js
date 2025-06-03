"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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

      try {
        const res = await fetch(`/api/watch-progress/get-all?uid=${uid}`);
        const data = await res.json();
        if (data.success) {
          setWatchProgress(data.data);
        } else {
          console.warn("⚠️ No watch progress found");
        }
      } catch (err) {
        console.error("❌ Failed to fetch watch progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user?.id]);

  if (loading) return <CircleLoader />;

  return (
    <AuthBackground>
      <div className="min-h-screen px-6 py-12 text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Watch Progress</h1>

        {watchProgress.length === 0 ? (
          <p className="text-center">No in-progress content found.</p>
        ) : (
          <ul className="space-y-6">
            {watchProgress.map((item) => (
              <li key={item._id} className="bg-black bg-opacity-60 p-4 rounded-md shadow-md">
                <p><strong>Title:</strong> {item.title}</p>
                <p><strong>Type:</strong> {item.mediaType}</p>
                <p><strong>Last Watched:</strong> {new Date(item.updatedAt).toLocaleString()}</p>
                <p><strong>Progress:</strong> {item.progressTime ? `${item.progressTime}s` : "Not available"}</p>
                <p><strong>Resume From:</strong> {item.resumeUrl || "Unavailable"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AuthBackground>
  );
}
