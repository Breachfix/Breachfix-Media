// import { buffer } from "micro";
// import Stripe from "stripe";
// import connectToDB from "@/database"; // ✅ Your working Mongoose connection
// import MediaSubscription from "@/models/MediaSubscription";
// import { fetchUserByStripeCustomerId } from "@/utils/subscription";

// export const config = {
//   api: {
//     bodyParser: false, // Required to get raw body for Stripe signature
//   },
// };

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// export async function POST(req) {
//   // Step 1: Verify raw body for Stripe signature validation
//   const buf = await req.arrayBuffer();
//   const rawBody = Buffer.from(buf);
//   const sig = req.headers.get("stripe-signature");

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       rawBody,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("❌ Webhook signature verification failed:", err.message);
//     return new Response(`Webhook Error: ${err.message}`, { status: 400 });
//   }

//   // Step 2: Connect to MongoDB via Mongoose
//   await connectToDB();

//   // Step 3: Handle subscription creation
//   if (event.type === "customer.subscription.created") {
//     const subscription = event.data.object;

//     const stripeCustomerId = subscription.customer;
//     const stripeSubscriptionId = subscription.id;
//     const status = subscription.status;
//     const startDate = new Date(subscription.start_date * 1000);
//     const endDate = new Date(subscription.current_period_end * 1000);
//     const priceId = subscription.items.data[0].price.id;

//     let user;
//     try {
//       user = await fetchUserByStripeCustomerId(stripeCustomerId);
//     } catch (error) {
//       console.error("❌ Could not find user by Stripe customer ID");
//       return new Response("User not found", { status: 404 });
//     }

//     try {
//       const savedSubscription = await MediaSubscription.findOneAndUpdate(
//         { userId: user.id },
//         {
//           userId: user.id,
//           planName: mapPriceIdToPlan(priceId),
//           billingCycle: mapPriceIdToCycle(priceId),
//           stripeCustomerId,
//           stripeSubscriptionId,
//           status,
//           startDate,
//           endDate,
//         },
//         { upsert: true, new: true }
//       );

//       console.log(`✅ Subscription saved for user ${user.email}`);
//     } catch (dbError) {
//       console.error("❌ Failed to save subscription in DB:", dbError.message);
//       return new Response("Database save error", { status: 500 });
//     }
//   }

//   return new Response(JSON.stringify({ received: true }), { status: 200 });
// }

// // Helper: Convert Stripe Price ID to Plan Name
// function mapPriceIdToPlan(priceId) {
//   switch (priceId) {
//     case process.env.Price_Free_Monthly:
//     case process.env.Price_Free_Yearly:
//       return "Basic";
//     case process.env.Price_Basic_Monthly:
//     case process.env.Price_Basic_Yearly:
//       return "Standard";
//     case process.env.Price_Premium_Monthly:
//     case process.env.Price_Premium_Yearly:
//       return "Premium";
//     default:
//       return "Unknown";
//   }
// }

// // Helper: Convert Stripe Price ID to Billing Cycle
// function mapPriceIdToCycle(priceId) {
//   const monthly = [
//     process.env.Price_Free_Monthly,
//     process.env.Price_Basic_Monthly,
//     process.env.Price_Premium_Monthly,
//   ];
//   const yearly = [
//     process.env.Price_Free_Yearly,
//     process.env.Price_Basic_Yearly,
//     process.env.Price_Premium_Yearly,
//   ];

//   if (monthly.includes(priceId)) return "monthly";
//   if (yearly.includes(priceId)) return "yearly";
//   return "monthly"; // fallback
// }

import { buffer } from "micro";
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";
import { fetchUserByStripeCustomerId } from "@/utils/subscription";

export const config = {
  api: {
    bodyParser: false, // Required for raw body
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
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
    console.error("❌ Invalid Stripe Signature:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  await connectToDB();

  const subscriptionEvents = [
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
    "customer.subscription.pending_update_applied",
    "customer.subscription.pending_update_expired",
    "customer.subscription.trial_will_end"
  ];

  const invoiceEvents = [
    "invoice.payment_succeeded",
    "invoice.payment_failed"
  ];

  const checkoutEvents = [
    "checkout.session.completed"
  ];

  const customerEvents = [
    "customer.created",
    "customer.updated",
    "customer.deleted"
  ];

  // Handle events
  switch (event.type) {
case "customer.subscription.created":
case "customer.subscription.updated":
case "customer.subscription.resumed":
case "customer.subscription.pending_update_applied": {
  const subscription = event.data.object;

  try {
    const user = await fetchUserByStripeCustomerId(subscription.customer);

    // Fetch the latest invoice if available
    let invoice = null;
    if (subscription.latest_invoice) {
      invoice = await stripe.invoices.retrieve(subscription.latest_invoice);
    }

    const saved = await MediaSubscription.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        startDate: new Date(subscription.start_date * 1000),
        endDate: new Date(subscription.current_period_end * 1000),
        planName: mapPriceIdToPlan(subscription.items.data[0].price.id),
        billingCycle: mapPriceIdToCycle(subscription.items.data[0].price.id),

        // ✅ new fields below
        amountTotal: invoice?.amount_paid || null,
        currency: invoice?.currency || null,
        latestInvoice: invoice?.id || null,
        paymentStatus: invoice?.status || null,
        hostedInvoiceUrl: invoice?.hosted_invoice_url || null,
        metadata: subscription.metadata || {},
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Subscription updated for ${user.email}`);
  } catch (err) {
    console.error("❌ Error updating subscription:", err.message);
  }

  break;
}

    case "customer.subscription.deleted":
    case "customer.subscription.paused":
    case "customer.subscription.pending_update_expired": {
      const subscription = event.data.object;

      try {
        const user = await fetchUserByStripeCustomerId(subscription.customer);

        await MediaSubscription.findOneAndUpdate(
          { userId: user._id },
          { status: subscription.status },
          { new: true }
        );

        console.log(`⚠️ Subscription ${event.type} for ${user.email}`);
      } catch (err) {
        console.error("❌ Error handling subscription deletion/pausing:", err.message);
      }

      break;
    }

    case "invoice.payment_succeeded":
      console.log("✅ Invoice payment succeeded");
      break;

    case "invoice.payment_failed":
      console.warn("❌ Invoice payment failed");
      break;

    case "checkout.session.completed":
      console.log("✅ Checkout completed");
      break;

    case "customer.created":
      console.log("👤 New customer created");
      break;

    case "customer.updated":
      console.log("🔄 Customer updated");
      break;

    case "customer.deleted":
      console.log("🗑️ Customer deleted");
      break;

    case "customer.subscription.trial_will_end":
      console.log("📆 Trial ending soon");
      break;

    default:
      console.log(`🔔 Unhandled event: ${event.type}`);
      break;
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
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
  return "monthly"; // fallback
}