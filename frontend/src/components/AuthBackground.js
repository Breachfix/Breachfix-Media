"use client";

import AuthNavbar from "./AuthNavbar";

export default function AuthBackground({ children }) {
  return (
    <div className="h-screen bg-cover bg-no-repeat bg-[url('https://firebasestorage.googleapis.com/v0/b/joyful-a1987.appspot.com/o/epic%20sign%20in%20pic.svg?alt=media&token=b0a767e1-6933-4720-aed1-dc4af9895d67')] border-b-8 border-gray-800">
      <div className="bg-black bg-opacity-70 h-full w-full">
        <AuthNavbar />
        <div className="flex justify-center items-center h-[calc(100vh-100px)] px-6">
          {children}
        </div>
      </div>
    </div>
  );
}