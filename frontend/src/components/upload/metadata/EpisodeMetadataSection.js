import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "../Section";

const EpisodeMetadataSection = ({ form = {}, setForm = () => {}, tvShows = [] }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Section title="Episode Metadata">
      <div className="mb-6 p-4 rounded-xl shadow-sm space-y-6 text-black">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Metadata specific to this episode — including TV show, season, episode number, and premiere date.
        </p>

        {/* TV Show Selection */}
        <div>
          <Label className="block mb-1 font-semibold text-black">TV Show</Label>
          <select
            name="tvShowId"
            value={form.tvShowId || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select TV Show</option>
            {tvShows.map((show) => (
              <option key={show._id} value={show._id}>
                {show.title}
              </option>
            ))}
          </select>
        </div>

        {/* Season Number */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Season Number</Label>
          <Input
            type="number"
            name="seasonNumber"
            value={form.seasonNumber || ""}
            onChange={handleChange}
            placeholder="e.g. 1"
            className="text-black"
          />
        </div>

        {/* Episode Number */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Episode Number</Label>
          <Input
            type="number"
            name="episodeNumber"
            value={form.episodeNumber || ""}
            onChange={handleChange}
            placeholder="e.g. 3"
            className="text-black"
          />
        </div>

        {/* Duration */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Duration</Label>
          <Input
            type="text"
            name="duration"
            value={form.duration || ""}
            onChange={handleChange}
            placeholder="e.g. 45m"
            className="text-black"
          />
        </div>

        {/* Premiere Date */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Premiere Date</Label>
          <Input
            type="date"
            name="premiereDate"
            value={form.premiereDate || ""}
            onChange={handleChange}
            className="text-black"
          />
        </div>
      </div>
    </Section>
  );
};

export default EpisodeMetadataSection;