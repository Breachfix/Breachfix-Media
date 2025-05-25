import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";

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

    const subscription = await MediaSubscription.findOne({ userId: userId.toString() });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { success: false, message: "Active subscription not found" },
        { status: 404 }
      );
    }

    // Retrieve the current subscription from Stripe to get item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    const itemId = stripeSub.items.data[0]?.id;

    if (!itemId) {
      return NextResponse.json(
        { success: false, message: "Stripe item ID not found" },
        { status: 500 }
      );
    }

    // 🔄 Update subscription with new price
    const updated = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
      proration_behavior: "create_prorations",
      items: [{ id: itemId, price: newPriceId }],
    });

    // 💾 Update local DB with new plan info
    subscription.planName = mapPriceIdToPlan(newPriceId);
    subscription.billingCycle = mapPriceIdToCycle(newPriceId);
    subscription.status = updated.status;
    await subscription.save();

    return NextResponse.json({
      success: true,
      message: "Subscription updated successfully",
    });
  } catch (error) {
    console.error("❌ Subscription update error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Helpers
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

function mapPriceIdToCycle(priceId) {
  const monthly = [
    process.env.Price_Free_Monthly,
    process.env.Price_Basic_Monthly,
    process.env.Price_Premium_Monthly,
  ];
  const yearly = [
    process.env.Price_Free_Yearly,
    process.env.Price_Basic_Yearly,
    process.env.Price_Premium_Yearly,
  ];
  if (monthly.includes(priceId)) return "monthly";
  if (yearly.includes(priceId)) return "yearly";
  return "monthly";
}