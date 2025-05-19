"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function AccountForm({
  showAccountForm,
  formData,
  setFormData,
  handleSave,
}) {
  const pinRefs = useRef([]);

  // Reset PIN focus inputs on open
  useEffect(() => {
    if (showAccountForm) {
      pinRefs.current[0]?.focus();
    }
  }, [showAccountForm]);

  const handlePinChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newPin = formData.pin.split("");
    newPin[index] = value;
    const joined = newPin.join("");
    setFormData({ ...formData, pin: joined });

    if (value && index < 3) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinBackspace = (e, index) => {
    if (e.key === "Backspace" && !formData.pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  return (
    showAccountForm && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[1000] bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center"
      >
        <div className="bg-[#141414] rounded-lg p-8 w-full max-w-md text-white shadow-2xl relative space-y-6">
          <button
            onClick={() =>
              setFormData({ name: "", pin: "" })
            }
            className="absolute top-4 right-4 text-white text-3xl hover:text-gray-400 transition"
            aria-label="Close"
          >
            &times;
          </button>

          <h2 className="text-center text-2xl font-bold tracking-wide">
            Create Profile
          </h2>

          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="Enter your name"
            className="w-full px-5 py-3 rounded-lg bg-[#1f1f1f] placeholder:text-gray-400 text-lg outline-none border border-white focus:ring-2 focus:ring-yellow-400 transition-all"
          />

          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                ref={(el) => (pinRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={formData.pin[index] || ""}
                onChange={(e) => handlePinChange(index, e.target.value)}
                onKeyDown={(e) => handlePinBackspace(e, index)}
                className="w-14 h-14 text-center text-white text-2xl bg-[#1f1f1f] border border-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#e5b109] text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
          >
            Save Profile
          </button>
        </div>
      </motion.div>
    )
  );
}