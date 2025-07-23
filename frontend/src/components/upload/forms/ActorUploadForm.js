import React, { useState } from "react";
import ActorUploadFormSections from "../sections/ActorUploadSection";
import { Button } from "@/components/ui/button";

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
      setForm(prev => ({ ...prev, [name]: file }));
      setProfilePreview(URL.createObjectURL(file));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
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

    const res = await fetch("http://localhost:7001/api/v3/actors", {
      method: "POST",
      body,
    });

    const data = await res.json();
    console.log("Actor upload response:", data);
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