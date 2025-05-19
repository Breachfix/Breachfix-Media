// pages/api/videos/search-trailer.js (Next.js API Route)

import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: `${title} official trailer`,
          type: "video",
          key: YOUTUBE_API_KEY,
          maxResults: 1,
        },
      }
    );

    const video = response.data.items[0];

    if (!video) {
      return res.status(404).json({ error: "No trailer found" });
    }

    const videoKey = video.id.videoId;

    return res.status(200).json({ videoKey });
  } catch (err) {
    console.error("YouTube API Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch trailer" });
  }
}