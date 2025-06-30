// components/upload/sections/ContentWarningsSection.js

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Section from "../Section";
import { CONTENT_WARNINGS } from "./constants"; // assuming both are in the same folder


const ContentWarningsSection = ({ form, setForm }) => {
  const selected = form.contentWarnings || [];

  const toggleWarning = (label) => {
    const current = new Set(selected);
    current.has(label) ? current.delete(label) : current.add(label);
    setForm({ ...form, contentWarnings: Array.from(current) });
  };

  const handleCustomAdd = () => {
    const val = form.newContentWarning?.trim();
    if (val && !selected.includes(val)) {
      setForm({
        ...form,
        contentWarnings: [...selected, val],
        newContentWarning: "",
      });
    }
  };

  return (
    <Section title="Content Warnings">
    <div className="mb-6 p-4  rounded-xl shadow-sm">
      <p className="text-sm text-gray-600 mb-4">
        Select any thematic elements that viewers should be aware of. These help prepare spiritually sensitive audiences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTENT_WARNINGS.map(({ label, tip }) => {
          const isSelected = selected.includes(label);
          return (
            <label
              key={label}
              className={`flex flex-col border rounded-xl p-3 transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md bg-white  border-gray-300 dark:border-gray-600 ${
                isSelected ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900" : ""
              }`}
              onClick={() => toggleWarning(label)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleWarning(label)}
                  className="accent-blue-600"
                />
                <span className={`text-sm ${isSelected ? "font-semibold text-black dark:text-white" : "text-gray-600"}`}>
                  {label}
                </span>
              </div>
              {isSelected && (
                <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-snug">{tip}</p>
              )}
            </label>
          );
        })}
      </div>

      <div className="mt-4 flex gap-2">
        <Input
          placeholder="Add custom content warning..."
          value={form.newContentWarning || ""}
          onChange={(e) => setForm({ ...form, newContentWarning: e.target.value })}
        />
        <Button type="button" onClick={handleCustomAdd}>
          Add
        </Button>
      </div>
    </div>
    </Section>
  );
};

export default ContentWarningsSection;