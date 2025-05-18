import connectToDB from "@/database"; // ✅ Add this
import Account from "@/models/Account";
import { NextResponse } from "next/server"; // ✅ Add this

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    await connectToDB(); // ✅ Ensure DB connection is established

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid user ID" },
        { status: 400 }
      );
    }

    const getAllAccounts = await Account.find({ uid: id });

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