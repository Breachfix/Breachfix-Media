"use client";

import { motion } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";

const questions = [
  {
    ques: "What is Netflix?",
    ans: `Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more – on thousands of internet-connected devices...`,
  },
  {
    ques: "How much does Netflix cost",
    ans: `Watch Netflix on your smartphone, tablet, Smart TV, laptop...`,
  },
  {
    ques: "What can I watch on Netflix?",
    ans: `Watch anywhere, anytime...`,
  },
  {
    ques: "How do I cancel?",
    ans: `Netflix is flexible. There are no annoying contracts...`,
  },
  {
    ques: "What can I watch on Netflix?",
    ans: `Netflix has an extensive library of feature films...`,
  },
  {
    ques: "Is Netflix good for kids?",
    ans: `The Netflix Kids experience is included in your membership...`,
  },
];

function UnauthBanner({ router }) {
  return (
    <div className="h-[65vh] sm:h-[90vh] xl:h-[95vh] bg-cover bg-no-repeat bg-[url('https://firebasestorage.googleapis.com/v0/b/joyful-a1987.appspot.com/o/epic%20sign%20in%20pic.svg?alt=media&token=b0a767e1-6933-4720-aed1-dc4af9895d67')] border-b-8 border-gray-800">
      <div className="bg-black bg-opacity-70 h-full">
        <div className="flex items-center justify-between px-4 sm:px-10 pt-4">
          <img
            src="/breachfix logo.png"
            alt="Breachfix Media"
            width={120}
            height={120}
            className="w-28 sm:w-36 lg:w-52 cursor-pointer"
            onClick={() => router.push("/")}
          />
          <button
            onClick={() => router.push("/auth/login")}
            className="h-8 px-4 text-white bg-[#e50914] rounded"
          >
            Sign In
          </button>
        </div>

        <div className="h-[55vh] sm:h-[80vh] w-[90%] md:w-[80%] mx-[5%] md:mx-[10%] flex flex-col items-center justify-center text-white text-center space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium">
            Unlimited movies, TV shows, and more..
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-medium">
            Watch anywhere. Cancel anytime.
          </h2>
          <button
            onClick={() => router.push("/auth/signup")}
            className="bg-red-600 hover:bg-[#e50914] p-4 rounded text-white text-lg"
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
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
      <main>
        <div className="bg-[#000000]">
          <UnauthBanner router={router} />
          <div className="border-b-8 border-gray-800 pb-8">
            <div className="flex flex-col h-auto text-white px-8 sm:px-14 md:px-28 lg:px-48 xl:px-80 mt-3 sm:mt-14">
              <h1 className="mb-5 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center">
                Frequently asked questions
              </h1>
              {questions.map((item, index) => (
                <div key={index} className="flex flex-col gap-3">
                  <div
                    onClick={() =>
                      setShowCurrentAns(showCurrentAns === index ? null : index)
                    }
                    className="flex justify-between p-3 lg:p-5 mt-2 bg-[#303030] cursor-pointer"
                  >
                    <h2>{item.ques}</h2>
                    <PlusIcon className="h-7 w-7" color="white" />
                  </div>
                  {showCurrentAns === index && (
                    <div className="p-3 lg:p-5 mt-2 bg-[#303030] cursor-pointer">
                      {item.ans}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}