// utils/accountAPI.js or utils.js or wherever it's defined
export const getAllfavorites = async (uid, accountID) => {
  try {
    const res = await fetch(`/api/favorites/get-all-favorites?id=${uid}&accountID=${accountID}`);
    const data = await res.json();
    return data?.data || [];
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};