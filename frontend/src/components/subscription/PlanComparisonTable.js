// components/subscription/PlanComparisonTable.js
"use client";
import React from "react";
export default function PlanComparisonTable({ plans, billingCycle, isCurrentPlan, getSubscriptionActionLabel, handleSubscribe, selectedPlan, setSelectedPlan }) {
  return (
    <div className="hidden md:grid grid-cols-4 gap-4 text-center text-sm sm:text-base">
      <div className="text-left text-gray-400 font-semibold">Features</div>
      {plans.map((plan) => {
        const isCurrent = isCurrentPlan(plan.name);
        return (
          <div
            key={plan.name}
            className={`font-semibold ${isCurrent ? "bg-yellow-900/30 rounded-lg border border-yellow-400" : ""}`}
          >
            <div>{plan.name}</div>
            <div className="text-red-500 text-sm">
              {plan.prices[billingCycle]}
            </div>
          </div>
        );
      })}

      {["Video Quality", "Resolution", "Devices", "Downloads"].map((feature) => (
        <React.Fragment key={feature}>
          <div className="text-left text-gray-400 font-medium">{feature}</div>
          {plans.map((plan) => (
            <div 
            key={`${plan.name}-${feature}`} 
            className={isCurrentPlan(plan.name) ? "bg-yellow-900/20 rounded" : ""}>
              {feature === "Downloads" ? (plan.downloads ? "✅" : "❌") : feature === "Video Quality" ? plan.quality : plan[feature.toLowerCase()]}
            </div>
          ))}
        </React.Fragment>
      ))}

      <div></div>
      {plans.map((plan) => {
        const isCurrent = isCurrentPlan(plan.name);
        const actionLabel = getSubscriptionActionLabel(plan.name);

        return (
          <div key={plan.name} className="space-y-2">
            {isCurrent ? (
              <button className="px-4 py-2 text-sm bg-green-700 text-white rounded cursor-default">
                You currently have this plan
              </button>
            ) : (
              <>
                
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full px-4 py-2 text-sm rounded transition-all duration-200 ${
                    selectedPlan === plan.name ? "bg-green-600 text-white" : "border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {selectedPlan === plan.name ? `Details for ${plan.name}` : `Select ${plan.name}`}
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}