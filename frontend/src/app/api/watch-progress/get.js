import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const accountId = searchParams.get("accountId");
  const mediaId = searchParams.get("mediaId");

  if (!accountId || !mediaId) {
    return NextResponse.json(
      { success: false, message: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    const db = (await clientPromise).db();
    const progress = await db.collection("watchProgress").findOne({ accountId, mediaId });

    return NextResponse.json({
      success: true,
      progressInSeconds: progress?.progressInSeconds || 0,
    });
  } catch (error) {
    console.error("GET progress error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}