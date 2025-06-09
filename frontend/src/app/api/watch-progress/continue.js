import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const accountId = new URL(req.url).searchParams.get("accountId");

  if (!accountId) {
    return NextResponse.json({ success: false, message: "Missing accountId" }, { status: 400 });
  }

  try {
    const db = (await clientPromise).db();
    const list = await db.collection("watchProgress")
      .find({ accountId })
      .sort({ updatedAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("Continue Watching error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}