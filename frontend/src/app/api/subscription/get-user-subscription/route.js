import { NextResponse } from "next/server";
import connectToDB from "@/database/index";
import MediaSubscription from "@/models/MediaSubscription";

export async function GET(req) {
  try {
    await connectToDB();

    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing user ID in request headers" },
        { status: 400 }
      );
    }

    const subscription = await MediaSubscription.findOne({ userId: userId.toString() });

    if (!subscription || !subscription.planName) {
      return NextResponse.json({
        success: true,
        isActive: false,
        status: "none",
        planName: null,
      });
    }

    if (process.env.NODE_ENV === "development") {
      console.log("📦 Subscription result:", subscription);
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        isActive: subscription.status === "active",
        status: subscription.status,
        planName: subscription.planName,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Status": subscription.status || "none",
          "X-Debug-UserId": subscription.userId || "unknown",
        },
      }
    );
  } catch (err) {
    console.error("❌ Subscription fetch error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}