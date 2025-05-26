// Suggested new UnauthPage layout with Netflix-style enhancements

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import UnauthBanner from "./UnauthBanner";
import FAQSection from "./FAQs";
import TrendingNow from "./trendingNow";
import MoreReasonsToJoin from "./moreReasonsToJoin";
import MembershipBanner from "./membersBanner";
import Footer from "@/components/footer";

export default function UnauthPage() {
  const router = useRouter();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <main className="bg-black min-h-screen font-sans">
        <UnauthBanner router={router} />

        <MembershipBanner />
        <TrendingNow />
        <MoreReasonsToJoin />
        <FAQSection />

        <Footer />
      </main>
    </motion.div>
  );
}
