"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Section from "../Section";
import { useRouter } from "next/navigation";
import { fetchAllActors } from "@/lib/api/actors";
import { fetchAllCompanies } from "@/lib/api/companies";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { CONTENT_WARNINGS, ALL_LANGUAGES, GENRES, TAGS, FLATTENED_AGE_RATINGS} from "./constants";

const GeneralInfoSection = ({ form, setForm, setIsActorModalOpen, setIsCompanyModalOpen }) => {
  const [actorOptions, setActorOptions] = useState([]);
  const flatAgeRatingOptions = Object.values(FLATTENED_AGE_RATINGS).flat();
  const [companyOptions, setCompanyOptions] = useState([]);
  const [availableLanguageOptions, setAvailableLanguageOptions] = useState(
    ALL_LANGUAGES.map((lang) => ({ value: lang, label: lang }))
  );
  const [subtitleLanguageOptions, setSubtitleLanguageOptions] = useState(
    ALL_LANGUAGES.map((lang) => ({ value: lang, label: lang }))
  );
 const [contentWarningOptions, setContentWarningOptions] = useState(
  CONTENT_WARNINGS.map((cw) => ({ value: cw.label, label: cw.label, tip: cw.tip }))
  );
  const [genreOptions, setGenreOptions] = useState(
  GENRES.map((g) => ({ value: g, label: g }))
);

const [tagOptions, setTagOptions] = useState(
  TAGS.map((t) => ({ value: t, label: t }))
);

  const router = useRouter();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [actors, companies] = await Promise.all([
          fetchAllActors(),
          fetchAllCompanies(),
        ]);
        setActorOptions(actors || []);
        setCompanyOptions(companies || []);
      } catch (error) {
        console.error("Failed to fetch actor or company list:", error);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleMultiSelectChange = (name) => (selected) => {
    setForm((prev) => ({
      ...prev,
      [name]: selected.map((option) => option.value),
    }));
  };

  return (
    <Section title="General Information">
      <div className="space-y-6 text-black">
        {/* Title */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Title</Label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter media title"
            className="text-black"
          />
        </div>

        {/* Description */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Description</Label>
          <Input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Short description..."
            className="text-black"
          />
        </div>

        {/* Language */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Primary Language</Label>
          <Input
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="e.g. English"
            className="text-black"
          />
        </div>

        {/* Genres */}
<div>
  <Label className="block mb-1 font-semibold text-black">Genres</Label>
  <CreatableSelect
    isMulti
    options={GENRES.map((genre) => ({ value: genre, label: genre }))}
    value={(form.genres || []).map((genre) => ({
      value: genre,
      label: genre,
    }))}
    onChange={(selected, actionMeta) => {
  if (actionMeta.action === "create-option") {
    const newOption = { value: actionMeta.option.value, label: actionMeta.option.label };
    setGenreOptions((prev) => [...prev, newOption]);
  }
  setForm((prev) => ({
    ...prev,
    genres: selected.map((item) => item.value),
  }));
}}
    placeholder="Select or create genres"
  />
</div>

{/* Tags */}
<div>
  <Label className="block mb-1 font-semibold text-black">Tags</Label>
  <CreatableSelect
    isMulti
    options={TAGS.map((tag) => ({ value: tag, label: tag }))}
    value={(form.tags || []).map((tag) => ({
      value: tag,
      label: tag,
    }))}
    onChange={(selected, actionMeta) => {
  if (actionMeta.action === "create-option") {
    const newOption = { value: actionMeta.option.value, label: actionMeta.option.label };
    setGenreOptions((prev) => [...prev, newOption]);
  }
  setForm((prev) => ({
    ...prev,
    tags: selected.map((item) => item.value),
  }));
}}
    placeholder="Select or create tags"
  />
</div>

        {/* Available Languages */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Available Languages</Label>
          <CreatableSelect
            isMulti
            options={availableLanguageOptions}
            value={(form.availableLanguages || []).map((lang) => ({
              value: lang,
              label: lang,
            }))}
            onChange={(selected) => {
              const newLangs = selected.map((item) => item.value);
              setForm((prev) => ({ ...prev, availableLanguages: newLangs }));
              setAvailableLanguageOptions((prev) => {
                const existing = new Set(prev.map((opt) => opt.value));
                return [
                  ...prev,
                  ...newLangs
                    .filter((val) => !existing.has(val))
                    .map((val) => ({ value: val, label: val })),
                ];
              });
            }}
            placeholder="Select or add available audio languages"
          />
        </div>

        {/* Subtitle Languages */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Subtitle Languages</Label>
          <CreatableSelect
            isMulti
            options={subtitleLanguageOptions}
            value={(form.subtitleLanguages || []).map((lang) => ({
              value: lang,
              label: lang,
            }))}
            onChange={(selected) => {
              const newLangs = selected.map((item) => item.value);
              setForm((prev) => ({ ...prev, subtitleLanguages: newLangs }));
              setSubtitleLanguageOptions((prev) => {
                const existing = new Set(prev.map((opt) => opt.value));
                return [
                  ...prev,
                  ...newLangs
                    .filter((val) => !existing.has(val))
                    .map((val) => ({ value: val, label: val })),
                ];
              });
            }}
            placeholder="Select or add subtitle languages"
          />
        </div>

{/* Content Warnings */}
<div>
  <Label className="block mb-1 font-semibold text-black">Content Warnings</Label>
  <CreatableSelect
    isMulti
    options={contentWarningOptions}
    value={(form.contentWarnings || []).map((cw) => ({
      value: cw,
      label: cw,
    }))}
    formatOptionLabel={(option, { context }) => {
      if (context === "menu") {
        return (
          <div>
            <span className="font-semibold text-black">{option.label}</span>
            {option.tip && (
              <div className="text-xs text-gray-500">{option.tip}</div>
            )}
          </div>
        );
      }
      // When selected, only show the label
      return <span>{option.label}</span>;
    }}
    onChange={(selected) => {
      const values = selected.map((item) => item.value);
      setForm((prev) => ({ ...prev, contentWarnings: values }));
      setContentWarningOptions((prev) => {
        const existing = new Set(prev.map((opt) => opt.value));
        return [
          ...prev,
          ...values
            .filter((val) => !existing.has(val))
            .map((val) => ({ value: val, label: val })),
        ];
      });
    }}
    placeholder="Select or add content warnings"
    className="text-black"
    classNamePrefix="react-select"
  />
</div>

        {/* Director */}
        <div>
          <Label className="block mb-1 font-semibold text-black">Director</Label>
          <Input
            name="director"
            value={form.director || ""}
            onChange={handleChange}
            placeholder="e.g. John Smith"
            className="text-black"
          />
        </div>

       {/* Age Rating */}
<div>
  <Label className="block mb-1 font-semibold text-black">Age Rating</Label>
  <CreatableSelect
  isClearable
  options={flatAgeRatingOptions}
  value={
    form.ageRating
      ? {
          value: form.ageRating,
          label:
            flatAgeRatingOptions.find((opt) => opt.value === form.ageRating)?.label ||
            form.ageRating,
        }
      : null
  }
  formatOptionLabel={(e) => (
    <div>
      <div className="font-semibold">{e.label}</div>
      {e.description && (
        <div className="text-xs text-gray-500">{e.description}</div>
      )}
    </div>
  )}
  onChange={(selected) =>
    setForm((prev) => ({
      ...prev,
      ageRating: selected ? selected.value : "",
    }))
  }
  placeholder="Select or type an age rating"
  className="text-black"
  classNamePrefix="react-select"
/>
</div>

        {/* Is Free */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="isFree"
            checked={form.isFree || false}
            onChange={handleChange}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <Label className="text-black">Is Free?</Label>
        </div>

        {/* Actors */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="font-semibold text-black">Actors</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsActorModalOpen(true)}
            >
              + Actor
            </Button>
          </div>
          <Select
            isMulti
            name="actors"
            options={actorOptions.map((actor) => ({
              value: actor._id,
              label: actor.name,
            }))}
            value={actorOptions
              .filter((actor) => form.actors?.includes(actor._id))
              .map((actor) => ({
                value: actor._id,
                label: actor.name,
              }))
            }
            onChange={(selected) => {
              const selectedIds = selected.map((item) => item.value);
              setForm((prev) => ({ ...prev, actors: selectedIds }));
            }}
            className="text-black"
            classNamePrefix="react-select"
            placeholder="Search or select actors..."
          />
          <p className="text-xs text-gray-600 mt-1">
            Search and select multiple actors.
          </p>
        </div>

        {/* Company */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="font-semibold text-black">Company</Label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsCompanyModalOpen(true)}
            >
              + Company
            </Button>
          </div>
          <select
            name="company"
            value={form.company}
            onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md bg-white text-black text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Select a company</option>
            {companyOptions.map((company) => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Section>
  );
};

export default GeneralInfoSection;