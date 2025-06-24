// src/utils/uploadClient.js

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${API}/api/v3/media/upload`;

/**
 * Step 1: Get presigned URL from backend
 */
import uploadApi from "@/lib/authenticatedAxios";

export async function getPresignedUrl({ file, fieldName, mediaType }) {
  const timestamp = Date.now();
  const cleanName = file.name.replace(/\s+/g, "_");
  const key = `temp/${mediaType}/${fieldName}/${timestamp}_${cleanName}`;

  const res = await uploadApi.post("/presign", {
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
  const res = await uploadApi.post(`/upload-${type}`, data);
  if (!res.data?.success) {
    throw new Error("Failed to finalize upload");
  }
  return res.data;
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
