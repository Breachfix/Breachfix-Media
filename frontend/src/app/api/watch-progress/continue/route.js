// File: /app/api/watch-progress/continue/route.js

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { fetchWatchContent } from '@/utils';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');
    const accountId = searchParams.get('accountId');

    if (!uid || !accountId) {
      return NextResponse.json({ success: false, message: 'Missing uid or accountId' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); // optionally specify db name: client.db("your_db_name")
    const collection = db.collection("watchprogress"); // ensure your collection is lowercase and correct

    // ✅ Sort by updatedAt DESC
    const records = await collection
      .find({ uid, accountId })
      .sort({ updatedAt: -1 })
      .toArray();

    const enrichedRecords = await Promise.all(
      records.map(async (record) => {
        try {
          const enriched = await fetchWatchContent(record.type, record.mediaId);

          return {
            ...record,
            title: enriched?.title || 'Untitled',
            thumbnail: enriched?.thumbnailUrl || enriched?.posterUrl || '',
            duration: enriched?.duration || null,
            videoUrl: enriched?.videoUrl || '',
          };
        } catch (err) {
          console.error(`⚠️ Failed to enrich media ${record.mediaId}:`, err);
          return record;
        }
      })
    );

    return NextResponse.json({ success: true, data: enrichedRecords });
  } catch (error) {
    console.error('❌ Error in GET /watch-progress/continue:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}