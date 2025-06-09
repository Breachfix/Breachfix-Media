// app/api/watch-progress/account/[accountId]/page/[page]/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req, { params }) {
  const { accountId, page } = params;
  const pageNumber = parseInt(page || "1", 10);
  const limit = 10;
  const skip = (pageNumber - 1) * limit;

  try {
    const db = (await clientPromise).db();
    const items = await db
      .collection("watchProgress")
      .find({ accountId })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Continue watching fetch error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}