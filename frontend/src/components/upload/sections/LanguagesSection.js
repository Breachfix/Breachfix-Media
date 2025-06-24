// components/upload/sections/LanguageSection.js

import React from "react";

const ALL_LANGUAGES = [
  "English", "French", "Spanish", "German", "Portuguese",
  "Swahili", "Arabic", "Hindi", "Mandarin", "Zulu"
];

const LanguageSection = ({ form, setForm }) => {
  const selectedAvailable = form.availableLanguages || [];
  const selectedSubtitles = form.subtitleLanguages || [];

  const toggleSelection = (type, value) => {
    const current = type === "availableLanguages" ? selectedAvailable : selectedSubtitles;
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    setForm({
      ...form,
      [type]: updated,
    });
  };

  const renderOptions = (type, title, description) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {ALL_LANGUAGES.map((lang) => {
          const isSelected =
            type === "availableLanguages"
              ? selectedAvailable.includes(lang)
              : selectedSubtitles.includes(lang);

          return (
            <div
              key={lang}
              onClick={() => toggleSelection(type, lang)}
              className={`cursor-pointer px-4 py-2 rounded-md border text-center transition-all duration-200 ${
                isSelected ? "bg-blue-50 dark:bg-blue-800 border-blue-600 font-bold text-black dark:text-white" : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300"
              }`}
            >
              {lang}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="mb-6 p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-3">Languages & Subtitles</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Choosing the right language options ensures viewers can experience your content in their preferred way. This section also helps prepare for future support like AI dubbing and subtitle generation.
      </p>

      {renderOptions(
        "availableLanguages",
        "Available Languages",
        "Select the spoken languages featured in this content. This affects how the audio is labeled and helps us plan for AI voice generation in the future."
      )}

      {renderOptions(
        "subtitleLanguages",
        "Available Subtitles",
        "Select the subtitle languages already available or planned. This will assist with accessibility and allow AI to auto-sync captions in future versions."
      )}
    </div>
  );
};

export default LanguageSection;
