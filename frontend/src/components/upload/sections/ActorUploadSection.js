// components/upload/sections/ActorUploadForm.jsx

import React, { useState } from "react";
import Section from "../Section";
import Dropzone from "../Dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ActorUploadSection = ({ form, setForm, profilePreview, setProfilePreview, handleChange }) => {
  return (
    <>
      {/* General Info */}
      <Section title="Actor Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="e.g. Denzel Washington"
            />
          </div>
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              type="date"
              name="birthDate"
              value={form.birthDate || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              name="nationality"
              value={form.nationality || ""}
              onChange={handleChange}
              placeholder="e.g. American"
            />
          </div>
          <div>
            <Label htmlFor="activeYears">Active Years</Label>
            <Input
              name="activeYears"
              value={form.activeYears || ""}
              onChange={handleChange}
              placeholder="e.g. 1990–present"
            />
          </div>
        </div>
      </Section>

      {/* Bio */}
      <Section title="Biography">
        <textarea
          name="bio"
          rows="5"
          value={form.bio || ""}
          onChange={handleChange}
          placeholder="Short biography..."
          className="w-full rounded border p-2"
        />
      </Section>

      {/* Social Links */}
      <Section title="Social & IMDB">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="imdbUrl">IMDB URL</Label>
            <Input
              name="imdbUrl"
              value={form.imdbUrl || ""}
              onChange={handleChange}
              placeholder="https://www.imdb.com/name/nm0000243/"
            />
          </div>
          <div>
            <Label htmlFor="agentContact">Agent Contact</Label>
            <Input
              name="agentContact"
              value={form.agentContact || ""}
              onChange={handleChange}
              placeholder="Email or phone number"
            />
          </div>
        </div>
      </Section>

      {/* Profile Upload */}
      <Section title="Profile Image">
        <Dropzone
          label="Profile Image"
          name="profileFile"
          onChange={handleChange}
          previewUrl={profilePreview}
          accept="image/*"
          onClear={() => {
            if (profilePreview) URL.revokeObjectURL(profilePreview);
            setProfilePreview(null);
            setForm(prev => ({ ...prev, profileFile: null }));
          }}
        />
      </Section>
    </>
  );
};

export default ActorUploadSection; 