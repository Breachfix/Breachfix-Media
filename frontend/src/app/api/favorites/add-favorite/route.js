import connectToDB from "@/database";
import Favorites from "@/models/Favorite";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    await connectToDB();

    const data = await req.json();
    const {
      uid,
      accountID,
      movieID,
      type,
      title,
      description,
      thumbnail_url_s3,
      video_url_s3,
    } = data;

    // ✅ Validate required fields
    if (!uid || !accountID || !movieID || !type) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Check if already exists
    const exists = await Favorites.findOne({ uid, movieID, accountID });
    if (exists) {
      return NextResponse.json({
        success: false,
        message: "This is already added to your list",
      });
    }

    // ✅ Create new favorite with metadata
    const newFavorite = await Favorites.create({
      uid,
      accountID,
      movieID,
      type,
      title,
      description,
      thumbnail_url_s3,
      video_url_s3,
    });

    return NextResponse.json({
      success: true,
      message: "Added to your list successfully",
      data: newFavorite,
    });
  } catch (error) {
    console.error("❌ Error adding favorite:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}