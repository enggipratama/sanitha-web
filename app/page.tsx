"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";

const HomePage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#1A120B] relative overflow-hidden px-4">
      {mounted && <Confetti numberOfPieces={500} recycle={false} />}

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-28 h-28 sm:w-36 sm:h-36">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text="A Lifetime in Moments ✨"
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
        Ready to take a trip through our favorite memories and a few special surprises? 👀💖
        </p>

        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push("/level-1")}
            className="px-4 py-2 text-sm font-bold bg-[#D5CEA3] text-[#3C2A21] rounded-full shadow-lg hover:bg-[##E5E5CB] hover:scale-110 transition duration-300"
          >
            I&apos;m Ready
          </button>

          <button
            onClick={() => router.push("/please")}
            className="px-4 py-2 text-sm font-bold bg-[#D5CEA3] text-[#3C2A21] rounded-full shadow-lg hover:bg-[#E5E5CB] hover:scale-110 transition duration-300"
          >
            No Thanks
          </button>
        </div>
      </motion.div>
    </main>
  );
};

export default HomePage;
