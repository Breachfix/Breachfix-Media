import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  const accountId = new URL(req.url).searchParams.get("accountId");
  if (!accountId) {
    return NextResponse.json({ success: false, message: "Missing accountId" }, { status: 400 });
  }

  try {
    const db = (await clientPromise).db();
    const items = await db.collection("watchProgress").find({ accountId }).toArray();
    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error("GET ALL progress error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}