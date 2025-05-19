import connectToDB from "@/database";
import Account from "@/models/Account";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid") || searchParams.get("id"); // ✅ fallback support
    console.log("📡 GET all accounts for UID:", uid);

    if (!uid || uid === "undefined") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid user ID" },
        { status: 400 }
      );
    }

    const getAllAccounts = await Account.find({ uid });

    console.log("✅ Accounts retrieved:", getAllAccounts);

    return NextResponse.json({
      success: true,
      data: getAllAccounts,
    });
  } catch (e) {
    console.error("❌ GET /api/account/get-all-accounts error:", e);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}