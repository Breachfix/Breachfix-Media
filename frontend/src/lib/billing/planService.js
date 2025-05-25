// File: /src/lib/billing/planService.js

import axios from "axios";

/**
 * Fetches all subscription products and pricing from the backend Stripe loader.
 * @returns {Promise<Array>} - A list of plans with metadata.
 */
export async function loadPlansFromStripe() {
  try {
    const res = await axios.get("/api/stripe/billing/load-plans");

    if (!res.data.success) {
      throw new Error("Failed to load Stripe plans");
    }

    // Format the result for frontend use
    const plans = res.data.products.map((product) => {
      const monthlyPrice = product.prices.find((p) => p.interval === "month");
      const yearlyPrice = product.prices.find((p) => p.interval === "year");

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        metadata: product.metadata,
        images: product.images,
        prices: {
          monthly: monthlyPrice ? `$${(monthlyPrice.unit_amount / 100).toFixed(2)}` : null,
          yearly: yearlyPrice ? `$${(yearlyPrice.unit_amount / 100).toFixed(2)}` : null,
        },
        priceIds: {
          monthly: monthlyPrice?.id,
          yearly: yearlyPrice?.id,
        },
      };
    });

    return plans;
  } catch (error) {
    console.error("❌ Error loading Stripe plans:", error);
    throw error;
  }
}
