// components/upload/sections/PricingSection.js

import React from "react";

const PRICING_OPTIONS = [
  {
    key: "free",
    label: "Free",
    description:
      "Viewers can watch this content at no cost. Ideal for outreach, public messages, or introductory materials.",
  },
  {
    key: "rent",
    label: "Rent",
    description:
      "Viewers pay a one-time fee to access the content for a limited time (e.g. 48 hours).",
  },
  {
    key: "purchase",
    label: "Purchase",
    description:
      "Viewers pay a one-time fee to own lifetime access to this content.",
  },
  {
    key: "subscriptionOnly",
    label: "Subscription Only",
    description:
      "This content is only accessible to users with an active BridgeFix subscription.",
  },
];

const PricingSection = ({ form, setForm }) => {
  const pricing = form || {};

  const toggleOption = (key) => {
    if (key === "subscriptionOnly") {
      setForm({ ...form, subscriptionOnly: !form.subscriptionOnly });
    } else {
      setForm({
        ...form,
        pricingType: form.pricingType === key ? "free" : key,
      });
    }
  };

  const handlePriceChange = (key, value) => {
    setForm({
      ...form,
      [`${key}Price`]: parseFloat(value),
    });
  };

  return (
    <div className="mb-6 p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-900">
      <h2 className="text-xl font-semibold mb-3">💰 Pricing Options</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Choose how viewers can access this content. You may select one main pricing model and optionally restrict it to subscribers.
      </p>

      <div className="space-y-4">
        {PRICING_OPTIONS.map(({ key, label, description }) => {
          const isSelected =
            key === "subscriptionOnly"
              ? form.subscriptionOnly
              : form.pricingType === key;

          return (
            <div
              key={key}
              className={`p-4 border rounded-md cursor-pointer transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900"
                  : "border-gray-300 dark:border-gray-700"
              }`}
              onClick={() => toggleOption(key)}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`font-medium text-md ${
                    isSelected ? "text-blue-800 dark:text-blue-200" : ""
                  }`}
                >
                  {label}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>

              {(key === "rent" || key === "purchase") && isSelected && (
                <div className="mt-3">
                  <label className="text-sm text-gray-700 dark:text-gray-300">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-32 ml-2 p-1 border rounded-md bg-white dark:bg-gray-800"
                    value={form[`${key}Price`] || ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handlePriceChange(key, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingSection;