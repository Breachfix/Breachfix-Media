import api from "@/lib/api";

// ✅ Save watch progress
export const saveWatchProgress = async ({
  uid,
  accountId,
  mediaId,
  type,
  progressInSeconds,
  duration,
}) => {
  try {
    const res = await api.post("/watch-progress", {
      userId: uid,
      accountId,
      mediaId,
      mediaType: type,
      currentTime: progressInSeconds,
      duration,
    });

    return res.data;
  } catch (error) {
    console.error("❌ Error saving watch progress:", error);
    return { success: false, message: error.message };
  }
};

// ✅ Fetch all watch progress by uid
export const getAllWatchProgress = async (uid) => {
  try {
    const res = await api.get("/watch-progress/get-all", {
      params: { uid },
    });

    if (res.data.success) {
      console.log("📽️ All progress:", res.data.data);
      return res.data.data;
    } else {
      console.warn("⚠️ No watch progress found");
      return [];
    }
  } catch (error) {
    console.error("❌ Error fetching all watch progress:", error);
    return [];
  }
};

// ✅ Get progress for a single media (for resuming video)
export const getSingleWatchProgress = async ({ uid, accountId, mediaId }) => {
  try {
    const res = await api.get("/watch-progress/get", {
      params: { uid, accountId, mediaId },
    });

    if (res.data.success) {
      return res.data.progressInSeconds;
    } else {
      console.warn("⚠️ No progress found for this media");
      return 0;
    }
  } catch (error) {
    console.error("❌ Error fetching single watch progress:", error);
    return 0;
  }
};

// ✅ Fetch Continue Watching list (sorted + enriched)
export const getContinueWatchingItems = async (uid, accountId) => {
  try {
    const res = await api.get("/watch-progress/continue", {
      params: { uid, accountId },
    });

    if (res.data.success) {
      return res.data.data;
    } else {
      console.warn("⚠️ No continue watching items found");
      return [];
    }
  } catch (error) {
    console.error("❌ Failed to fetch continue watching items:", error);
    return [];
  }
};