import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const GenresTagsSection = ({
  form,
  handleChange,
  handleAddGenre,
  handleAddTag,
  handleRemoveItem,
  genreSuggestions,
  tagSuggestions,
  setForm
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-2">Genres & Tags</h3>
      <p className="text-xs text-gray-500 mb-2">
        Use genres to categorize the content (e.g. Prophecy, Family, Faith), and tags for keywords or themes (e.g. youth, Daniel 2, health).
      </p>

      {/* GENRES */}
      <Label>Genres</Label>
      <div className="relative mb-2">
        <div className="flex gap-2">
          <Input
            name="genreInput"
            value={form.genreInput}
            onChange={handleChange}
            list="genre-suggestions"
            placeholder="Type genre and press Add"
            autoComplete="off"
          />
          <Button type="button" onClick={handleAddGenre}>Add</Button>
        </div>
        {form.genreInput && (
          <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded w-full shadow max-h-32 overflow-y-auto mt-1 text-sm">
            {genreSuggestions
              .filter(g => g.toLowerCase().includes(form.genreInput.toLowerCase()))
              .map(g => (
                <li
                  key={g}
                  className="px-3 py-1 hover:bg-blue-100 dark:hover:bg-blue-700 cursor-pointer"
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      genres: [...(prev.genres || []), g],
                      genreInput: ""
                    }))
                  }
                >
                  {g}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(form.genres) ? form.genres : []).map(g => (
          <span key={g} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">
            {g}
            <button type="button" onClick={() => handleRemoveItem("genres", g)}> × </button>
          </span>
        ))}
      </div>

      {/* TAGS */}
      <Label>Tags</Label>
      <div className="relative mb-2">
        <div className="flex gap-2">
          <Input
            name="tagInput"
            value={form.tagInput}
            onChange={handleChange}
            placeholder="Enter keyword and press Add"
            autoComplete="off"
          />
          <Button type="button" onClick={handleAddTag}>Add</Button>
        </div>
        {form.tagInput && (
          <ul className="absolute z-10 bg-white dark:bg-gray-800 border rounded w-full shadow max-h-32 overflow-y-auto mt-1 text-sm">
            {tagSuggestions
              .filter(t => t.toLowerCase().includes(form.tagInput.toLowerCase()))
              .map(t => (
                <li
                  key={t}
                  className="px-3 py-1 hover:bg-green-100 dark:hover:bg-green-700 cursor-pointer"
                  onClick={() =>
                    setForm(prev => ({
                      ...prev,
                      tags: [...(prev.tags || []), t],
                      tagInput: ""
                    }))
                  }
                >
                  {t}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(Array.isArray(form.tags) ? form.tags : []).map(t => (
          <span key={t} className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-sm">
            {t}
            <button type="button" onClick={() => handleRemoveItem("tags", t)}> × </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default GenresTagsSection;