// components/upload/metadata/EpisodeMetadataSection.js

import React from "react";

const EpisodeMetadataSection = ({
  form = {},
  setForm = () => {},
  tvShows = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">🎬 Episode Metadata</h3>

      <div>
        <label className="block text-sm font-medium">TV Show</label>
        <select
          name="tvShowId"
          value={form.tvShowId || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        >
          <option value="">Select TV Show</option>
          {tvShows.map((show) => (
            <option key={show._id} value={show._id}>
              {show.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Season Number</label>
        <input
          type="number"
          name="seasonNumber"
          value={form.seasonNumber || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          placeholder="e.g. 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Episode Number</label>
        <input
          type="number"
          name="episodeNumber"
          value={form.episodeNumber || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          placeholder="e.g. 3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Premiere Date</label>
        <input
          type="date"
          name="premiereDate"
          value={form.premiereDate || ""}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
    </div>
  );
};

export default EpisodeMetadataSection;