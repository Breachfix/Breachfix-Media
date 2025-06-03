"use client";

import MediaItem from "../media-item";

export default function MediaRow({ title, medias }) {
  return (
    <div className="space-y-2 px-4">
      <h2 className="text-sm font-semibold text-[#e5e5e5] hover:text-white md:text-2xl">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide">
        {Array.isArray(medias) &&
          medias.map((mediaItem, index) => (
            <div
              key={`${mediaItem.id || mediaItem._id || "media"}-${index}`}
              className="w-full md:w-[260px] flex-shrink-0"
            >
              <MediaItem title={title} media={mediaItem} />
            </div>
          ))}
      </div>
    </div>
  );
}