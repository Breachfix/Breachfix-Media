// File: /src/app/api/billing/load-plans/route.js

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET() {
  try {
    const products = await stripe.products.list({ active: true });

    const prices = await stripe.prices.list({ active: true, expand: ["data.product"] });

    const plans = prices.data.map((price) => {
      const product = products.data.find((p) => p.id === price.product);

      return {
        planName: product?.name || "Unknown",
        description: product?.description || null,
        productId: product?.id,
        priceId: price.id,
        amount: price.unit_amount,
        currency: price.currency,
        interval: price.recurring?.interval,
        intervalCount: price.recurring?.interval_count,
        metadata: product?.metadata || {},
      };
    });

    return NextResponse.json({ success: true, plans });
  } catch (err) {
    console.error("❌ Error loading Stripe plans:", err);
    return NextResponse.json(
      { success: false, message: "Failed to load plans" },
      { status: 500 }
    );
  }
}
