// components/upload/metadata/TvShowMetadataSection.js

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TvShowMetadataSection = ({ form = {}, setForm = () => {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="mb-6 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-3">📺 TV Show Metadata</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Provide information specific to the TV show such as the release year and number of seasons.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Release Year</Label>
          <Input
            type="number"
            name="releaseYear"
            value={form.releaseYear || ""}
            onChange={handleChange}
            placeholder="e.g. 2023"
          />
        </div>

        <div>
          <Label>Total Seasons</Label>
          <Input
            type="number"
            name="totalSeasons"
            value={form.totalSeasons || ""}
            onChange={handleChange}
            placeholder="e.g. 3"
          />
        </div>
      </div>
    </div>
  );
};

export default TvShowMetadataSection;