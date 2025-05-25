"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthNavbar from "@/components/AuthNavbar";
import { useAuth } from "@/context/AuthContext";
import RequireAuth from "@/components/RequireAuth";
import PlanToggle from "@/components/subscription/PlanToggle";
import PlanComparisonTable from "@/components/subscription/PlanComparisonTable";
import PlanDetailsMobile from "@/components/subscription/PlanDetailsMobile";
import PlanDetailsDesktop from "@/components/subscription/PlanDetailsDesktop";
import HandleCanceledParam from "@/components/subscription/HandleCanceledParam";
import {
  getUserSubscription,
  saveUserSubscription,
  createStripeCheckoutSession,
  updateStripeSubscription,
} from "@/lib/subscriptionManager";

const localPlans = [
  {
    name: "Basic",
    prices: {},
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
      "Christ-centered storytelling to uplift your spirit",
    ],
    images: [
      "/images/basic-1.png",
      "/images/basic-2.png",
      "/images/basic-3.png",
    ],
  },
  {
    name: "Standard",
    prices: {},
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
      "Interactive content to grow spiritually together",
    ],
    images: [
      "/images/standard-1.png",
      "/images/standard-2.png",
      "/images/standard-3.png",
    ],
  },
  {
    name: "Premium",
    prices: {},
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
      "Community prayer and faith tools",
    ],
    images: [
      "/images/premium-1.png",
      "/images/premium-2.png",
      "/images/premium-3.png",
    ],
  },
];

export default function SubscribePage() {
  const [selectedPlan, setSelectedPlan] = useState("Basic");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [userSubscription, setUserSubscription] = useState(null);
  const [canceled, setCanceled] = useState(false);
  const [plans, setPlans] = useState(localPlans);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch("/api/stripe/billing/load-plans");
        const data = await res.json();
        if (data.success) {
          const merged = localPlans.map((local) => {
            const match = data.plans.find((p) => p.name === local.name);
            return {
              ...local,
              name: match?.name || local.name,
              prices: match?.prices || {},
            };
          });
          setPlans(merged);
        }
      } catch (err) {
        console.error("❌ Error loading plans:", err);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    const fetchCurrentSubscription = async () => {
      const userId = user?.id || localStorage.getItem("userId");
      if (!userId) return;

      try {
        const subscription = await getUserSubscription(userId);
        if (subscription.planName) {
          setUserSubscription(subscription.planName);
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

  const handleSubscribe = async (plan) => {
    const priceId = plan.prices[billingCycle]?.id;
    const userId = user?.id;
    if (!userId || !priceId) return;

    try {
      const url = await createStripeCheckoutSession({
        planName: plan.name,
        priceId,
        userId,
        billingCycle,
      });

      if (url) {
        await saveUserSubscription({
          userId,
          planName: plan.name,
          billingCycle,
          stripeCustomerId: "pending",
          stripeSubscriptionId: "pending",
          status: "pending",
        });

        window.location.href = url;
      }
    } catch (error) {
      console.error("❌ Failed to create Stripe session:", error.message);
    }
  };

  const currentPlan = plans.find((p) => p.name === selectedPlan);

  return (
    <RequireAuth>
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
            <HandleCanceledParam setCanceled={setCanceled} />
            <PlanToggle billingCycle={billingCycle} setBillingCycle={setBillingCycle} />
            <PlanComparisonTable
              plans={plans}
              billingCycle={billingCycle}
              isCurrentPlan={isCurrentPlan}
              getSubscriptionActionLabel={getSubscriptionActionLabel}
              handleSubscribe={handleSubscribe}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
            />
            <PlanDetailsMobile
              plans={plans}
              billingCycle={billingCycle}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              isCurrentPlan={isCurrentPlan}
              getSubscriptionActionLabel={getSubscriptionActionLabel}
              handleSubscribe={handleSubscribe}
              canceled={canceled}
            />
            <PlanDetailsDesktop
              plans={plans}
              billingCycle={billingCycle}
              selectedPlan={selectedPlan}
              currentPlan={currentPlan}
              setSelectedPlan={setSelectedPlan}
              isCurrentPlan={isCurrentPlan}
              getSubscriptionActionLabel={getSubscriptionActionLabel}
              handleSubscribe={handleSubscribe}
              canceled={canceled}
            />
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
