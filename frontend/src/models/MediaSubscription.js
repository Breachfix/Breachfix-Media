import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
 userId: {
    type: String,
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
    default: "monthly",
    required: true,
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
  amountTotal: Number, // in cents
  currency: String, // e.g., "cad"
  latestInvoice: String,
  paymentStatus: {
    type: String,
    enum: ["paid", "unpaid", "failed", "open", "void", "draft"],
  },
  hostedInvoiceUrl: String,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

export default mongoose.models.MediaSubscription ||
  mongoose.model("MediaSubscription", subscriptionSchema);