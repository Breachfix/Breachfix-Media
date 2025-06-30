// components/upload/metadata/MovieMetadataSection.js

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "../Section";

const MovieMetadataSection = ({ form = {}, setForm = () => {} }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section title="Movie Metadata">
      <div className="space-y-6 text-black">
        <p className="text-sm text-gray-600 mb-4">
          This section includes movie-specific metadata like duration, release, awards, and platform-level details.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duration */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Duration</Label>
            <Input
              type="text"
              name="duration"
              value={form.duration || ""}
              onChange={handleChange}
              placeholder="e.g. 1h 45m"
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

          {/* Release Date */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Release Date</Label>
            <Input
              type="date"
              name="releaseDate"
              value={form.releaseDate || ""}
              onChange={handleChange}
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

          {/* Release Country */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Release Country</Label>
            <Input
              type="text"
              name="releaseCountry"
              value={form.releaseCountry || ""}
              onChange={handleChange}
              placeholder="e.g. USA"
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

          {/* Author */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Author</Label>
            <Input
              type="text"
              name="author"
              value={form.author || ""}
              onChange={handleChange}
              placeholder="e.g. Pastor John Doe"
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

          {/* Awards */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Awards</Label>
            <Input
              type="text"
              name="awards"
              value={form.awards || ""}
              onChange={handleChange}
              placeholder="e.g. Faith Film Award 2025"
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

        

          {/* Region Restrictions */}
          <div>
            <Label className="block mb-1 font-semibold text-black">Region Restrictions</Label>
            <Input
              type="text"
              name="regionRestrictions"
              value={form.regionRestrictions || ""}
              onChange={handleChange}
              placeholder="e.g. US, CA, UK (comma-separated)"
              className="bg-gray-100 text-black border border-gray-300 rounded-md"
            />
          </div>

         
        </div>
      </div>
    </Section>
  );
};

export default MovieMetadataSection;