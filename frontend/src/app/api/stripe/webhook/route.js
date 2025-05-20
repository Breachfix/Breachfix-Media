import { buffer } from "micro";
import Stripe from "stripe";
import connectToDB from "@/database"; // ✅ Your working Mongoose connection
import MediaSubscription from "@/models/MediaSubscription";
import { fetchUserByStripeCustomerId } from "@/utils/subscription";

export const config = {
  api: {
    bodyParser: false, // Required to get raw body for Stripe signature
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  // Step 1: Verify raw body for Stripe signature validation
  const buf = await req.arrayBuffer();
  const rawBody = Buffer.from(buf);
  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Step 2: Connect to MongoDB via Mongoose
  await connectToDB();

  // Step 3: Handle subscription creation
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;

    const stripeCustomerId = subscription.customer;
    const stripeSubscriptionId = subscription.id;
    const status = subscription.status;
    const startDate = new Date(subscription.start_date * 1000);
    const endDate = new Date(subscription.current_period_end * 1000);
    const priceId = subscription.items.data[0].price.id;

    let user;
    try {
      user = await fetchUserByStripeCustomerId(stripeCustomerId);
    } catch (error) {
      console.error("❌ Could not find user by Stripe customer ID");
      return new Response("User not found", { status: 404 });
    }

    try {
      const savedSubscription = await MediaSubscription.findOneAndUpdate(
        { userId: user.id },
        {
          userId: user.id,
          planName: mapPriceIdToPlan(priceId),
          billingCycle: mapPriceIdToCycle(priceId),
          stripeCustomerId,
          stripeSubscriptionId,
          status,
          startDate,
          endDate,
        },
        { upsert: true, new: true }
      );

      console.log(`✅ Subscription saved for user ${user.email}`);
    } catch (dbError) {
      console.error("❌ Failed to save subscription in DB:", dbError.message);
      return new Response("Database save error", { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}

// Helper: Convert Stripe Price ID to Plan Name
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

// Helper: Convert Stripe Price ID to Billing Cycle
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
  return "monthly"; // fallback
}