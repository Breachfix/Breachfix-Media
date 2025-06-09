import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { accountId, mediaId, type, progressInSeconds } = await req.json();
    console.log("📥 Received watch progress:", { accountId, mediaId, type, progressInSeconds });

    if (!accountId || !mediaId || progressInSeconds === undefined) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const db = (await clientPromise).db();
    const result = await db.collection("watchProgress").updateOne(
      { accountId, mediaId },
      {
        $set: {
          progressInSeconds,
          updatedAt: new Date(),
          mediaType: type,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Save progress error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}