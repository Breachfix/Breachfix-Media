import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  planName: {
    type: String,
    enum: ["Basic", "Standard", "Premium"],
    required: true,
  },
    billingCycle: {
    type: String,
    enum: ["monthly", "yearly"],
    required: true,
    default: "monthly"
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  stripeSubscriptionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "trialing", "canceled", "incomplete", "past_due"],
    default: "active",
  },
  startDate: Date,
  endDate: Date,
}, { timestamps: true });

export default mongoose.models.MediaSubscription || mongoose.model("MediaSubscription", subscriptionSchema);