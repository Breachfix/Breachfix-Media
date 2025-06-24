import React, { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Convert .heic to .jpg if needed
const maybeConvert = async (file) => {
  if (file.name.toLowerCase().endsWith(".heic") || file.type === "image/heic") {
    try {
      const heic2any = (await import("heic2any")).default;
      const outputBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        worker: false,
      });
      return new File([outputBlob], file.name.replace(/\.heic$/i, ".jpg"), {
        type: "image/jpeg",
      });
    } catch (err) {
      console.error("HEIC conversion failed:", err);
      return file;
    }
  }
  return file;
};

const Dropzone = ({ label, name, onChange, previewUrl, accept, onClear }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const converted = await maybeConvert(file);
      onChange({ target: { name, type: "file", files: [converted] } });
    }
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const converted = await maybeConvert(file);
    onChange({ target: { name, type: "file", files: [converted] } });
    e.target.value = "";
  };

  const handleClear = () => {
    if (videoRef.current) videoRef.current.pause();
    onClear?.();
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const renderPreview = () => {
    if (!previewUrl) return null;

    if (previewUrl.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)) {
      return (
        <div className="relative mt-2 w-40 mx-auto">
          <img src={previewUrl} alt="Preview" className="rounded" />
          <Button
            type="button"
            variant="destructive"
            className="absolute top-0 right-0 text-xs px-1 py-0.5"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            ✕
          </Button>
        </div>
      );
    }

    if (previewUrl.match(/\.(mp4|mov|webm|mkv|avi)$/i)) {
      return (
        <div className="relative mt-2">
          <video
            ref={videoRef}
            src={previewUrl}
            className="mx-auto mt-2 w-60 rounded"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls
          />
          <div className="mt-2 flex justify-center gap-2">
            <Button type="button" onClick={(e) => { e.stopPropagation(); togglePlay(); }}>
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </Button>
            <Button type="button" onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                alert(`Duration: ${Math.round(videoRef.current.duration)} sec`);
              }
            }}>
              ⏱ Duration
            </Button>
            <Button type="button" variant="destructive" onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}>
              🗑 Remove
            </Button>
          </div>
        </div>
      );
    }

    // Fallback for unsupported types (e.g. .pdf, .html)
    return (
      <div className="mt-2 text-sm text-gray-600">
        <p>📄 File selected: <strong>{previewUrl.split("/").pop()}</strong></p>
        <Button variant="destructive" onClick={handleClear} className="mt-2">
          🗑 Remove
        </Button>
      </div>
    );
  };

  return (
    <div className="mb-4">
      <Label>{label}</Label>

      <div
        className="border border-dashed rounded-lg p-4 text-center cursor-pointer bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 relative"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(`input-${name}`).click()}
      >
        <p className="text-sm text-gray-500">Drag & drop or click to upload</p>
        {renderPreview()}
      </div>

      <Input
        id={`input-${name}`}
        name={name}
        type="file"
        accept={accept || "*/*"}
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};

export default Dropzone;