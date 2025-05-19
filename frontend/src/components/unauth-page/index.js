"use client";

import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Footer from "@/components/footer";

const questions = [
  {
    ques: "What is BreachFix?",
    ans: `BreachFix is a Christ-centered streaming platform built to offer a safe, uplifting alternative to mainstream media. Inspired by Isaiah 58:12, it's designed to repair the spiritual breach in our homes, minds, and media habits. This is BreachFix Media — part of a bigger vision that also includes health, education, and spiritual life.`,
  },
  {
    ques: "Why was BreachFix created?",
    ans: `We saw the growing need for a place where Christians — families, creators, and seekers — can find clean, inspiring, Bible-aligned content without compromise. BreachFix was created to be a safe haven in a world of increasing censorship. It’s built to work even without internet — for those moments when online access is blocked, restricted, or simply unavailable.`,
  },
  {
    ques: "How much does BreachFix cost?",
    ans: `Right now, it's completely free. Yes — free. In the future, we may offer premium content or support options to help sustain the mission. But the goal is always to keep BreachFix as accessible and Christ-centered as possible.`,
  },
  {
    ques: "What can I watch on BreachFix?",
    ans: `From powerful sermons and spiritual documentaries to family-friendly films, animations, and uplifting series — everything on BreachFix is chosen to elevate your life and reflect biblical values.`,
  },
  {
    ques: "How do I cancel?",
    ans: `There’s no subscription to cancel right now. Simply log out. If we introduce subscriptions in the future, we’ll make cancellation just as easy — no hidden contracts or tricks.`,
  },
  {
    ques: "Is BreachFix good for kids?",
    ans: `Absolutely. BreachFix is a safe space for kids to watch content that’s Bible-based, uplifting, and free from harmful messages. If you love what the Bible teaches, you’ll love what your kids experience here.`,
  },
  {
    ques: "Will BreachFix stay free forever?",
    ans: `We hope so — but to grow and offer more, we may offer optional paid features or memberships. Think of it as supporting a ministry. But access to core content will always aim to remain free and open.`,
  },
  {
    ques: "Is BreachFix only for media?",
    ans: `Right now, yes — this is BreachFix Media. But BreachFix is a bigger movement. We’re dreaming of BreachFix Health, BreachFix Wealth, BreachFix Education, and even BreachFix Spiritual — all rooted in biblical restoration.`,
  },
  {
    ques: "What does 'BreachFix' mean?",
    ans: `"BreachFix" comes from Isaiah 58:12 — 'repairers of the breach.' Our goal is to fix the gaps in culture, faith, and lifestyle through Christ-centered tools, beginning with what we watch.`,
  },
];

function UnauthBanner({ router }) {
  return (
    <div className="h-[80vh] bg-cover bg-no-repeat bg-center bg-[url('https://firebasestorage.googleapis.com/v0/b/joyful-a1987.appspot.com/o/epic%20sign%20in%20pic.svg?alt=media&token=b0a767e1-6933-4720-aed1-dc4af9895d67')] border-b-8 border-gray-800">
      <div className="bg-black bg-opacity-70 h-full">
        <div className="flex items-center justify-between px-6 sm:px-10 pt-4">
          <img
            src="/breachfix logo.png"
            alt="Breachfix Media"
            className="w-28 sm:w-36 lg:w-52 cursor-pointer"
            onClick={() => router.push("/")}
          />
          <button
            onClick={() => router.push("/auth/login")}
            className="h-9 px-5 text-white font-medium tracking-wide bg-[#e50914] hover:bg-red-700 rounded-md shadow-md"
          >
            Sign In
          </button>
        </div>

        <div className="h-full flex flex-col items-center justify-center text-white text-center space-y-6 px-4 sm:px-8">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-light leading-tight">
            Unlimited faith-based media. No compromise.
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light">
            Watch anywhere. Cancel anytime. Rooted in truth.
          </h2>
          <button
            onClick={() => router.push("/auth/signup")}
            className="bg-red-600 hover:bg-[#e50914] px-6 py-3 rounded-lg text-white text-lg font-medium shadow-lg transition-all"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}


export default function UnauthPage() {
  const router = useRouter();
  const [showCurrentAns, setShowCurrentAns] = useState(null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <main className="bg-black min-h-screen font-sans">
        <UnauthBanner router={router} />

        <div className="border-b-8 border-gray-800 py-12 px-6 sm:px-14 md:px-28 lg:px-48 xl:px-80 text-white">
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mb-10">
            Frequently Asked Questions
          </h1>

          <div className="flex flex-col space-y-4">
            {questions.map((item, index) => (
              <div key={index} className="bg-[#303030] rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setShowCurrentAns(showCurrentAns === index ? null : index)
                  }
                  className="w-full text-left flex justify-between items-center px-5 py-4 font-light text-lg sm:text-xl hover:bg-[#3a3a3a] transition-all tracking-wide"
                >
                  <span>{item.ques}</span>
                  <PlusIcon className="h-6 w-6 text-white" />
                </button>
                {showCurrentAns === index && (
                  <div className="px-5 py-4 text-gray-300 border-t border-gray-700 text-base sm:text-lg leading-relaxed font-light">
                    {item.ans}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Footer />
      </main>
    </motion.div>
  );
}
