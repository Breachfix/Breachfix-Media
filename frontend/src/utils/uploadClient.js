// src/utils/uploadClient.js

/**
 * Step 1: Get presigned URL from backend
 */
import uploadApi from "@/lib/authenticatedAxios";

export async function getPresignedUrl({ file, fieldName, mediaType }) {
  const timestamp = Date.now();
  const cleanName = file.name.replace(/\s+/g, "_");
  const key = `temp/${mediaType}/${fieldName}/${timestamp}_${cleanName}`;

  const res = await uploadApi.post("/media/upload/presign", {
    key,
    contentType: file.type,
  });

  if (!res?.data?.url) {
    throw new Error("Failed to get presigned URL");
  }

  return { ...res.data, key };
}

/**
 * Step 2: Upload to S3 using presigned URL
 */
export async function uploadToS3({ file, presignedUrl }) {
  const res = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file
  });
  if (!res.ok) throw new Error('Failed to upload to S3');
  return true;
}

/**
 * Step 3: Finalize upload by notifying backend
 */
export async function finalizeUpload(type, data) {
  try {
    const res = await uploadApi.post(`/media/upload/upload-${type}`, data);
    if (!res.data?.success) {
      console.error("❌ Finalize response:", res.data);
      throw new Error("Failed to finalize upload");
    }
    return res.data;
  } catch (err) {
    console.error("❌ Axios error:", err.response?.data || err.message);
    throw err;
  }
}
function pluralizeType(type) {
  const map = {
    "tv-show": "tvshows",
    "movie": "movies",
    "episode": "episodes",
    "actor": "actor",
    "company": "company",
  };
  if (!map[type]) throw new Error(`Unknown type for pluralization: ${type}`);
  return map[type];
}
export async function finalizeMediaMetadata(type, payload) {
  try {
    const res = await uploadApi.post(`/media/${pluralizeType(type)}`, payload);
    if (!res.data?.success) {
      console.error("❌ Finalize media metadata failed:", res.data);
      throw new Error("Failed to finalize media metadata");
    }
    return res.data?.data || res.data;
  } catch (err) {
    console.error("❌ Axios error [metadata]:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * Utility: Extract S3 key from presigned URL
 */
export function extractS3KeyFromUrl(url) {
  try {
    const u = new URL(url);
    return decodeURIComponent(u.pathname.slice(1));
  } catch {
    return null;
  }
}
