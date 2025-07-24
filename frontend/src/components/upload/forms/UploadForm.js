"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { uploadMediaFiles, safeFinalizeUpload } from "@/utils/useUploader";
import { fetchFromApi } from "@/utils/apiClient";

import GeneralInfoSection from "../sections/GeneralInfoSection";
import MediaUploadSection from "../sections/MediaUploadSection";
import PricingSection from "../sections/PricingSection";
import MovieMetadataSection from "../metadata/MovieMetadataSection";
import TvShowMetadataSection from "../metadata/TvShowMetadataSection";
import EpisodeMetadataSection from "../metadata/EpisodeMetadataSection";
import ActorModal from "../modals/ActorModal";
import CompanyModal from "../modals/CompanyModal";

const ALL_GENRES = [
  "Prophecy", "Bible", "Faith", "Healing", "Education", "Youth", "Science",
  "History", "Health", "Music", "Nature", "Family", "Creation", "Sabbath",
  "Salvation", "End Times", "Reformation", "Spirituality", "Testimonies",
  "Missionary", "Adventist", "Kids", "Documentary", "Sermon", "Drama"
];

const UploadForm = ({ contentType }) => {
  const [genreSuggestions] = useState(ALL_GENRES);
  const [tvShows, setTvShows] = useState([]);
  const [isActorModalOpen, setIsActorModalOpen] = useState(false);
  const [actorOptions, setActorOptions] = useState([]);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [companyOptions, setCompanyOptions] = useState([]);

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
  const DRAFT_KEY = `draftUploadForm-${contentType}`;

  useEffect(() => {
    if (contentType === "episode") {
      fetchFromApi("/media/tvshows")
        .then((data) => setTvShows(data))
        .catch((err) => console.error("Failed to fetch TV shows:", err));
    }
  }, [contentType]);

  useEffect(() => {
    const savedForm = localStorage.getItem(DRAFT_KEY);
    if (savedForm) {
      setForm(JSON.parse(savedForm));
    }
  }, [contentType]);

  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      if (trailerPreview) URL.revokeObjectURL(trailerPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, []);

  const handleActorCreated = (newActor) => {
    setActorOptions((prev) => [...prev, newActor]);
    setForm((prev) => ({
      ...prev,
      actors: [...(prev.actors || []), newActor._id],
    }));
  };

  const handleCompanyCreated = (newCompany) => {
    setCompanyOptions((prev) => [...prev, newCompany]);
    setForm((prev) => ({
      ...prev,
      company: newCompany._id,
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (!file) return;

      const previewUrl = URL.createObjectURL(file);
      setForm((prev) => ({ ...prev, [name]: file }));

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
      localStorage.removeItem(DRAFT_KEY);

      const ensureArray = (val) => Array.isArray(val) ? val : [];
      const normalizeArray = (input) => {
        if (Array.isArray(input)) return input;
        if (typeof input === "string") return input.split(",").map((item) => item.trim());
        return [];
      };

      const {
        genreInput,
        tagInput,
        newAvailableLang,
        newSubtitleLang,
        newContentWarning,
        ...cleanForm
      } = form;

      const pricing = {
        type: form.pricingType,
        purchasePrice: parseFloat(form.purchasePrice),
        rentalPrice: parseFloat(form.rentalPrice),
        subscriptionOnly: form.subscriptionOnly,
      };

      const metadata = {
        ...cleanForm,
        pricing,
        actors: normalizeArray(form.actors),
        tags: normalizeArray(form.tags),
        genres: ensureArray(form.genres),
        availableLanguages: ensureArray(form.availableLanguages),
        subtitleLanguages: ensureArray(form.subtitleLanguages),
        contentWarnings: ensureArray(form.contentWarnings),
      };

      const result = await uploadMediaFiles({
        files: {
          posterFile: form.posterFile,
          trailerFile: form.trailerFile,
          videoFile: form.videoFile,
        },
        mediaType: contentType,
        metadata,
      });

      const id = result?._id || result?.id;
      if (!id) throw new Error("❌ Failed to retrieve ID from saved content");

      const { posterFileS3Key, trailerFileS3Key, videoFileS3Key } = result;

      if (posterFileS3Key) {
        await safeFinalizeUpload(posterFileS3Key, id, contentType, "poster", form.tvShowId, form.seasonNumber);
      }
      if (trailerFileS3Key) {
        await safeFinalizeUpload(trailerFileS3Key, id, contentType, "trailer", form.tvShowId, form.seasonNumber);
      }
      if (videoFileS3Key) {
        await safeFinalizeUpload(videoFileS3Key, id, contentType, "video", form.tvShowId, form.seasonNumber);
      }

      alert(`${contentType} uploaded and finalized successfully!`);
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

      <GeneralInfoSection
        form={form}
        setForm={setForm}
        setIsActorModalOpen={setIsActorModalOpen}
        setIsCompanyModalOpen={setIsCompanyModalOpen}
      />

      <ActorModal
        isOpen={isActorModalOpen}
        onClose={() => setIsActorModalOpen(false)}
        onActorCreated={handleActorCreated}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        onCompanyCreated={handleCompanyCreated}
      />

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
    </div>
  );
};

export default UploadForm;