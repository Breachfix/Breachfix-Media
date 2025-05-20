// File: /src/utils/subscription.js

import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API}/api/v1`; // Auth API base

export async function fetchUserByStripeCustomerId(stripeCustomerId) {
  try {
    const response = await axios.get(`${API_URL}/auth/by-stripe/${stripeCustomerId}`, {
      headers: {
        'x-internal-token': process.env.INTERNAL_API_TOKEN,
      },
    });

    return response.data.user; // or however the response structure is
  } catch (error) {
    console.error("❌ Error fetching user from auth service:", error.response?.data || error.message);
    throw new Error('User not found');
  }
}


