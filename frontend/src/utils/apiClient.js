// utils/apiClient.js
const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${API}/api/v3`;

export const fetchFromApi = async (endpoint) => {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error("API fetch failed");
  return res.json();
};