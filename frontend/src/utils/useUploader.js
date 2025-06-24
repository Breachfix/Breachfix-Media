// utils/useUploader.js

import {
  getPresignedUrl,
  uploadToS3,
  extractS3KeyFromUrl,
  finalizeUpload,
} from "./uploadClient";

/**
 * Upload multiple media files to S3 and return a map of their S3 keys.
 * @param {Object} files - A map of file input names to File objects.
 * @param {string} mediaType - The type of media (movie, episode, tv-show).
 */
export async function uploadMediaFiles({ files, mediaType }) {
  const result = {};

  for (const [fieldName, file] of Object.entries(files)) {
    if (!file) continue;

    const { url: presignedUrl, key } = await getPresignedUrl({
      file,
      fieldName,
      mediaType,
    });
    await uploadToS3({ file, presignedUrl });

    result[fieldName + "S3Key"] = key; // store raw S3 key
  }

  return result;
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

  return key;
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

  return key;
}
