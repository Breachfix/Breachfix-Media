import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uid = searchParams.get("uid");
  const accountId = searchParams.get("accountId");
  const mediaId = searchParams.get("mediaId");

  if (!uid || !accountId || !mediaId) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const progress = await db.collection("watchProgress").findOne({
      uid,
      accountId,
      mediaId,
    });

    if (!progress) {
      return NextResponse.json({ success: true, progressInSeconds: 0 });
    }

    return NextResponse.json({ success: true, progressInSeconds: progress.progressInSeconds });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}