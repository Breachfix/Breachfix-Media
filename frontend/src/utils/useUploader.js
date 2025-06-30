// utils/useUploader.js

import {
  getPresignedUrl,
  uploadToS3,
  finalizeUpload,
  extractS3KeyFromUrl, // ✅ Now actively used
} from "./uploadClient";

/**
 * Upload media files to S3 and finalize the upload with backend.
 * @param {Object} files - A map of file input names to File objects.
 * @param {string} mediaType - Type of content ("movie", "episode", "tv-show").
 * @param {Object} metadata - Extra metadata to finalize the upload (e.g., title, description).
 */
export async function uploadMediaFiles({ files, mediaType, metadata }) {
  const result = {};

  for (const [fieldName, file] of Object.entries(files)) {
    if (!file) continue;

    const { url: presignedUrl, key } = await getPresignedUrl({
      file,
      fieldName,
      mediaType,
    });

    await uploadToS3({ file, presignedUrl });

    // For demonstration: convert URL to key (even though we already have `key`)
    const extractedKey = extractS3KeyFromUrl(presignedUrl);
    result[fieldName + "S3Key"] = extractedKey;
  }

  // Combine S3 keys with metadata and finalize
  const payload = {
    ...metadata,
    ...result,
  };

  await finalizeUpload(mediaType, payload);

  return payload;
}

/**
 * Upload an actor profile image using the existing presigned flow.
 * Returns the profileS3Key for finalization.
 */
export async function uploadActorProfile(file) {
  if (!file) return null;

  const { url: presignedUrl, key } = await getPresignedUrl({
    file,
    fieldName: "profile",
    mediaType: "actor",
  });

  await uploadToS3({ file, presignedUrl });

  // Example use of extractS3KeyFromUrl
  return extractS3KeyFromUrl(presignedUrl);
}

/**
 * Upload a company logo using the existing presigned flow.
 * Returns the logoS3Key for finalization.
 */
export async function uploadCompanyLogo(file) {
  if (!file) return null;

  const { url: presignedUrl, key } = await getPresignedUrl({
    file,
    fieldName: "logo",
    mediaType: "company",
  });

  await uploadToS3({ file, presignedUrl });

  // Example use of extractS3KeyFromUrl
  return extractS3KeyFromUrl(presignedUrl);
}