// components/subscription/PlanToggle.js
"use client";
export default function PlanToggle({ billingCycle, setBillingCycle }) {
  return (
    <div className="flex justify-center mb-8">
      <button
        onClick={() => setBillingCycle("monthly")}
        className={`px-4 py-2 rounded-l ${
          billingCycle === "monthly" ? "bg-red-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        Monthly
      </button>
      <button
        onClick={() => setBillingCycle("yearly")}
        className={`px-4 py-2 rounded-r ${
          billingCycle === "yearly" ? "bg-red-600 text-white" : "bg-gray-700 text-white"
        }`}
      >
        Yearly
      </button>
    </div>
  );
}