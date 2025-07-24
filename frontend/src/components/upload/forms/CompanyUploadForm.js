"use client";

import React, { useState } from "react";
import CompanyUploadFormSections from "../sections/CompanyUploadSection";
import { Button } from "@/components/ui/button";
import authenticatedAxios from "@/lib/authenticatedAxios";

const CompanyUploadForm = () => {
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

    const body = new FormData();
    for (const key in form) {
      if (form[key]) {
        body.append(key, form[key]);
      }
    }

    try {
      const res = await authenticatedAxios.post("/companies", body);
      console.log("✅ Company upload response:", res.data);
      // Optionally reset form or redirect
    } catch (err) {
      console.error("❌ Company upload failed:", err);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload Company</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <CompanyUploadFormSections
          form={form}
          setForm={setForm}
          logoPreview={logoPreview}
          setLogoPreview={setLogoPreview}
          handleChange={handleChange}
        />

        <div className="flex justify-end">
          <Button type="submit">Upload Company</Button>
        </div>
      </form>
    </>
  );
};

export default CompanyUploadForm;