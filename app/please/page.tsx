"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/sad.json";
import ShinyText from "@/components/ShinyText";

const Please: React.FC = () => {
  const router = useRouter();
  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#1A120B] relative overflow-hidden px-4">
       <div className="w-20 h-20 sm:w-28 sm:h-28 mb-2">
        <Lottie animationData={cat} loop autoplay />
      </div>
      <ShinyText
        text="Please !"
        speed={2}
        delay={0}
        color="#D5CEA3"
        shineColor="#E5E5CB"
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
        className="text-center text-2xl sm:text-4xl font-bold mb-2"
      />
      <p className="text-center max-w-md text-[#D5CEA3]/50 px-4">
        I promise you&apos;ll like it!
      </p>
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-sm font-bold bg-[#D5CEA3] text-[#3C2A21] rounded-full shadow-lg hover:bg-[##E5E5CB] hover:scale-110 transition duration-300"
          >
          Yes i want see
        </button>
      </div>
    </main>
  );
};
export default Please;
