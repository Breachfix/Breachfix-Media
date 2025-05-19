// layout.js
import "./globals.css";
import { Work_Sans, Outfit } from "next/font/google";
import GlobalState from "@/context";
import { AuthProvider } from "@/context/AuthContext";



// Load Work Sans (main font)
const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-work-sans",
});

// Optional: Load Outfit for headers
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
        <AuthProvider>
          <GlobalState>{children}</GlobalState>
        </AuthProvider>
      </body>
    </html>
  );
}