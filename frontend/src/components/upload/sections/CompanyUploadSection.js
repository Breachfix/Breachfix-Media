import React from "react";
import Section from "../Section";
import Dropzone from "../Dropzone";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CompanyUploadSection = ({
  form,
  setForm,
  logoPreview,
  setLogoPreview,
  handleChange,
}) => {
  return (
    <>
      {/* Company Logo Upload */}
      <Section title="Company Logo">
        <Dropzone
          label="Logo"
          name="logoFile"
          accept="image/*"
          previewUrl={logoPreview}
          onChange={handleChange}
          onClear={() => {
            if (logoPreview) URL.revokeObjectURL(logoPreview);
            setLogoPreview(null);
            setForm((prev) => ({ ...prev, logoFile: null }));
          }}
        />
      </Section>

      {/* Company Info */}
      <Section title="Company Details">
        <Label htmlFor="name" className="text-black">Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="e.g. BridgeFix Studios"
          className="mb-4 text-black"
        />

        <Label htmlFor="description" className="text-black">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Brief background of the company"
          className="mb-4 text-black"
        />

        <Label htmlFor="location" className="text-black">Location</Label>
        <Input
          id="location"
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="City, Country"
          className="mb-4 text-black"
        />

        <Label htmlFor="foundedDate" className="text-black">Founded Date</Label>
        <Input
          id="foundedDate"
          name="foundedDate"
          type="date"
          value={form.foundedDate || ""}
          onChange={handleChange}
          className="mb-4 text-black"
        />

        <Label htmlFor="websiteUrl" className="text-black">Website</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          value={form.websiteUrl || ""}
          onChange={handleChange}
          placeholder="https://..."
          className="mb-4 text-black"
        />

        <Label htmlFor="contactEmail" className="text-black">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          value={form.contactEmail || ""}
          onChange={handleChange}
          placeholder="info@company.com"
          className="mb-4 text-black"
        />
      </Section>

      {/* Social Media */}
      <Section title="Social Media Links">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagram" className="text-black">Instagram</Label>
            <Input
              name="instagram"
              value={form.instagram || ""}
              onChange={handleChange}
              placeholder="https://instagram.com/company"
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="twitter" className="text-black">Twitter</Label>
            <Input
              name="twitter"
              value={form.twitter || ""}
              onChange={handleChange}
              placeholder="https://twitter.com/company"
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="facebook" className="text-black">Facebook</Label>
            <Input
              name="facebook"
              value={form.facebook || ""}
              onChange={handleChange}
              placeholder="https://facebook.com/company"
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="linkedin" className="text-black">LinkedIn</Label>
            <Input
              name="linkedin"
              value={form.linkedin || ""}
              onChange={handleChange}
              placeholder="https://linkedin.com/company/..."
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="youtube" className="text-black">YouTube</Label>
            <Input
              name="youtube"
              value={form.youtube || ""}
              onChange={handleChange}
              placeholder="https://youtube.com/@company"
              className="text-black"
            />
          </div>
          <div>
            <Label htmlFor="tiktok" className="text-black">TikTok</Label>
            <Input
              name="tiktok"
              value={form.tiktok || ""}
              onChange={handleChange}
              placeholder="https://tiktok.com/@company"
              className="text-black"
            />
          </div>
        </div>
      </Section>
    </>
  );
};

export default CompanyUploadSection;