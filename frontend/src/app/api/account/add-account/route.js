import connectToDB from "@/database";
import Account from "@/models/Account";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();
    const { name, pin, uid } = await req.json();

    console.log("➡️ Received:", { uid, name, pin });

    // Validate
    if (!uid || !name || !pin) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check duplicates
    const isAccountAlreadyExists = await Account.findOne({ uid, name });
    if (isAccountAlreadyExists) {
      return NextResponse.json({
        success: false,
        message: "Account name already exists for this user",
      });
    }

    // Check account limit (4 per user)
    const userAccounts = await Account.find({ uid });
    if (userAccounts.length >= 4) {
      return NextResponse.json({
        success: false,
        message: "Max 4 accounts allowed per user",
      });
    }

    // Create new account
    const hashedPin = await hash(pin, 12);
    const newAccount = await Account.create({
      uid,
      name,
      pin: hashedPin,
    });
    console.log("✅ Account created with UID:", uid);

    return NextResponse.json({
      success: true,
      message: "Account created successfully",
      data: newAccount,
    });
  } catch (error) {
    console.error("❌ Error in add-account route:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}