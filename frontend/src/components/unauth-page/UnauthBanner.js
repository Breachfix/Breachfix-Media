"use client";
import { useRouter } from "next/navigation";

export default function UnauthBanner() {
  const router = useRouter();

  return (
    <div className="relative h-[60vh] sm:h-[30vh] lg:h-[40vh] bg-cover bg-center bg-no-repeat bg-[url('/auth-navbar.jpg')]">
      {/* Gradient overlays by screen size */}

      {/* Full dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/60 to-black/100 z-10" />
      <>
        {/* Mobile: default <640px */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/20 z-10 sm:hidden" />

        {/* Tablet: 640px–1023px */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-transparent z-10 hidden sm:block md:hidden" />

        {/* Desktop: ≥1024px */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10 hidden md:block" />
      </>

      {/* Top fade (subtle) */}
      <div className="absolute top-0 w-full h-10 bg-gradient-to-b from-black to-transparent z-20" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 w-full h-36 bg-gradient-to-t from-black to-transparent z-30" />

      

      {/* Main Content */}
      <div className="relative z-40 h-full flex flex-col justify-center items-center text-center px-4 sm:px-8 space-y-4">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Unlimited faith-based media. <br className="hidden sm:block" />
          <span className="font-light">No compromise.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-xl">
          Watch anywhere. Cancel anytime. Rooted in truth.
        </p>
        <button
          onClick={() => router.push("/auth/signup")}
          className="bg-[#e50914] hover:bg-red-700 px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-lg transition-all"
        >
          Get Started Now
        </button>
      </div>

      {/* Header */}
      <div className="absolute top-0 w-full flex items-center justify-between px-6 sm:px-10 pt-4 z-50">
        <img
          src="/breachfix logo.png"
          alt="Breachfix Media"
          className="w-28 sm:w-36 lg:w-42 cursor-pointer"
          onClick={() => router.push("/")}
        />
        <button
          onClick={() => router.push("/auth/login")}
          className="h-9 px-5 text-white font-medium tracking-wide bg-[#e50914] hover:bg-red-700 rounded-md shadow-md"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}