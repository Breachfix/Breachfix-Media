// components/subscription/DetailsDesktop.js
"use client";

export default function DetailsDesktop({ selectedPlan, currentPlan, isCurrentPlan, getSubscriptionActionLabel, handleSubscribe, canceled }) {
  if (!selectedPlan || !currentPlan) return null;

  return (
    <div className="hidden md:block mt-16 p-6 bg-[#1a1a1a] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2">
        What you get with the {currentPlan.name} Plan:
      </h2>
      <p className="text-gray-300 mb-4 italic">{currentPlan.description}</p>
      <ul className="list-disc ml-5 space-y-1 text-gray-200">
        {currentPlan.features.map((feature, idx) => (
          <li key={idx}>{feature}</li>
        ))}
      </ul>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {currentPlan.images.map((img, idx) => (
          <div
            key={idx}
            className="w-full h-64 relative overflow-hidden rounded-lg shadow-md border border-gray-700"
          >
            <img
              src={img}
              alt={`Visual of ${currentPlan.name} - ${idx + 1}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        {isCurrentPlan(currentPlan.name) ? (
          <button
            className="px-6 py-3 bg-green-700 text-white font-semibold rounded cursor-default"
            disabled
          >
            You currently have this plan
          </button>
        ) : (
          <button
            onClick={() => handleSubscribe(currentPlan)}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded transition"
          >
            {getSubscriptionActionLabel(currentPlan.name)}
          </button>
        )}
      </div>

      {canceled && (
        <div className="bg-yellow-600 text-black text-center py-2 mb-4 rounded mt-4">
          ❌ You canceled the payment. No charges were made.
        </div>
      )}
    </div>
  );
}
