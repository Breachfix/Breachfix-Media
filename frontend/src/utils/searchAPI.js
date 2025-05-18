// utils/searchAPI.js
export const searchMediaByText = async (query) => {
  if (!query || query.length < 2) {
    throw new Error("Search query too short");
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/search/text/${encodeURIComponent(query)}`);
    const data = await res.json();
    return data?.content || {};
  } catch (error) {
    console.error("Search text error:", error.message);
    throw error;
  }
};