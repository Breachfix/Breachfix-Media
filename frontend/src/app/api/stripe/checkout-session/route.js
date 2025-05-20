// File: /src/app/api/stripe/checkout-session/route.js

import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { planName, priceId, userId, billingCycle } = body;

    if (!planName || !priceId || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscribe?canceled=true`,
      metadata: {
        userId,
        planName,
        billingCycle,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Error creating Stripe checkout session:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}