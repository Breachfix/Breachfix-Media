import clientPromise from "@/lib/mongodb";
import { fetchWatchContent } from '@/utils';

export const getWatchProgress = async (req) => {
  const uid = req.nextUrl.searchParams.get("uid");
  const accountId = req.nextUrl.searchParams.get("accountId");

  if (!uid || !accountId) {
    return {
      success: false,
      status: 400,
      message: 'Missing uid or accountId',
    };
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // optionally specify your DB name: client.db("your-db-name")
    const collection = db.collection("watchprogress");

    const records = await collection
      .find({ uid, accountId })
      .sort({ updatedAt: -1 })
      .toArray();

    const enriched = await Promise.all(
      records.map(async (record) => {
        try {
          const enrichedData = await fetchWatchContent(record.type, record.mediaId);
          return {
            ...record,
            title: enrichedData?.title || "Untitled",
            thumbnail: enrichedData?.thumbnailUrl || enrichedData?.posterUrl || "",
            duration: enrichedData?.duration || null,
            videoUrl: enrichedData?.videoUrl || "",
          };
        } catch (err) {
          console.error(`⚠️ Failed to enrich media ${record.mediaId}:`, err);
          return record; // fallback
        }
      })
    );

    return {
      success: true,
      status: 200,
      data: enriched,
    };
  } catch (err) {
    console.error("❌ Error fetching watch progress:", err);
    return {
      success: false,
      status: 500,
      message: "Internal Server Error",
    };
  }
};