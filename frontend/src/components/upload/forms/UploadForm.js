import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { uploadMediaFiles } from "@/utils/useUploader";
import { finalizeUpload } from "@/utils/uploadClient";

import GeneralInfoSection from "../sections/GeneralInfoSection";
import GenresTagsSection from "../sections/GenresTagsSection";
import LanguagesSection from "../sections/LanguagesSection";
import ContentWarningsSection from "../sections/ContentWarningsSection";
import MediaUploadSection from "../sections/MediaUploadSection";
import PricingSection from "../sections/PricingSection";
import MovieMetadataSection from "../metadata/MovieMetadataSection";
import TvShowMetadataSection from "../metadata/TvShowMetadataSection";
import EpisodeMetadataSection from "../metadata/EpisodeMetadataSection";

const ALL_GENRES = [
  "Prophecy", "Bible", "Faith", "Healing", "Education", "Youth", "Science",
  "History", "Health", "Music", "Nature", "Family", "Creation", "Sabbath",
  "Salvation", "End Times", "Reformation", "Spirituality", "Testimonies",
  "Missionary", "Adventist", "Kids", "Documentary", "Sermon", "Drama"
];

const UploadForm = ({ contentType }) => {
  const [genreSuggestions, setGenreSuggestions] = useState(ALL_GENRES);
  const [tvShows, setTvShows] = useState([]);

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
    genres: [],
    tags: [],
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
    newAvailableLang: "",
    newSubtitleLang: "",
    newContentWarning: "",
    contentWarnings: []
  });

  const [posterPreview, setPosterPreview] = useState(null);
  const [trailerPreview, setTrailerPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (contentType === "episode") {
      fetch("http://localhost:7001/api/v3/media/tvshows")
        .then((res) => res.json())
        .then((data) => setTvShows(data));
    }
  }, [contentType]);

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      if (trailerPreview) URL.revokeObjectURL(trailerPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, [name]: file }));

      // Set preview based on field name
      if (name === "posterFile") setPosterPreview(previewUrl);
      if (name === "trailerFile") setTrailerPreview(previewUrl);
      if (name === "videoFile") setVideoPreview(previewUrl);
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);

      const fileKeys = await uploadMediaFiles({
        files: {
          posterFile: form.posterFile,
          trailerFile: form.trailerFile,
          videoFile: form.videoFile
        },
        mediaType: contentType
      });

      const pricing = {
        type: form.pricingType,
        purchasePrice: parseFloat(form.purchasePrice),
        rentalPrice: parseFloat(form.rentalPrice),
        subscriptionOnly: form.subscriptionOnly
      };

      const normalizeArray = (input) => {
  if (Array.isArray(input)) return input;
  if (typeof input === "string") return input.split(",").map((item) => item.trim());
  return [];
};

const payload = {
  ...form,
  ...fileKeys,
  pricing,
  actors: normalizeArray(form.actors),
  tags: normalizeArray(form.tags),
};

      

      await finalizeUpload(contentType, payload);
      alert(`${contentType} uploaded successfully!`);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

return (
  <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Upload {contentType.charAt(0).toUpperCase() + contentType.slice(1)}
      </h1>

       <MediaUploadSection
        form={form}
        setForm={setForm}
        posterPreview={posterPreview}
        setPosterPreview={setPosterPreview}
        trailerPreview={trailerPreview}
        setTrailerPreview={setTrailerPreview}
        videoPreview={videoPreview}
        setVideoPreview={setVideoPreview}
        handleChange={handleChange}
      />

      <GeneralInfoSection form={form} setForm={setForm} />

      {/* <GenresTagsSection
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        genreSuggestions={genreSuggestions}
        tagSuggestions={[]}
      /> */}

      {/* <LanguagesSection form={form} setForm={setForm} handleChange={handleChange} /> */}

      {/* <ContentWarningsSection form={form} setForm={setForm} handleChange={handleChange} /> */}

      {contentType === "movie" && (
        <MovieMetadataSection form={form} setForm={setForm} handleChange={handleChange} />
      )}

      {contentType === "tv-show" && (
        <TvShowMetadataSection form={form} setForm={setForm} handleChange={handleChange} />
      )}

      {contentType === "episode" && (
        <EpisodeMetadataSection
          form={form}
          setForm={setForm}
          tvShows={tvShows}
          handleChange={handleChange}
        />
      )}



      <PricingSection form={form} setForm={setForm} handleChange={handleChange} />

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={uploading}
          className="px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
        >
          {uploading ? "Uploading..." : `Upload ${contentType}`}
        </Button>
      </div>
    {/* </div> */}
  </div>
);}
export default UploadForm;