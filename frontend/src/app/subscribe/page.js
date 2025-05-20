"use client";

import { useEffect, useState } from "react";
import AuthNavbar from "@/components/AuthNavbar";
import { useAuth } from "@/context/AuthContext";

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("Basic");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [userSubscription, setUserSubscription] = useState(null);
  const { user } = useAuth();

  // ✅ MOVE THIS ⬇️ TO THE TOP (before using it in JSX or other logic)
  const plans = [
    {
      name: "Basic",
      prices: { monthly: "$5", yearly: "$50" },
      quality: "Good",
      resolution: "480p",
      devices: "1",
      downloads: false,
      description: `Perfect for individuals seeking faith-based content on a single device.`,
      features: [
        "480p streaming quality",
        "Watch on 1 device",
        "Access to sermons, kids content, devotionals",
        "Safe environment, no ads or profanity",
        "Christ-centered storytelling to uplift your spirit"
      ],
      images: [
        "/images/basic-1.png",
        "/images/basic-2.png",
        "/images/basic-3.png"
      ]
    },
    {
      name: "Standard",
      prices: { monthly: "$10", yearly: "$100" },
      quality: "Better",
      resolution: "720p",
      devices: "2",
      downloads: true,
      description: `Ideal for couples or families.`,
      features: [
        "720p streaming quality",
        "Watch on 2 devices",
        "Download to watch offline",
        "Early access to upcoming series",
        "Interactive content to grow spiritually together"
      ],
      images: [
        "/images/standard-1.png",
        "/images/standard-2.png",
        "/images/standard-3.png"
      ]
    },
    {
      name: "Premium",
      prices: { monthly: "$15", yearly: "$150" },
      quality: "Best",
      resolution: "1080p + 4K",
      devices: "4",
      downloads: true,
      description: `Great for households, ministries, or groups.`,
      features: [
        "4K Ultra HD streaming",
        "Up to 4 profiles/devices",
        "Full offline library access",
        "Exclusive Christian series and documentaries",
        "Family devotions, study series, gospel-based recovery resources",
        "Community prayer and faith tools"
      ],
      images: [
        "/images/premium-1.png",
        "/images/premium-2.png",
        "/images/premium-3.png"
      ]
    },
  ];

  // ✅ Now this works fine
  const currentPlan = plans.find((p) => p.name === selectedPlan);

  useEffect(() => {
  const fetchCurrentSubscription = async () => {
    const userId = user?.id || localStorage.getItem("userId");

    if (!userId) return;

    try {
      const res = await fetch("/api/subscription/get-user-subscription", {
        headers: {
          "x-user-id": userId,
        },
      });

      const data = await res.json();
      console.log("📦 subscription data:", data);

      if (data.success && data.planName) {
        setUserSubscription(data.planName);
      } else {
        console.warn("⚠️ No valid subscription found.");
      }
    } catch (err) {
      console.error("❌ Error fetching subscription:", err);
    }
  };

  fetchCurrentSubscription();
}, [user?.id]);

  const isCurrentPlan = (planName) => userSubscription === planName;

  const getSubscriptionActionLabel = (planName) => {
    if (!userSubscription) return "Subscribe to this plan";

    const rank = ["Basic", "Standard", "Premium"];
    const currentIndex = rank.indexOf(userSubscription);
    const planIndex = rank.indexOf(planName);

    if (currentIndex === planIndex) return "You currently have this plan";
    if (planIndex > currentIndex) return "Upgrade to this plan";
    return "Downgrade to this plan";
  };

  const stripePriceIds = {
    Basic: {
      monthly: process.env.NEXT_PUBLIC_PRICE_BASIC_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_PRICE_BASIC_YEARLY,
    },
    Standard: {
      monthly: process.env.NEXT_PUBLIC_PRICE_STANDARD_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_PRICE_STANDARD_YEARLY,
    },
    Premium: {
      monthly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_MONTHLY,
      yearly: process.env.NEXT_PUBLIC_PRICE_PREMIUM_YEARLY,
    },
  };

  const handleSubscribe = async (plan) => {
    const priceId = stripePriceIds[plan.name][billingCycle];
    const userId = user?.id;

    if (!userId || !priceId) {
      console.error("❌ Missing userId or priceId", { userId, priceId });
      return;
    }

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName: plan.name,
          priceId,
          userId,
          billingCycle,
        }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error("❌ Failed to get redirect URL", data);
      }
    } catch (error) {
      console.error("❌ Subscription error:", error);
    }
  };


  return (
    <div
      className="min-h-screen text-white font-sans bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/auth-navbar.jpg')` }}
    >
      <div className="bg-black bg-opacity-80 min-h-screen">
        <AuthNavbar />

        <div className="px-4 py-10 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-3">Choose your plan</h1>
          <p className="text-center text-gray-300 mb-6">
            Watch unlimited faith-based videos. Cancel anytime.
          </p>

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

          {/* Desktop View */}
          {/* Desktop View */}
<div className="hidden md:grid grid-cols-4 gap-4 text-center text-sm sm:text-base">
  <div className="text-left text-gray-400 font-semibold">Features</div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    return (
      <div
        key={plan.name}
        className={`font-semibold ${
          isCurrent ? "bg-yellow-900/30 rounded-lg border border-yellow-400" : ""
        }`}
      >
        <div>{plan.name}</div>
        <div className="text-red-500 text-sm">
          {plan.prices[billingCycle]}/{billingCycle}
        </div>
      </div>
    );
  })}
</div>

<div className="hidden md:grid grid-cols-4 gap-4 mt-4 text-center">
  <div className="text-left text-gray-400 font-medium">Video Quality</div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    return (
      <div key={plan.name} className={isCurrent ? "bg-yellow-900/20 rounded" : ""}>
        {plan.quality}
      </div>
    );
  })}

  <div className="text-left text-gray-400 font-medium">Resolution</div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    return (
      <div key={plan.name} className={isCurrent ? "bg-yellow-900/20 rounded" : ""}>
        {plan.resolution}
      </div>
    );
  })}

  <div className="text-left text-gray-400 font-medium">Devices</div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    return (
      <div key={plan.name} className={isCurrent ? "bg-yellow-900/20 rounded" : ""}>
        {plan.devices}
      </div>
    );
  })}

  <div className="text-left text-gray-400 font-medium">Downloads</div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    return (
      <div key={plan.name} className={isCurrent ? "bg-yellow-900/20 rounded" : ""}>
        {plan.downloads ? "✅" : "❌"}
      </div>
    );
  })}

  <div></div>
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    const actionLabel = getSubscriptionActionLabel(plan.name);

    return (
      <div key={plan.name}>
        {isCurrent ? (
          <button className="mt-2 px-4 py-2 text-sm bg-green-700 text-white rounded cursor-default">
            You currently have this plan
          </button>
        ) : (
          <button
            onClick={() => handleSubscribe(plan)}
            className="mt-2 px-4 py-2 text-sm bg-yellow-500 hover:bg-yellow-600 text-black rounded"
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  })}
</div>

          <div className="hidden md:grid grid-cols-4 gap-4 mt-4 text-center">
            <div className="text-left text-gray-400 font-medium">Video Quality</div>
            {plans.map((plan) => <div key={plan.name}>{plan.quality}</div>)}
            <div className="text-left text-gray-400 font-medium">Resolution</div>
            {plans.map((plan) => <div key={plan.name}>{plan.resolution}</div>)}
            <div className="text-left text-gray-400 font-medium">Devices</div>
            {plans.map((plan) => <div key={plan.name}>{plan.devices}</div>)}
            <div className="text-left text-gray-400 font-medium">Downloads</div>
            {plans.map((plan) => <div key={plan.name}>{plan.downloads ? "✅" : "❌"}</div>)}
            <div></div>
            {plans.map((plan) => (
              <div key={plan.name}>
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`mt-2 px-4 py-2 text-sm rounded transition-all duration-200 ${
                    selectedPlan === plan.name
                      ? "bg-red-600 text-white"
                      : "border border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {selectedPlan === plan.name ? `Details for ${plan.name}` : `Select ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

       
          {/* Mobile View */}
<div className="md:hidden flex flex-col space-y-6 mt-6">
  {plans.map((plan) => {
    const isCurrent = isCurrentPlan(plan.name);
    const actionLabel = getSubscriptionActionLabel(plan.name);

    return (
      <div
        key={plan.name}
        className={`border ${
          isCurrent ? "border-yellow-400 bg-yellow-800/20" : "border-gray-700"
        } rounded-lg p-4 text-center bg-[#1a1a1a]`}
      >
        <div className="text-xl font-semibold mb-1">{plan.name}</div>
        <div className="text-red-500 text-sm mb-3">
          {plan.prices[billingCycle]}/{billingCycle}
        </div>
        <ul className="text-left text-sm space-y-2 mb-4">
          <li>
            <strong>Video Quality:</strong> {plan.quality}
          </li>
          <li>
            <strong>Resolution:</strong> {plan.resolution}
          </li>
          <li>
            <strong>Devices:</strong> {plan.devices}
          </li>
          <li>
            <strong>Downloads:</strong> {plan.downloads ? "✅" : "❌"}
          </li>
        </ul>

        <button
          onClick={() => setSelectedPlan(plan.name)}
          className={`w-full px-4 py-2 text-sm rounded transition-all duration-200 ${
            selectedPlan === plan.name
              ? "bg-red-600 text-white"
              : "border border-white text-white hover:bg-white hover:text-black"
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

          {/* Desktop Plan Detail */}
          {selectedPlan && currentPlan && (
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
  </div>
)}
        </div>
      </div>
    </div>
  );
}