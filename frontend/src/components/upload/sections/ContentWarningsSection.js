// components/upload/sections/ContentWarningsSection.js

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CONTENT_WARNINGS = [
  { label: "End-Time Themes", tip: "Topics like plagues, judgment, or Sunday law enforcement." },
  { label: "Spiritual Warfare", tip: "Mentions of demonic deception or the great controversy." },
  { label: "Persecution Accounts", tip: "Martyrdom or religious oppression stories." },
  { label: "Apocalyptic Imagery", tip: "Symbolic beasts, trumpets, or prophetic symbols." },
  { label: "Anatomical/Medical Discussion", tip: "Basic body education including reproductive health." },
  { label: "Mental Health Themes", tip: "Depression, anxiety, or emotional distress in spiritual context." },
  { label: "Addiction & Recovery", tip: "Breaking habits such as substance use or self-control." },
  { label: "Disease & Suffering", tip: "Accounts of illness and God’s healing power." },
  { label: "Self-Harm or Suicide Prevention", tip: "Messages of hope in biblical hopelessness situations." },
  { label: "Violent Biblical Events", tip: "Stories like the flood, crucifixion, or battles." },
  { label: "Sexual Immorality (Biblical Context)", tip: "Sodom, Bathsheba, or Delilah type stories, handled reverently." },
  { label: "Idolatry & Pagan Practices", tip: "False worship, golden calf, or Baal-type content." },
  { label: "Apostasy & Rebellion", tip: "Warnings against spiritual compromise." },
  { label: "Marriage & Courtship Guidance", tip: "Biblical principles of relationships and gender roles." },
  { label: "Discussions of Parenting Failures", tip: "Lessons from Eli, David, or modern parenting fails." },
  { label: "Controversial Cultural Topics", tip: "Sensitive issues like abortion, gender, or family redefinition." },
  { label: "False Doctrines Exposed", tip: "Challenges to error in light of Scripture." },
  { label: "Rebuke and Reformation", tip: "Call to repentance or warnings to the Laodiceans." },
  { label: "Historic Testimonies", tip: "Survivors of persecution, exile, or miracles." },
];

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
    <div className="mb-6 p-4 border rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Content Warnings</h2>
      <p className="text-sm text-gray-600 mb-4">
        Select any thematic elements that viewers should be aware of. These help prepare spiritually sensitive audiences.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CONTENT_WARNINGS.map(({ label, tip }) => {
          const isSelected = selected.includes(label);
          return (
            <label
              key={label}
              className={`flex flex-col border rounded-xl p-3 transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${
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
                <span className={`text-sm ${isSelected ? "font-semibold text-black dark:text-white" : "text-gray-500"}`}>
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
  );
};

export default ContentWarningsSection;