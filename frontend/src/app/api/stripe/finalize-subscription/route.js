import Stripe from "stripe";
import { NextResponse } from "next/server";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";
import { linkCustomerIdToUser } from "@/utils/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ success: false, message: "Missing session ID" }, { status: 400 });
  }

  try {
    await connectToDB();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const subscription = await stripe.subscriptions.retrieve(session.subscription);

    const userId = session.metadata?.userId;
    const stripeCustomerId = session.customer;

    await linkCustomerIdToUser(userId, stripeCustomerId);

    await MediaSubscription.findOneAndUpdate(
      { userId },
      {
        userId,
        stripeCustomerId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        startDate: new Date(subscription.start_date * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        planName: mapPriceIdToPlan(subscription.items.data[0].price.id),
        billingCycle: mapPriceIdToCycle(subscription.items.data[0].price.id),
        amountTotal: session.amount_total || null,
        currency: session.currency || null,
        latestInvoice: subscription.latest_invoice || null,
        paymentStatus: "paid",
        hostedInvoiceUrl: session.invoice || null,
        metadata: subscription.metadata || {},
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error("❌ Finalize subscription error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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