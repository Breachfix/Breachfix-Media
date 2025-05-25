import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";
import { fetchUserByStripeCustomerId } from "@/utils/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, newPriceId } = body;

    if (!userId || !newPriceId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDB();

    // 🔍 Lookup user's current subscription in MongoDB
    const subscription = await MediaSubscription.findOne({ userId: userId.toString() });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json({
        success: false,
        message: "Active subscription not found for this user",
      }, { status: 404 });
    }

    // 🔐 Retrieve user for logging (optional)
    let user = null;
    try {
      user = await fetchUserByStripeCustomerId(subscription.stripeCustomerId);
    } catch (err) {
      console.warn("⚠️ Could not fetch user by Stripe customer ID:", err.message);
    }

    // 🔍 Get Stripe subscription to extract the item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0]?.id;

    if (!itemId) {
      return NextResponse.json({
        success: false,
        message: "Stripe subscription item ID not found",
      }, { status: 500 });
    }

    // 🔄 Update subscription price
    const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [{ id: itemId, price: newPriceId }],
    });

    // 💾 Save updated info to MongoDB
    subscription.planName = mapPriceIdToPlan(newPriceId);
    subscription.billingCycle = mapPriceIdToCycle(newPriceId);
    subscription.status = updated.status;
    await subscription.save();

    console.log(`✅ Subscription updated for user ${user?.email || userId}`);
    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
      updated,
    });
  } catch (error) {
    console.error("❌ Subscription update error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Unexpected error",
    }, { status: 500 });
  }
}

// 🔁 Helpers
function mapPriceIdToPlan(priceId) {
  switch (priceId) {
    case process.env.NEXT_PUBLIC_PRICE_FREE_MONTHLY:
    case process.env.NEXT_PUBLIC_PRICE_FREE_YEARLY:
      return "Basic";
    case process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY:
    case process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY:
      return "Standard";
    case process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY:
    case process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY:
      return "Premium";
    default:
      return "Unknown";
  }
}

function mapPriceIdToCycle(priceId) {
  const monthly = [
    process.env.NEXT_PUBLIC_PRICE_FREE_MONTHLY,
    process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY,
    process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY,
  ];
  const yearly = [
    process.env.NEXT_PUBLIC_PRICE_FREE_YEARLY,
    process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY,
    process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY,
  ];
  if (monthly.includes(priceId)) return "monthly";
  if (yearly.includes(priceId)) return "yearly";
  return "monthly";
}