// components/upload/modals/CompanyModal.js
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import CompanyUploadFormSections from "../sections/CompanyUploadSection";
import { Button } from "@/components/ui/button";

import { uploadMediaFiles } from "@/utils/useUploader";

const CompanyModal = ({ isOpen, onClose, onCompanyCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    foundedDate: "",
    location: "",
    logoFile: null,
    websiteUrl: "",
    contactEmail: "",
  });

  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { logoFile, ...metadata } = form;

      const result = await uploadMediaFiles({
        files: { imageFile: logoFile },
        mediaType: "company",
        metadata,
      });

      onCompanyCreated(result);
      onClose();
    } catch (err) {
      console.error("Company upload failed", err);
      alert("Failed to upload company.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Company" contentClassName="bg-white text-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanyUploadFormSections
          form={form}
          setForm={setForm}
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          handleChange={handleChange}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Company"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CompanyModal;