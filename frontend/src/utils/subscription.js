// File: /utils/subscription.js

import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API}/api/v1`; // External Auth API base

// ✅ Fetch user by Stripe customer ID (expects user object with `id`)
export async function fetchUserByStripeCustomerId(stripeCustomerId) {
  try {
    const response = await axios.get(`${API_URL}/stripe/by-stripe/${stripeCustomerId}`, {
      headers: {
        'x-internal-token': process.env.INTERNAL_API_TOKEN,
      },
    });

    // Assuming response contains a user object with `id`
    return response.data.user;
  } catch (error) {
    console.error("❌ Error fetching user from auth service:", error.response?.data || error.message);
    throw new Error('User not found');
  }
}

// ✅ Link Stripe customer ID to user (now using `userId`)
export async function linkCustomerIdToUser(userId, stripeCustomerId) {
  try {
    const response = await axios.put(`${API_URL}/stripe/link-customer-id`, {
      userId,
      stripeCustomerId,
    }, {
      headers: {
        'x-internal-token': process.env.INTERNAL_API_TOKEN,
      },
    });

    return response.data;
  } catch (error) {
    console.error("❌ Error linking Stripe customer ID to user:", error.response?.data || error.message);
    throw new Error('Failed to link Stripe customer ID');
  }
}