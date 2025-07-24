"use client";

import React, { useState } from "react";
import ActorUploadFormSections from "../sections/ActorUploadSection";
import { Button } from "@/components/ui/button";
import authenticatedAxios from "@/utils/authenticatedAxios";

const ActorUploadForm = () => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    birthDate: "",
    nationality: "",
    activeYears: "",
    imdbUrl: "",
    agentContact: "",
    profileFile: null,
  });

  const [profilePreview, setProfilePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files?.[0]) {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setProfilePreview(URL.createObjectURL(file));
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
      const res = await authenticatedAxios.post("/actors", body);
      console.log("✅ Actor upload response:", res.data);
      // Optionally reset form or navigate
    } catch (err) {
      console.error("❌ Actor upload failed:", err);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload Actor</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <ActorUploadFormSections
          form={form}
          setForm={setForm}
          profilePreview={profilePreview}
          setProfilePreview={setProfilePreview}
          handleChange={handleChange}
        />

        <div className="flex justify-end">
          <Button type="submit">Upload Actor</Button>
        </div>
      </form>
    </>
  );
};

export default ActorUploadForm;