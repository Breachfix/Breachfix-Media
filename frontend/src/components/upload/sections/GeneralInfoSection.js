// src/components/upload/sections/GeneralInfoSection.js

import React from "react";
import Section from "../Section";

const GeneralInfoSection = ({ form, handleChange }) => {
  return (
    <Section title="General Information">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
          />
        </div>

        <div>
          <label htmlFor="company" className="block font-medium mb-1">Company</label>
          <input
            type="text"
            id="company"
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Production company"
          />
        </div>

        <div>
          <label htmlFor="actors" className="block font-medium mb-1">Actors (IDs comma-separated)</label>
          <input
            type="text"
            id="actors"
            name="actors"
            value={form.actors}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="actorId1, actorId2, ..."
          />
        </div>

        <div>
          <label htmlFor="releaseDate" className="block font-medium mb-1">Release Date</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="duration" className="block font-medium mb-1">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., 90"
          />
        </div>

        <div>
          <label htmlFor="isFree" className="block font-medium mb-1">Is Free?</label>
          <input
            type="checkbox"
            id="isFree"
            name="isFree"
            checked={form.isFree}
            onChange={handleChange}
            className="ml-2"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="description" className="block font-medium mb-1">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
          placeholder="Add a synopsis or summary..."
        />
      </div>
    </Section>
  );
};

export default GeneralInfoSection;