"use client";


export default function BackgroundView({ children }) {
  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://firebasestorage.googleapis.com/v0/b/joyful-a1987.appspot.com/o/epic%20sign%20in%20pic.svg?alt=media&token=b0a767e1-6933-4720-aed1-dc4af9895d67')",
        backgroundAttachment: "fixed",
      }}
    >
      {/* 🖤 Dual Gradient: Fades in from Top and Bottom */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
      </div>
    </div>
  );
}