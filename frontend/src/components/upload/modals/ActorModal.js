// components/upload/modals/ActorModal.js
import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import ActorUploadSection from "../sections/ActorUploadSection";
import { Button } from "@/components/ui/button";

import {
    uploadMediaFiles,
  safeFinalizeUpload,
} from "@/utils/useUploader";
import { finalizeMediaMetadata } from "@/utils/uploadClient";

const ActorModal = ({ isOpen, onClose, onActorCreated }) => {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    birthDate: "",
    nationality: "",
    activeYears: "",
    imdbUrl: "",
    agentContact: "",
    profileFile: null,
    instagram: "",
    twitter: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    website: "",
  });

  const [profilePreview, setProfilePreview] = useState(null);
  const [loading, setLoading] = useState(false);

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
  setLoading(true);

  try {
    const { profileFile, ...metadata } = form;

    const result = await uploadMediaFiles({
      files: { imageFile: profileFile },
      mediaType: "actor",
      metadata,
    });

    onActorCreated(result);
    onClose();
  } catch (err) {
    console.error("Actor upload failed", err);
    alert("Failed to upload actor.");
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Actor" contentClassName="bg-white text-black">
      <form onSubmit={handleSubmit} className="space-y-6">
        <ActorUploadSection
          form={form}
          setForm={setForm}
          profilePreview={profilePreview}
          setProfilePreview={setProfilePreview}
          handleChange={handleChange}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Actor"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ActorModal;