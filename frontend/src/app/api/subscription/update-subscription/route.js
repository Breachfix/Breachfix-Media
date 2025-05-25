import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";
import { fetchUserByStripeCustomerId } from "@/utils/subscription"; // 👈 assumed helper exists like in webhook

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

    // ✅ Confirm user exists in auth service or internal system
    const user = await fetchUserByStripeCustomerId(subscription.customer);
    if (!user) {
      console.error("❌ User not found:", userId);
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // ✅ Lookup user's current subscription
    const subscription = await MediaSubscription.findOne({ userId: userId.toString() });
    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json({ success: false, message: "Active subscription not found" }, { status: 404 });
    }

    // 🔍 Get Stripe subscription to extract item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0]?.id;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Stripe item ID not found" },
        { status: 500 }
      );
    }

    // 🔄 Update Stripe subscription
    const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [{ id: itemId, price: newPriceId }],
    });

    // 🧠 Update DB with updated info
    subscription.planName = mapPriceIdToPlan(newPriceId);
    subscription.billingCycle = mapPriceIdToCycle(newPriceId);
    subscription.status = updated.status;
    await subscription.save();

    console.log(`✅ Subscription updated for user ${user.email || userId}`);
    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
    });

  } catch (error) {
    console.error("❌ Subscription update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 📦 Helpers
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