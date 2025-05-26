"use client";

import { Monitor, Download, Smartphone, Users } from "lucide-react";

const reasons = [
  {
    icon: <Monitor className="w-8 h-8 text-white" />,
    title: "Enjoy on your TV",
    description:
      "Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, and more.",
  },
  {
    icon: <Download className="w-8 h-8 text-white" />,
    title: "Download to watch offline",
    description:
      "Save your favorite sermons, series, and kids' shows and watch without internet.",
  },
  {
    icon: <Smartphone className="w-8 h-8 text-white" />,
    title: "Watch everywhere",
    description:
      "Stream BreachFix anywhere: phone, tablet, laptop, or smart TV.",
  },
  {
    icon: <Users className="w-8 h-8 text-white" />,
    title: "Create profiles for kids",
    description:
      "Safe Christian profiles for kids with content curated just for them.",
  },
];

export default function MoreReasonsSection() {
  return (
    <section className="bg-black border-t-8 border-gray-800 py-16 px-6 sm:px-12 lg:px-32 text-white">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-center mb-12">
        More Reasons to Join
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reasons.map((reason, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-lg shadow-xl hover:shadow-2xl transition"
          >
            <div className="flex items-center mb-4">{reason.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
