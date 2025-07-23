import React, { useState } from "react";
import Section from "../Section";
import Dropzone from "../Dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ActorUploadSection = ({ form, setForm, profilePreview, setProfilePreview, handleChange }) => {
  return (
    <>
          {/* Profile Upload */}
      <Section title="Profile Image ">
        <Dropzone
          //label=""
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
      
      {/* General Info */}
      <Section title="Actor Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={form.name || ""}
              onChange={handleChange}
              placeholder="e.g. Walter Veith"
              className="w-full rounded border p-2 text-black"
            />
          </div>
          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input
              type="date"
              name="birthDate"
              value={form.birthDate || ""}
              onChange={handleChange}
              className="w-full rounded border p-2 text-black"
            />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              name="nationality"
              value={form.nationality || ""}
              onChange={handleChange}
              placeholder="e.g. American"
              className="w-full rounded border p-2 text-black"
            />
          </div>
          <div>
            <Label htmlFor="activeYears">Active Years</Label>
            <Input
              name="activeYears"
              value={form.activeYears || ""}
              onChange={handleChange}
              placeholder="e.g. 1990–present"
              className="w-full rounded border p-2 text-black"
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
          className="w-full rounded border p-2 text-black"
        />
      </Section>

      {/* Social Links */}
<Section title="Social & IMDB Links">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div>
      <Label htmlFor="imdbUrl" className="text-black">IMDB URL</Label>
      <Input
        name="imdbUrl"
        value={form.imdbUrl || ""}
        onChange={handleChange}
        placeholder="https://www.imdb.com/name/nm0000243/"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="agentContact" className="text-black">Agent Contact</Label>
      <Input
        name="agentContact"
        value={form.agentContact || ""}
        onChange={handleChange}
        placeholder="Email or phone number"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="instagram" className="text-black">Instagram</Label>
      <Input
        name="instagram"
        value={form.instagram || ""}
        onChange={handleChange}
        placeholder="https://instagram.com/username"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="twitter" className="text-black">Twitter</Label>
      <Input
        name="twitter"
        value={form.twitter || ""}
        onChange={handleChange}
        placeholder="https://twitter.com/username"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="facebook" className="text-black">Facebook</Label>
      <Input
        name="facebook"
        value={form.facebook || ""}
        onChange={handleChange}
        placeholder="https://facebook.com/username"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="tiktok" className="text-black">TikTok</Label>
      <Input
        name="tiktok"
        value={form.tiktok || ""}
        onChange={handleChange}
        placeholder="https://tiktok.com/@username"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="youtube" className="text-black">YouTube</Label>
      <Input
        name="youtube"
        value={form.youtube || ""}
        onChange={handleChange}
        placeholder="https://youtube.com/c/username"
        className="w-full rounded border p-2 text-black"
      />
    </div>
    <div>
      <Label htmlFor="website" className="text-black">Website</Label>
      <Input
        name="website"
        value={form.website || ""}
        onChange={handleChange}
        placeholder="https://www.officialsite.com"
        className="w-full rounded border p-2 text-black"
      />
    </div>
  </div>
</Section>


    </>
  );
};

export default ActorUploadSection;