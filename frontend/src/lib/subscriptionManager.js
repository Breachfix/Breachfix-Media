// File: /src/lib/subscriptionManager.js

import axios from "axios";

const BASE_INTERNAL_API = "/api/subscription";
const BASE_STRIPE_API = "/api/stripe";

/**
 * Fetch the current subscription of a user by userId.
 */
export async function getUserSubscription(userId) {
  if (!userId) throw new Error("Missing userId");

  try {
    const res = await fetch("/api/subscription/get-user-subscription", {
      headers: {
        "x-user-id": userId,
      },
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error("Failed to fetch subscription");
    }

    return data;
  } catch (err) {
    console.error("❌ Error getting user subscription:", err);
    throw err;
  }
}

/**
 * Save or update a user's subscription to MongoDB (manual sync).
 */
export async function saveUserSubscription(payload) {
  try {
    const res = await fetch(`${BASE_INTERNAL_API}/save-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error("❌ Error saving subscription:", err);
    throw err;
  }
}

/**
 * Trigger a Stripe Checkout Session.
 * Used to subscribe to a new plan.
 */
export async function createStripeCheckoutSession({ planName, priceId, userId, billingCycle }) {
  try {
    const res = await fetch(`${BASE_STRIPE_API}/checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planName, priceId, userId, billingCycle }),
    });

    const data = await res.json();
    if (!data.url) throw new Error("Stripe session URL missing");
    return data.url;
  } catch (err) {
    console.error("❌ Error creating Stripe checkout session:", err);
    throw err;
  }
}

/**
 * Update an existing Stripe subscription (plan upgrade/downgrade).
 */
export async function updateStripeSubscription(userId, newPriceId) {
  try {
    const res = await fetch(`${BASE_STRIPE_API}/update-subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, newPriceId }),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Failed to update subscription");
    return data;
  } catch (err) {
    console.error("❌ Error updating Stripe subscription:", err);
    throw err;
  }
}