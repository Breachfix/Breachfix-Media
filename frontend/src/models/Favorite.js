import mongoose from "mongoose";

const NewFavoriteSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    accountID: { type: String, required: true },
    movieID: { type: mongoose.Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["movie", "tv"], required: true },
    title: { type: String },
    description: { type: String },
    thumbnail_url_s3: { type: String },
    video_url_s3: { type: String }, // optional, future-proof
  },
  { timestamps: true }
);

const Favorites =
  mongoose.models.Favorites || mongoose.model("Favorites", NewFavoriteSchema);

export default Favorites;