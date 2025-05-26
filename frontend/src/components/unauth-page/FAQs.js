"use client";

import { useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const questions = [
  {
    ques: "What is BreachFix?",
    ans: `BreachFix is a Christ-centered streaming platform built to offer a safe, uplifting alternative to mainstream media. Inspired by Isaiah 58:12, it's designed to repair the spiritual breach in our homes, minds, and media habits.`,
  },
  {
    ques: "Why was BreachFix created?",
    ans: `We saw the growing need for a place where Christians can find clean, inspiring, Bible-aligned content without compromise. It's built to work even without internet — for moments when access is blocked or unavailable.`,
  },
  {
    ques: "How much does BreachFix cost?",
    ans: `Right now, it's completely free. We may offer premium content or support options in the future to sustain the mission.`,
  },
  {
    ques: "What can I watch on BreachFix?",
    ans: `From sermons and documentaries to family-friendly films and animations — everything is chosen to reflect biblical values.`,
  },
  {
    ques: "Is BreachFix good for kids?",
    ans: `Absolutely. BreachFix is a safe space for kids to watch content that’s Bible-based, uplifting, and free from harmful messages.`,
  },
  {
    ques: "Will BreachFix stay free forever?",
    ans: `We hope so. Optional paid features might come, but access to core content will aim to remain free and open.`,
  },
  {
    ques: "What does 'BreachFix' mean?",
    ans: `"BreachFix" comes from Isaiah 58:12 — 'repairers of the breach.' Our goal is to fix cultural, faith, and lifestyle gaps through Christ-centered tools.`,
  },
];

export default function FrequentlyAskedQuestions() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="border-t-8 border-gray-800 bg-black text-white py-12 px-6 sm:px-14 md:px-28 lg:px-48 xl:px-80">
      <h2 className="text-center text-3xl sm:text-4xl md:text-5xl font-light mb-10">
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col space-y-4">
        {questions.map((item, index) => (
          <div key={index} className="bg-[#303030] rounded-lg overflow-hidden">
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full text-left flex justify-between items-center px-5 py-4 font-light text-lg sm:text-xl hover:bg-[#3a3a3a] transition-all tracking-wide"
            >
              <span>{item.ques}</span>
              <PlusIcon className="h-6 w-6 text-white" />
            </button>
            {activeIndex === index && (
              <div className="px-5 py-4 text-gray-300 border-t border-gray-700 text-base sm:text-lg leading-relaxed font-light">
                {item.ans}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}