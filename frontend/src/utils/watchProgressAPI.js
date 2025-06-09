
// ✅ Get all watch progress for an account
export const getAllWatchProgress = async (accountId) => {
  try {
    const res = await fetch(`/api/watch-progress/get-all?accountId=${accountId}`);
    const data = await res.json();
    console.log("📦 All Watch Progress:", data);
    return data.success ? data.data : [];
  } catch (err) {
    console.error("❌ Get all progress failed:", err);
    return [];
  }
};

// ✅ Get single watch progress
export const getSingleWatchProgress = async ({ accountId, mediaId }) => {
  try {
    const res = await fetch(`/api/watch-progress/get?accountId=${accountId}&mediaId=${mediaId}`);
    const data = await res.json();
    console.log("🎯 Single Watch Progress:", data);
    return data.success ? data.progressInSeconds : 0;
  } catch (err) {
    console.error("❌ Get single progress failed:", err);
    return 0;
  }
};

// ✅ Get "Continue Watching" items
export const getContinueWatchingItems = async (accountId) => {
  try {
    const res = await fetch(`/api/watch-progress/continue?accountId=${accountId}`);
    const data = await res.json();
    console.log("▶️ Continue Watching Items:", data);
    return data.success ? data.data : [];
  } catch (err) {
    console.error("❌ Continue watching failed:", err);
    return [];
  }
};



// ✅ Save watch progress
export const saveWatchProgress = async ({
  accountId,
  mediaId,
  progressInSeconds,
  type, // ✅ Add this
}) => {
  console.log("🛠️ Trying to save progress...", {
    accountId,
    mediaId,
    type,
    progressInSeconds,
  });

  if (!accountId || !mediaId) {
    console.warn("⛔ Missing accountId or mediaId. Skipping save.", {
      accountId,
      mediaId,
    });
    return;
  }

  try {
    console.log("💾 Saving progress:", {
      accountId,
      mediaId,
      type,
      progressInSeconds,
    });

    const res = await fetch("/api/watch-progress/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountId, mediaId, type, progressInSeconds }),
    });

    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("✅ Save Watch Progress Response:", data);
      return data.success;
    } catch (parseErr) {
      console.error("❌ JSON parse error (did the server return HTML?):", parseErr);
      console.error("📄 Raw response:", text);
      return false;
    }
  } catch (err) {
    console.error("❌ Failed to save progress:", err);
    return false;
  }
};