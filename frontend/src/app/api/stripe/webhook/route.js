
import Stripe from "stripe";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";
import {
  fetchUserByStripeCustomerId,
  linkCustomerIdToUser
} from "@/utils/subscription";

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

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.resumed":
    case "customer.subscription.pending_update_applied": {
      const subscription = event.data.object;

      try {
        const user = await fetchUserByStripeCustomerId(subscription.customer);

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
            amountTotal: invoice?.amount_paid || null,
            currency: invoice?.currency || null,
            latestInvoice: invoice?.id || null,
            paymentStatus: invoice?.status || null,
            hostedInvoiceUrl: invoice?.hosted_invoice_url || null,
            metadata: subscription.metadata || {},
          },
          { upsert: true, new: true }
        );

        console.log(`✅ Subscription saved for user ${user.email}`);
        console.log("📦 MongoDB save result:", saved);
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

        const updated = await MediaSubscription.findOneAndUpdate(
          { userId: user._id },
          { status: subscription.status },
          { new: true }
        );

        console.log(`⚠️ Subscription ${event.type} for ${user.email}`);
        console.log("📦 Updated subscription document:", updated);
      } catch (err) {
        console.error("❌ Error handling subscription deletion/pausing:", err.message);
      }

      break;
    }

    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const stripeCustomerId = session.customer;

      if (!userId || !stripeCustomerId) {
        console.error("❌ Missing userId or customer in session metadata");
        break;
      }

      try {
        await linkCustomerIdToUser(userId, stripeCustomerId);
        console.log(`✅ Linked user ${userId} with Stripe customer ${stripeCustomerId}`);
      } catch (err) {
        console.error("❌ Error linking Stripe customer ID:", err.message);
      }

      break;
    }

    case "invoice.payment_succeeded":
      console.log("✅ Invoice payment succeeded");
      break;

    case "invoice.payment_failed":
      console.warn("❌ Invoice payment failed");
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
  return "monthly";
}