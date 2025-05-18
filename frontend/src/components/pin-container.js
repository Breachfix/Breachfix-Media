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
      <div className="z-[100] bg-[#141414] flex-col min-h-screen absolute left-0 top-0 justify-center flex items-center right-0">
        <span
          onClick={() => {
            setShowPinContainer({ show: false, account: null });
            setPin("");
            setPinError(false);
            setDigits(["", "", "", ""]);
          }}
          className="cursor-pointer absolute top-[50px] right-[40px] text-white"
        >
          &#10005;
        </span>

        <h1 className="text-gray-400 font-bold text-[16px] mb-4">
          Profile Lock is currently ON
        </h1>

        <h2 className={`font-bold text-[30px] mb-6 ${pinError ? "text-[#e6b209]" : "text-white"}`}>
          {pinError ? "Whoops, wrong PIN. Please try again" : "Enter your PIN to access this profile"}
        </h2>

        <div className="flex gap-3">
          {[0, 1, 2, 3].map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              className="text-center text-white bg-[#222] border border-white rounded w-[60px] h-[60px] text-2xl"
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
