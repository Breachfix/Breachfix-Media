// File: /src/app/api/subscription/save-subscription/route.js

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; //use import connectToDB from "@/database";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      planName,
      billingCycle = "monthly",
      stripeCustomerId,
      stripeSubscriptionId,
      status = "active",
      startDate,
      endDate,
    } = body;

    if (!userId || !planName || !stripeCustomerId || !stripeSubscriptionId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("mediasubscriptions");

    const filter = { userId: new ObjectId(userId) };
    const update = {
      $set: {
        userId: new ObjectId(userId),
        planName,
        billingCycle,
        stripeCustomerId,
        stripeSubscriptionId,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        updatedAt: new Date(),
      },
      $setOnInsert: { createdAt: new Date() },
    };

    const result = await collection.updateOne(filter, update, { upsert: true });

    return NextResponse.json({ success: true, message: "Subscription saved", result });
  } catch (err) {
    console.error("❌ Error saving subscription:", err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
