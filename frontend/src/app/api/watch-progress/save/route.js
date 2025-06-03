import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, accountId, mediaId, progressInSeconds, type } = body;

    if (!uid || !accountId || !mediaId || progressInSeconds === undefined) {
      return NextResponse.json(
        { success: false, message: "Missing data" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("watchprogress").updateOne(
      { uid, accountId, mediaId },
      {
        $set: {
          progressInSeconds,
          updatedAt: new Date(),
          type,
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}