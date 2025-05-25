// src/app/layout.js
import "./globals.css";
import { Work_Sans, Outfit } from "next/font/google";
import GlobalState from "@/context";
import { AuthProvider } from "@/context/AuthContext";
import SuppressHydrationWarning from "@/components/SuppressHydrationWarning";

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "BreachFix",
  description: "A Christ-centered media platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${workSans.variable} ${outfit.variable}`}>
      <body className="font-sans text-white bg-black">
        {/* Client-only hydration warning suppressor */}
        <div suppressHydrationWarning={true}>
          <AuthProvider>
            <GlobalState>{children}</GlobalState>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}