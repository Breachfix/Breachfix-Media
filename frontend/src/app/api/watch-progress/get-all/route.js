// app/api/watch-progress/get-all/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req) {
  const uid = req.nextUrl.searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ success: false, message: "Missing UID" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection("watchProgress");

  const progressList = await collection.find({ uid }).toArray();

  return NextResponse.json({ success: true, data: progressList });
}