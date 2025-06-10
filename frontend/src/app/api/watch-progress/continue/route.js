import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

async function fetchThumbnailFor(mediaType, mediaId, db) {
  let collectionName = null;

  if (mediaType === "movie") collectionName = "movies";
  else if (mediaType === "tv") collectionName = "tvshows";
  else if (mediaType === "episode") collectionName = "episodes";

  if (!collectionName) return null;

  const media = await db.collection(collectionName).findOne({ _id: mediaId });

  return (
    media?.thumbnail_url_s3 ||
    media?.posterUrl ||
    media?.thumbnailUrl ||
    media?.thumbnail_url ||
    null
  );
}

export async function GET(req) {
  const accountId = new URL(req.url).searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ success: false, message: "Missing accountId" }, { status: 400 });
  }

  try {
    const db = (await clientPromise).db();
    const list = await db
      .collection("watchProgress")
      .find({ accountId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .toArray();

    const withThumbnails = await Promise.all(
      list.map(async (item) => {
        const thumb = await fetchThumbnailFor(item.mediaType, item.mediaId, db);
        return {
          ...item,
          thumbnail_url_s3: thumb,
        };
      })
    );

    return NextResponse.json({ success: true, data: withThumbnails });
  } catch (error) {
    console.error("Continue Watching error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}