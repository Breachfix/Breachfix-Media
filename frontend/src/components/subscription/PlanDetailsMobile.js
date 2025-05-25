// components/subscription/PlanDetailsMobile.js
"use client";

export default function PlanDetailsMobile({ plans, billingCycle, selectedPlan, setSelectedPlan, isCurrentPlan, getSubscriptionActionLabel, handleSubscribe }) {
  return (
    <div className="md:hidden flex flex-col space-y-6 mt-6">
      {plans.map((plan) => {
        const isCurrent = isCurrentPlan(plan.name);
        const actionLabel = getSubscriptionActionLabel(plan.name);

        return (
          <div
            key={plan.name}
            className={`border ${isCurrent ? "border-yellow-400 bg-yellow-800/20" : "border-gray-700"} rounded-lg p-4 text-center bg-[#1a1a1a]`}
          >
            <div className="text-xl font-semibold mb-1">{plan.name}</div>
            <div className="text-red-500 text-sm mb-3">
              {plan.prices[billingCycle]}
            </div>
            <ul className="text-left text-sm space-y-2 mb-4">
              <li><strong>Video Quality:</strong> {plan.quality}</li>
              <li><strong>Resolution:</strong> {plan.resolution}</li>
              <li><strong>Devices:</strong> {plan.devices}</li>
              <li><strong>Downloads:</strong> {plan.downloads ? "✅" : "❌"}</li>
            </ul>

            <button
              onClick={() => setSelectedPlan(plan.name)}
              className={`w-full px-4 py-2 text-sm rounded transition-all duration-200 ${
                selectedPlan === plan.name ? "bg-green-600 text-white" : "border border-white text-white hover:bg-white hover:text-black"
              }`}
            >
              {selectedPlan === plan.name ? `Details for ${plan.name}` : `Select ${plan.name}`}
            </button>

            {selectedPlan === plan.name && (
              <div className="mt-6 text-left">
                <h2 className="text-lg font-bold mb-2">
                  What you get with the {plan.name} Plan:
                </h2>
                <p className="text-gray-300 italic mb-3">{plan.description}</p>
                <ul className="list-disc ml-5 space-y-1 text-gray-200">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {plan.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="w-full h-48 relative overflow-hidden rounded-lg shadow-md border border-gray-700"
                    >
                      <img
                        src={img}
                        alt={`Visual of ${plan.name} - ${idx + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  {isCurrent ? (
                    <span className="inline-block px-6 py-3 bg-green-700 rounded text-white font-medium transition">
                      You currently have this plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded text-black font-medium transition"
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
