// File: /src/app/api/stripe/update-subscription/route.js

import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, newPriceId } = body;

    if (!uid || !newPriceId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDB();
    const existing = await MediaSubscription.findOne({ uid });

    if (!existing || !existing.stripeSubscriptionId) {
      return NextResponse.json({ error: "Active subscription not found" }, { status: 404 });
    }

    // 🔄 Update subscription with new price
    const updated = await stripe.subscriptions.update(existing.stripeSubscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [{ id: existing.stripeItemId, price: newPriceId }],
    });

    // 💾 Update local DB with new plan info
    existing.planName = mapPriceIdToPlan(newPriceId);
    existing.status = updated.status;
    await existing.save();

    return NextResponse.json({ success: true, message: "Subscription updated successfully" });
  } catch (error) {
    console.error("❌ Subscription update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapPriceIdToPlan(priceId) {
  switch (priceId) {
    case process.env.Price_Free_Monthly:
    case process.env.Price_Free_Yearly:
      return "Basic";
    case process.env.Price_Basic_Monthly:
    case process.env.Price_Basic_Yearly:
      return "Standard";
    case process.env.Price_Premium_Monthly:
    case process.env.Price_Premium_Yearly:
      return "Premium";
    default:
      return "Unknown";
  }
}
