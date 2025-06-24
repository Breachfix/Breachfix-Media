// components/upload/metadata/MovieMetadataSection.js

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MovieMetadataSection = ({ form = {}, setForm = () => {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-6 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-3">🎥 Movie Metadata</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        This section includes additional metadata specific to movies such as title, duration, and release info.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Movie Title</Label>
          <Input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="e.g. Final Events"
          />
        </div>

        <div>
          <Label>Duration</Label>
          <Input
            type="text"
            name="duration"
            value={form.duration || ""}
            onChange={handleChange}
            placeholder="e.g. 1h 45m"
          />
        </div>

        <div>
          <Label>Release Date</Label>
          <Input
            type="date"
            name="releaseDate"
            value={form.releaseDate || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Release Country</Label>
          <Input
            type="text"
            name="releaseCountry"
            value={form.releaseCountry || ""}
            onChange={handleChange}
            placeholder="e.g. USA"
          />
        </div>
      </div>
    </div>
  );
};

export default MovieMetadataSection;