"use client";

import { useParams } from "next/navigation";
import ContinueWatchingPage from "@/components/ContinueWatchingPage";
import Navbar from "@/components/navbar";
import BackgroundView from "@/components/BackgroundView";

export default function ContinueWatchingRoute() {
  const { uid, accountId } = useParams();

  return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Navbar />
        <BackgroundView>
          <main className="px-6 py-10">
            <ContinueWatchingPage uid={uid} accountId={accountId} />
          </main>
        </BackgroundView>
      </div>
  );
}
