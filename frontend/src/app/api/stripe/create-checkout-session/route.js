// src/app/api/stripe/checkout-session/route.js (App Router with Next.js 13+)
import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const { planName, priceId, userId } = body;

    if (!priceId || !userId || !planName) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/subscribe/cancel`,
      metadata: {
        userId,
        planName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation failed:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}