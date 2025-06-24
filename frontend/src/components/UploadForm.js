import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadMediaFiles } from "@/utils/useUploader";
import { finalizeUpload } from "@/utils/uploadClient";

const Section = ({ title, children }) => (
  <div className="border rounded-xl p-4 space-y-4 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    {children}
  </div>
);
const LANGUAGES = [
  "English", "French", "Spanish", "German", "Portuguese",
  "Swahili", "Arabic", "Hindi", "Mandarin", "Zulu"
];
const GENRES = [
  "Prophecy", "Bible", "Faith", "Healing", "Family", "Creation",
  "EndTime", "Truth", "Witness", "Health", "Discipleship",
  "Testimony", "Sabbath", "Hope", "Love"
];

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




const UploadForm = ({ contentType }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    language: "English",
    company: "",
    actors: "",
    isFree: false,
    releaseDate: "",
    duration: "",
    ageRating: "",
    rating: "",
    genres: "",
    tags: "",
    tvShowId: "",
    seasonNumber: "",
    episodeNumber: "",
    releaseCountry: "",
    premiereDate: "",
    posterFile: null,
    trailerFile: null,
    videoFile: null,
    pricingType: "free",
    purchasePrice: 0,
    rentalPrice: 0,
    subscriptionOnly: false,
    availableLanguages: [],
    subtitleLanguages: [],
    genreInput: "",
    tagInput: "",
  });

  const [uploading, setUploading] = useState(false);
  const [tvShows, setTvShows] = useState([]);
  const [posterPreview, setPosterPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);
  const videoRef = useRef(null);
  const [genreSuggestions, setGenreSuggestions] = useState(GENRES);
  const [tagSuggestions, setTagSuggestions] = useState([]);

  useEffect(() => {
    if (contentType === "episode") {
      fetch("http://localhost:7001/api/v3/media/tvshows")
        .then(res => res.json())
        .then(data => setTvShows(data));
    }
  }, [contentType]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setForm(prev => ({ ...prev, [name]: file }));
      if (name === "posterFile") setPosterPreview(URL.createObjectURL(file));
      if (name === "trailerFile") setTrailerPreview(URL.createObjectURL(file));
      if (name === "videoFile") {
        const videoURL = URL.createObjectURL(file);
        const tempVideo = document.createElement("video");
        tempVideo.preload = "metadata";
        tempVideo.src = videoURL;
        tempVideo.onloadedmetadata = () => {
          const durationInSeconds = tempVideo.duration;
          const durationInMinutes = Math.round(durationInSeconds / 60);
          setForm(prev => ({ ...prev, duration: durationInMinutes.toString() }));
        };
      }}else if (type === "checkbox" && name.startsWith("lang_")) {
      const lang = name.split("_")[1];
      const target = value;
      const targetKey = target === "available" ? "availableLanguages" : "subtitleLanguages";
      setForm(prev => {
        const current = new Set(prev[targetKey]);
        if (checked) current.add(lang);
        else current.delete(lang);
        return { ...prev, [targetKey]: Array.from(current) };
      });
    } else if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
const Dropzone = ({ label, name, onChange, previewUrl, accept, onClear }) => {
  const videoRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (!accept || file.type.startsWith(accept))) {
      onChange({ target: { name, type: "file", files: [file] } });
    }
  };

  const handleClear = () => {
    onChange({ target: { name, type: "file", files: [] } });
    if (videoRef.current) videoRef.current.pause();
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleFileInput = (e) => onChange(e);
  const [isPlaying, setIsPlaying] = useState(false);

const togglePlay = () => {
  if (!videoRef.current) return;
  if (videoRef.current.paused) {
    videoRef.current.play();
  } else {
    videoRef.current.pause();
  }
};

  return (
    <div className="mb-4">
      <Label>{label}</Label>
      <div
        className="border border-dashed rounded-lg p-4 text-center cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById(`input-${name}`).click()}
      >
        <p className="text-sm text-gray-500">Drag & drop or click to upload</p>

        {previewUrl && accept === "image/" && (
          <div className="relative mt-2 w-40 mx-auto">
            <img src={previewUrl} alt="Preview" className="rounded" />
            <Button
              type="button"
              variant="destructive"
              className="absolute top-0 right-0 text-xs px-1 py-0.5"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ✕
            </Button>
          </div>
        )}

        {previewUrl && accept === "video/" && (
          <div className="relative mt-2">
            <video
  ref={videoRef}
  src={previewUrl}
  className="mx-auto mt-2 w-60 rounded"
  onClick={togglePlay}
  onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
/>
            <div className="mt-2 flex justify-center gap-2">
              <Button type="button" onClick={(e) => { e.stopPropagation(); videoRef.current?.play(); }}>▶️ Play</Button>
              <Button type="button" onClick={(e) => { e.stopPropagation(); videoRef.current?.pause(); }}>⏸️ Pause</Button>
              <Button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (videoRef.current) {
                    alert(`Video Duration: ${Math.round(videoRef.current.duration)} sec`);
                  }
                }}
              >
                ⏱ Duration
              </Button>
              <Button
  type="button"
  variant="destructive"
  onClick={(e) => {
    e.stopPropagation();
    onClear?.();  // Call the proper clearing function
  }}
>
  🗑 Remove
</Button>
            </div>
          </div>
        )}
      </div>

      <Input
        id={`input-${name}`}
        name={name}
        type="file"
        accept={accept + "*"}
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};

const handleAddGenre = () => {
  if (form.genreInput && !form.genres.includes(form.genreInput)) {
    setForm(prev => ({
      ...prev,
      genres: [...(prev.genres || []), form.genreInput],
      genreInput: ""
    }));
    if (!genreSuggestions.includes(form.genreInput)) {
      setGenreSuggestions(prev => [...prev, form.genreInput]);
    }
  }
};

const handleAddTag = () => {
  if (form.tagInput && !form.tags.includes(form.tagInput)) {
    setForm(prev => ({
      ...prev,
      tags: [...(prev.tags || []), form.tagInput],
      tagInput: ""
    }));
    if (!tagSuggestions.includes(form.tagInput)) {
      setTagSuggestions(prev => [...prev, form.tagInput]);
    }
  }
};

  const handleRemoveItem = (type, item) => {
    setForm(prev => ({ ...prev, [type]: (prev[type] || []).filter(i => i !== item) }));
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      const fileKeys = await uploadMediaFiles({
        files: {
          posterFile: form.posterFile,
          trailerFile: form.trailerFile,
          videoFile: form.videoFile,
        },
        mediaType: contentType,
      });

      const pricing = {
        type: form.pricingType,
        purchasePrice: parseFloat(form.purchasePrice),
        rentalPrice: parseFloat(form.rentalPrice),
        subscriptionOnly: form.subscriptionOnly,
      };

      const payload = {
        ...form,
        ...fileKeys,
        pricing,
        actors: form.actors.split(",").map(id => id.trim()),
        
        tags: form.tags.split(",").map(t => t.trim()),
      };

      await finalizeUpload(contentType, payload);
      alert(`${contentType} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white dark:bg-black text-black dark:text-white">
      <Section title="General Info">
        <Label>Title</Label>
        <Input name="title" value={form.title} onChange={handleChange} />

        <Label>Description</Label>
        <Textarea name="description" value={form.description} onChange={handleChange} />

        <Label>Language</Label>
        <Input name="language" value={form.language} onChange={handleChange} />

        <Label>Actors (IDs comma-separated)</Label>
        <Input name="actors" value={form.actors} onChange={handleChange} />

        <Label>Company ID</Label>
        <Input name="company" value={form.company} onChange={handleChange} />

        <Label>Is Free?</Label>
        <Input type="checkbox" name="isFree" checked={form.isFree} onChange={handleChange} />
      </Section>



<Section title="Genres & Tags">
  <p className="text-xs text-gray-500 mb-2">
    Use genres to categorize the content (e.g. Prophecy, Family, Faith), and tags for keywords or themes (e.g. youth, Daniel 2, health).
  </p>

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
              onClick={() => setForm(prev => ({ ...prev, genres: [...(prev.genres || []), g], genreInput: "" }))}
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
        {g} <button type="button" onClick={() => handleRemoveItem("genres", g)}>×</button>
      </span>
    ))}
  </div>

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
              onClick={() => setForm(prev => ({ ...prev, tags: [...(prev.tags || []), t], tagInput: "" }))}
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
        {t} <button type="button" onClick={() => handleRemoveItem("tags", t)}>×</button>
      </span>
    ))}
  </div>
</Section>


<Section title="Available Languages">
  <p className="text-xs text-gray-500 mb-2">
    Select the languages this content could be made available in (e.g., dubbed or translated). These do not necessarily exist yet but indicate intended availability — including possible AI translation support in future.
  </p>
  <div className="grid grid-cols-2 gap-2 text-sm text-black dark:text-white">
    {LANGUAGES.map(lang => (
      <label key={`avail-${lang}`} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={form.availableLanguages.includes(lang)}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm((prev) => {
              const updated = new Set(prev.availableLanguages || []);
              checked ? updated.add(lang) : updated.delete(lang);
              return { ...prev, availableLanguages: Array.from(updated) };
            });
          }}
        />
        <span>{lang}</span>
      </label>
    ))}
  </div>
  <div className="mt-2 flex gap-2">
    <Input
      placeholder="Add custom language..."
      value={form.newAvailableLang || ''}
      onChange={(e) => setForm(prev => ({ ...prev, newAvailableLang: e.target.value }))}
    />
    <Button
      type="button"
      onClick={() => {
        if (form.newAvailableLang && !form.availableLanguages.includes(form.newAvailableLang)) {
          setForm(prev => ({
            ...prev,
            availableLanguages: [...prev.availableLanguages, form.newAvailableLang],
            newAvailableLang: ''
          }));
        }
      }}
    >
      Add
    </Button>
  </div>
</Section>

<Section title="Subtitle Languages">
  <p className="text-xs text-gray-500 mb-2">
    These are languages in which subtitle tracks may be provided, either manually or via future AI-assisted transcription/translation.
  </p>
  <div className="grid grid-cols-2 gap-2 text-sm text-black dark:text-white">
    {LANGUAGES.map(lang => (
      <label key={`sub-${lang}`} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
        <input
          type="checkbox"
          checked={form.subtitleLanguages.includes(lang)}
          onChange={(e) => {
            const checked = e.target.checked;
            setForm((prev) => {
              const updated = new Set(prev.subtitleLanguages || []);
              checked ? updated.add(lang) : updated.delete(lang);
              return { ...prev, subtitleLanguages: Array.from(updated) };
            });
          }}
        />
        <span>{lang}</span>
      </label>
    ))}
  </div>
  <div className="mt-2 flex gap-2">
    <Input
      placeholder="Add custom subtitle language..."
      value={form.newSubtitleLang || ''}
      onChange={(e) => setForm(prev => ({ ...prev, newSubtitleLang: e.target.value }))}
    />
    <Button
      type="button"
      onClick={() => {
        if (form.newSubtitleLang && !form.subtitleLanguages.includes(form.newSubtitleLang)) {
          setForm(prev => ({
            ...prev,
            subtitleLanguages: [...prev.subtitleLanguages, form.newSubtitleLang],
            newSubtitleLang: ''
          }));
        }
      }}
    >
      Add
    </Button>
  </div>
</Section>

<Section title="Content Warnings">
  <p className="text-xs text-gray-500 mb-2">
    Check any thematic elements that viewers should be aware of. You may also add a custom warning if needed.
  </p>
  <div className="grid grid-cols-2 gap-4">
    {CONTENT_WARNINGS.map(({ label, tip }) => {
      const isChecked = form.contentWarnings?.includes(label);
      return (
        <label
          key={label}
          className={`flex flex-col border rounded-xl p-3 transition-all duration-200 shadow-sm cursor-pointer hover:shadow-md bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 ${
            isChecked ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900' : ''
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="contentWarnings"
                value={label}
                checked={isChecked}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setForm(prev => {
                    const current = new Set(prev.contentWarnings || []);
                    if (checked) current.add(label);
                    else current.delete(label);
                    return { ...prev, contentWarnings: Array.from(current) };
                  });
                }}
                className="accent-blue-600"
              />
              <span className={`text-sm ${
                isChecked ? 'font-semibold text-black dark:text-white' : 'text-gray-500'
              }`}>
                {label}
              </span>
            </div>
          </div>
          {isChecked && (
            <p className="mt-2 text-xs text-gray-700 dark:text-gray-300 leading-snug">
              {tip}
            </p>
          )}
        </label>
      );
    })}
  </div>
  <div className="mt-4 flex gap-2">
    <Input
      placeholder="Add custom content warning..."
      value={form.newContentWarning || ''}
      onChange={(e) => setForm(prev => ({ ...prev, newContentWarning: e.target.value }))}
    />
    <Button
      type="button"
      onClick={() => {
        if (form.newContentWarning && !form.contentWarnings.includes(form.newContentWarning)) {
          setForm(prev => ({
            ...prev,
            contentWarnings: [...prev.contentWarnings, form.newContentWarning],
            newContentWarning: ''
          }));
        }
      }}
    >
      Add
    </Button>
  </div>
</Section>


    <Section title="Media Upload">
<Dropzone
  label="Poster"
  name="posterFile"
  onChange={handleChange}
  previewUrl={posterPreview}
  accept="image/"
  onClear={() => {
    setForm(prev => ({ ...prev, posterFile: null }));
    setPosterPreview(null);
  }}
/>

<Dropzone
  label="Trailer"
  name="trailerFile"
  onChange={handleChange}
  previewUrl={trailerPreview}
  accept="video/"
  onClear={() => {
    setForm(prev => ({ ...prev, trailerFile: null }));
    setTrailerPreview(null);
  }}
/>

<Dropzone
  label="Video"
  name="videoFile"
  onChange={handleChange}
  previewUrl={form.videoFile ? URL.createObjectURL(form.videoFile) : null}
  accept="video/"
  onClear={() => {
    setForm(prev => ({ ...prev, videoFile: null }));
  }}
/>
</Section>

      <Section title="Pricing">
        <Label>Pricing Type</Label>
        <select name="pricingType" value={form.pricingType} onChange={handleChange}>
          <option value="free">Free</option>
          <option value="rental">Rental</option>
          <option value="purchase">Purchase</option>
          <option value="subscription">Subscription</option>
        </select>

        {(form.pricingType === "rental" || form.pricingType === "purchase") && (
          <>
            <Label>Purchase Price</Label>
            <Input name="purchasePrice" type="number" value={form.purchasePrice} onChange={handleChange} />

            <Label>Rental Price</Label>
            <Input name="rentalPrice" type="number" value={form.rentalPrice} onChange={handleChange} />
          </>
        )}

        {form.pricingType === "subscription" && (
          <>
            <Label>Subscription Only?</Label>
            <Input type="checkbox" name="subscriptionOnly" checked={form.subscriptionOnly} onChange={handleChange} />
          </>
        )}
      </Section>

      {contentType === "movie" && (
        <Section title="Movie Metadata">
          <Label>Release Date</Label>
          <Input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} />

          <Label>Premiere Date</Label>
          <Input name="premiereDate" type="date" value={form.premiereDate} onChange={handleChange} />

          <Label>Duration (min)</Label>
          <Input name="duration" value={form.duration} onChange={handleChange} />

          <Label>Tags (comma-separated)</Label>
          <Input name="tags" value={form.tags} onChange={handleChange} />

          <Label>Content Warnings</Label>
          <Input name="contentWarnings" value={form.contentWarnings} onChange={handleChange} />
        </Section>
      )}

      {contentType === "tv-show" && (
        <Section title="TV Show Metadata">
          <Label>Genres (comma-separated)</Label>
          <Input name="genres" value={form.genres} onChange={handleChange} />

          <Label>Rating</Label>
          <Input name="rating" value={form.rating} onChange={handleChange} />
        </Section>
      )}

      {contentType === "episode" && (
        <Section title="Episode Metadata">
          <Label>TV Show</Label>
          <select name="tvShowId" value={form.tvShowId} onChange={handleChange}>
            <option value="">Select TV Show</option>
            {tvShows.map(show => (
              <option key={show._id} value={show._id}>{show.title}</option>
            ))}
          </select>

          <Label>Season Number</Label>
          <Input name="seasonNumber" value={form.seasonNumber} onChange={handleChange} />

          <Label>Episode Number</Label>
          <Input name="episodeNumber" value={form.episodeNumber} onChange={handleChange} />

          <Label>Release Date</Label>
          <Input name="releaseDate" type="date" value={form.releaseDate} onChange={handleChange} />

          <Label>Duration</Label>
          <Input name="duration" value={form.duration} onChange={handleChange} />
        </Section>
      )}

      <Button onClick={handleSubmit} disabled={uploading}>
        {uploading ? "Uploading..." : `Upload ${contentType}`}
      </Button>
    </div>
  );
};

export default UploadForm;