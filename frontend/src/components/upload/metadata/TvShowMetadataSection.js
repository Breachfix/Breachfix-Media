import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "../Section";

const TvShowMetadataSection = ({ form = {}, setForm = () => {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section title="TV Show Metadata">
      <div className="mb-6 p-4 rounded-xl shadow-sm space-y-6 text-black">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This section includes metadata specific to TV shows, such as number of seasons and release year.
        </p>

        {/* Release Year */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Release Year</Label>
          <Input
            type="number"
            name="releaseYear"
            value={form.releaseYear || ""}
            onChange={handleChange}
            placeholder="e.g. 2023"
            className="text-black"
          />
        </div>

        {/* Total Seasons */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Total Seasons</Label>
          <Input
            type="number"
            name="totalSeasons"
            value={form.totalSeasons || ""}
            onChange={handleChange}
            placeholder="e.g. 3"
            className="text-black"
          />
        </div>
      </div>
    </Section>
  );
};

export default TvShowMetadataSection;