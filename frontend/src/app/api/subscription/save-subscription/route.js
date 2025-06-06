import { NextResponse } from "next/server";
import connectToDB from "@/database";
import MediaSubscription from "@/models/MediaSubscription";

export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();
    const {
      userId,
      planName,
      billingCycle = "monthly",
      stripeCustomerId,
      stripeSubscriptionId,
      status = "active",
      startDate,
      endDate,
      amountTotal,
      currency,
      latestInvoice,
      paymentStatus,
      hostedInvoiceUrl,
      metadata = {},
    } = body;

    // ✅ Validate userId
    if (!userId || userId === "pending" || userId === null) {
      return NextResponse.json(
        { success: false, message: "Invalid userId – cannot be 'pending' or null" },
        { status: 400 }
      );
    }

    // ✅ Add this guard against stale writes
    const existing = await MediaSubscription.findOne({ userId: userId.toString() });
    if (existing && existing.status !== "pending") {
      return NextResponse.json({
        success: false,
        message: "Subscription already finalized",
        data: existing,
      });
    }

    // ✅ Proceed with save or update
    const updated = await MediaSubscription.findOneAndUpdate(
      { userId: userId.toString() },
      {
        userId: userId.toString(),
        planName,
        billingCycle,
        stripeCustomerId,
        stripeSubscriptionId,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        amountTotal: amountTotal ?? null,
        currency: currency ?? null,
        latestInvoice: latestInvoice ?? null,
        paymentStatus: paymentStatus ?? null,
        hostedInvoiceUrl: hostedInvoiceUrl ?? null,
        metadata,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Subscription saved",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Error saving subscription:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}