"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function MembersBanner() {
  const router = useRouter();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-black py-10 px-4 sm:px-8 md:px-12"
    >
      <div className="max-w-4xl mx-auto relative bg-gradient-to-r from-[#1e1c3b] to-[#0f0e1f] rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center gap-4 text-white">
        {/* Popcorn Icon */}
        <div className="absolute -top-10 left-6 sm:left-8 drop-shadow-xl">
          <Image
            src="/bible.png" // ✅ Replace with your image path
            alt="Popcorn"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>

        <div className="flex-1 mt-4 md:mt-0 md:ml-20">
          <p className="text-lg sm:text-xl font-semibold">
            The <span className="text-yellow-400">BreachFix</span> you love for just{" "}
            <span className="text-pink-400">$0</span>.
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Get our most affordable, ad-free, truth-based plan.
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={() => router.push("/subscribe")}
            className="bg-[#333] hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-md transition"
          >
            Learn More
          </button>
        </div>
      </div>
    </motion.section>
  );
}