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

      <Section title="Company Details">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="e.g. BridgeFix Studios"
          className="mb-4"
        />

        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={form.description || ""}
          onChange={handleChange}
          placeholder="Brief background of the company"
          className="mb-4"
        />

        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={form.location || ""}
          onChange={handleChange}
          placeholder="City, Country"
          className="mb-4"
        />

        <Label htmlFor="foundedDate">Founded Date</Label>
        <Input
          id="foundedDate"
          name="foundedDate"
          type="date"
          value={form.foundedDate || ""}
          onChange={handleChange}
          className="mb-4"
        />

        <Label htmlFor="websiteUrl">Website</Label>
        <Input
          id="websiteUrl"
          name="websiteUrl"
          value={form.websiteUrl || ""}
          onChange={handleChange}
          placeholder="https://..."
          className="mb-4"
        />

        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          value={form.contactEmail || ""}
          onChange={handleChange}
          placeholder="info@company.com"
        />
      </Section>
    </>
  );
};

export default CompanyUploadSection;