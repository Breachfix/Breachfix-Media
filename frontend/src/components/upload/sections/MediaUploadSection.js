 // components/upload/sections/MediaUploadSection.js

import React from "react";
import Section from "../Section";
import Dropzone from "../Dropzone";

const MediaUploadSection = ({
  form,
  setForm,
  posterPreview,
  setPosterPreview,
  trailerPreview,
  setTrailerPreview,
  videoPreview,
  setVideoPreview,
  handleChange
}) => {
  return (
    <Section title="Media Upload">
      <Dropzone
        label="Poster"
        name="posterFile"
        onChange={handleChange}
        previewUrl={posterPreview}
        accept="image/*"
        onClear={() => {
          if (posterPreview) URL.revokeObjectURL(posterPreview);
          setPosterPreview(null);
          setForm(prev => ({ ...prev, posterFile: null }));
        }}
      />

      <Dropzone
        label="Trailer"
        name="trailerFile"
        onChange={handleChange}
        previewUrl={trailerPreview}
        accept="video/*"
        onClear={() => {
          if (trailerPreview) URL.revokeObjectURL(trailerPreview);
          setTrailerPreview(null);
          setForm(prev => ({ ...prev, trailerFile: null }));
        }}
      />

      <Dropzone
        label="Video"
        name="videoFile"
        onChange={handleChange}
        previewUrl={videoPreview}
        accept="video/*"
        onClear={() => {
          if (videoPreview) URL.revokeObjectURL(videoPreview);
          setVideoPreview(null);
          setForm(prev => ({ ...prev, videoFile: null }));
        }}
      />
    </Section>
  );
};

export default MediaUploadSection;