import {
  getPresignedUrl,
  uploadToS3,
  finalizeUpload,
  finalizeMediaMetadata,
  extractS3KeyFromUrl,
} from "./uploadClient";

/**
 * Safely finalize upload for a specific file with structured parameters.
 */
export async function safeFinalizeUpload(tempS3Key, id, type, fileType, tvShowId = null, seasonNumber = null) {
  if (!tempS3Key || !id || !type || !fileType) {
    throw new Error("Missing required fields for finalizing upload");
  }

  return await finalizeUpload(type, {
    tempS3Key,
    target: {
      id,
      type,
      fileType,
      ...(tvShowId && { tvShowId }),
      ...(seasonNumber && { seasonNumber }),
    },
  });
}

/**
 * Upload media files to S3 and finalize the upload with backend.
 * @param {Object} files - A map of file input names to File objects.
 * @param {string} mediaType - Type of content ("movie", "episode", "tv-show").
 * @param {Object} metadata - Extra metadata to finalize the upload (e.g., title, description).
 */
export async function uploadMediaFiles({ files, mediaType, metadata }) {
  const result = {};

  // Step 1: Upload files to S3 via presigned URLs
  for (const [fieldName, file] of Object.entries(files)) {
    if (!file) continue;

    const { url: presignedUrl } = await getPresignedUrl({
      file,
      fieldName,
      mediaType,
    });

    await uploadToS3({ file, presignedUrl });
    const extractedKey = extractS3KeyFromUrl(presignedUrl);
    result[fieldName + "S3Key"] = extractedKey;
  }

  // Step 2: Save metadata to MongoDB (includes temp S3 keys)
  const metadataPayload = {
    ...metadata,
    ...result,
    thumbnail_url_s3: result.posterFileS3Key || metadata.posterUrl,
    trailerUrl: result.trailerFileS3Key || metadata.trailerUrl,
    video_url_s3: result.videoFileS3Key || metadata.videoUrl,
  };

  const saved = await finalizeMediaMetadata(mediaType, metadataPayload);
  const id = saved?._id || saved?.id;
  if (!id) throw new Error("❌ Failed to retrieve ID from saved content");

  // Step 3: Finalize all uploaded files (move from temp to final S3 paths)
  const finalizedPoster = result.posterFileS3Key
    ? await finalizeUpload(mediaType, {
        tempS3Key: result.posterFileS3Key,
        target: {
          id,
          type: mediaType,
          fileType: "poster",
          title: metadata.title,
          tvShowId: metadata.tvShowId,
          seasonNumber: metadata.seasonNumber,
        },
      })
    : null;

  const finalizedTrailer = result.trailerFileS3Key
    ? await finalizeUpload(mediaType, {
        tempS3Key: result.trailerFileS3Key,
        target: {
          id,
          type: mediaType,
          fileType: "trailer",
          title: metadata.title,
          tvShowId: metadata.tvShowId,
          seasonNumber: metadata.seasonNumber,
        },
      })
    : null;

  const finalizedVideo = result.videoFileS3Key
    ? await finalizeUpload(mediaType, {
        tempS3Key: result.videoFileS3Key,
        target: {
          id,
          type: mediaType,
          fileType: "video",
          title: metadata.title,
          tvShowId: metadata.tvShowId,
          seasonNumber: metadata.seasonNumber,
        },
      })
    : null;

  // Optional: Patch MongoDB with final CloudFront URLs if needed
  // (skip this if finalizeUpload already updates DB)

  return {
    ...saved,
    thumbnail_url_s3: finalizedPoster?.cloudfrontUrl || saved.thumbnail_url_s3,
    trailerUrl: finalizedTrailer?.cloudfrontUrl || saved.trailerUrl,
    video_url_s3: finalizedVideo?.cloudfrontUrl || saved.video_url_s3,
  };
}

/**
 * Upload an actor profile image using the presigned flow.
 * Returns the profileS3Key for finalization.
 */
export async function uploadActorProfile(file) {
  if (!file) return null;

  const { url: presignedUrl } = await getPresignedUrl({
    file,
    fieldName: "profile",
    mediaType: "actor",
  });

  await uploadToS3({ file, presignedUrl });
  return extractS3KeyFromUrl(presignedUrl);
}

/**
 * Upload a company logo using the presigned flow.
 * Returns the logoS3Key for finalization.
 */
export async function uploadCompanyLogo(file) {
  if (!file) return null;

  const { url: presignedUrl } = await getPresignedUrl({
    file,
    fieldName: "logo",
    mediaType: "company",
  });

  await uploadToS3({ file, presignedUrl });
  return extractS3KeyFromUrl(presignedUrl);
}