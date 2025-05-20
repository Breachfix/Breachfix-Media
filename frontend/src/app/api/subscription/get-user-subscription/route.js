// File: /app/api/subscription/get-user-subscription/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // use import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";

export async function GET(req) {
  try {
    await dbConnect();

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing user ID" }, { status: 400 });
    }

    const subscription = await MediaSubscription.findOne({ userId });

    if (!subscription || !subscription.planName) {
      return NextResponse.json({ success: false, message: "No subscription found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      planName: subscription.planName,
    });
  } catch (err) {
    console.error("❌ Subscription fetch error:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}