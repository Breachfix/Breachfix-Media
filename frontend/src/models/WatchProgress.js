import mongoose from "mongoose";

const WatchProgressSchema = new mongoose.Schema(
  {
    accountId: { type: String, required: true }, // Sub-profile account
    mediaId: { type: String, required: true }, // Movie or episode ID
    mediaType: { type: String, enum: ["movie", "tv", "episode"], required: true },
    currentTime: { type: Number, required: true },
    duration: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.WatchProgress ||
  mongoose.model("WatchProgress", WatchProgressSchema);