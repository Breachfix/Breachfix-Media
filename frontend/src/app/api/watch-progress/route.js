import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, accountId, mediaId, mediaType, currentTime, duration } = body;

    if (!userId || !accountId || !mediaId) {
      return new Response(JSON.stringify({ success: false, message: "Missing required fields" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(); // optionally use db("your-db-name")
    const collection = db.collection("watchprogress");

    const filter = { userId, accountId, mediaId };
    const update = {
      $set: {
        userId,
        accountId,
        mediaId,
        mediaType,
        currentTime,
        duration,
        updatedAt: new Date(), // good practice
      },
    };

    const options = { upsert: true, returnDocument: "after" };

    const result = await collection.findOneAndUpdate(filter, update, options);

    return new Response(JSON.stringify({ success: true, progress: result.value }), { status: 200 });
  } catch (err) {
    console.error("❌ Error in POST /watch-progress:", err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}