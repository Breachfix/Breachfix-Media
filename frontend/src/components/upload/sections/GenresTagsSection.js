import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Section from "../Section";

const GenresTagsSection = ({
  form,
  handleChange,
  genreSuggestions,
  tagSuggestions,
  setForm
}) => {
  const handleRemoveItem = (type, value) => {
    setForm(prevForm => ({
      ...prevForm,
      [type]: prevForm[type].filter(item => item !== value),
    }));
  };

  const handleAddGenre = () => {
    if (form.genreInput && !form.genres?.includes(form.genreInput)) {
      setForm(prev => ({
        ...prev,
        genres: [...(prev.genres || []), form.genreInput],
        genreInput: ""
      }));
    }
  };

  const handleAddTag = () => {
    if (form.tagInput && !form.tags?.includes(form.tagInput)) {
      setForm(prev => ({
        ...prev,
        tags: [...(prev.tags || []), form.tagInput],
        tagInput: ""
      }));
    }
  };

  return (
    <Section title="Genres & Tags">
    <div className="space-y-4">
      <p className="text-xs text-gray-500 mb-2">
        Use genres to categorize the content (e.g. Prophecy, Family, Faith), and tags for keywords or themes (e.g. youth, Daniel 2, health).
      </p>

      {/* GENRES */}
      <Label className="text-black">Genres</Label>
      <div className="relative mb-2">
        <div className="flex gap-2">
          <Input
            name="genreInput"
            value={form.genreInput || ""}
            onChange={handleChange}
            list="genre-suggestions"
            placeholder="Type genre and press Add"
            autoComplete="off"
            className="text-black"
          />
          <Button type="button" onClick={handleAddGenre}>Add</Button>
        </div>
        {form.genreInput && (
          <ul className="absolute z-10 bg-white border text-black rounded w-full shadow max-h-32 overflow-y-auto mt-1 text-sm">
            {genreSuggestions
              .filter(g => g.toLowerCase().includes(form.genreInput.toLowerCase()))
              .map(g => (
                <li
                  key={g}
                  className="px-3 py-1 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    if (!(form.genres || []).includes(g)) {
                      setForm(prev => ({
                        ...prev,
                        genres: [...(prev.genres || []), g],
                        genreInput: ""
                      }));
                    } else {
                      setForm(prev => ({ ...prev, genreInput: "" }));
                    }
                  }}
                >
                  {g}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(form.genres || []).map(g => (
          <span key={g} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
            {g}
            <button
              type="button"
              className="ml-2 text-red-600 hover:text-red-800 font-bold"
              onClick={() => handleRemoveItem("genres", g)}
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* TAGS */}
      <Label className="text-black">Tags</Label>
      <div className="relative mb-2">
        <div className="flex gap-2">
          <Input
            name="tagInput"
            value={form.tagInput || ""}
            onChange={handleChange}
            placeholder="Enter keyword and press Add"
            autoComplete="off"
            className="text-black"
          />
          <Button type="button" onClick={handleAddTag}>Add</Button>
        </div>
        {form.tagInput && (
          <ul className="absolute z-10 bg-white border text-black rounded w-full shadow max-h-32 overflow-y-auto mt-1 text-sm">
            {tagSuggestions
              .filter(t => t.toLowerCase().includes(form.tagInput.toLowerCase()))
              .map(t => (
                <li
                  key={t}
                  className="px-3 py-1 hover:bg-green-100 cursor-pointer"
                  onClick={() => {
                    if (!(form.tags || []).includes(t)) {
                      setForm(prev => ({
                        ...prev,
                        tags: [...(prev.tags || []), t],
                        tagInput: ""
                      }));
                    } else {
                      setForm(prev => ({ ...prev, tagInput: "" }));
                    }
                  }}
                >
                  {t}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(form.tags || []).map(t => (
          <span key={t} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
            {t}
            <button
              type="button"
              className="ml-2 text-red-600 hover:text-red-800 font-bold"
              onClick={() => handleRemoveItem("tags", t)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
    </Section>
  );
};

export default GenresTagsSection;