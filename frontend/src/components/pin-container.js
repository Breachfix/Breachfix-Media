"use client";

import { useRef, useEffect, useState } from "react";

export default function PinContainer({
  showPinContainer,
  pinError,
  setShowPinContainer,
  handlePinSubmit,
  setPinError,
  pin,
  setPin,
}) {
  const inputsRef = useRef([]);
  const [digits, setDigits] = useState(["", "", "", ""]);

  useEffect(() => {
    setDigits(["", "", "", ""]);
  }, [showPinContainer]);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    setPin(newDigits.join(""));

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (pin.length === 4) {
      handlePinSubmit(pin);
    }
  }, [pin]);


  return (
    showPinContainer && (
      <div className="z-[1000] fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300">
        <button
          onClick={() => {
            setShowPinContainer({ show: false, account: null });
            setPin("");
            setPinError(false);
            setDigits(["", "", "", ""]);
          }}
          className="absolute top-6 right-6 text-white text-3xl hover:text-gray-300 transition"
          aria-label="Close PIN Prompt"
        >
          &times;
        </button>

        <h1 className="text-gray-400 font-bold text-base sm:text-lg mb-4 tracking-wide">
          Profile Lock is ON
        </h1>

        <h2
          className={`text-center font-semibold text-2xl sm:text-3xl md:text-4xl mb-8 px-4 ${
            pinError ? "text-[#e6b109]" : "text-white"
          }`}
        >
          {pinError ? "Whoops, wrong PIN. Try again." : "Enter your PIN to access this profile"}
        </h2>

        <div className="flex gap-4">
          {[0, 1, 2, 3].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="w-16 h-16 text-center text-white text-3xl bg-[#1f1f1f] border border-white rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              value={digits[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
      </div>
    )
  );
}


