"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import FlipbookModal from "@/components/Flipbook3D";
import Lottie from "lottie-react";
import cat from "@/public/cat/cat.json";
import ShinyText from "@/components/ShinyText";
import Confetti from "react-confetti";
import { getCompletedLevel } from "@/utils/progress";
import { useMounted } from "@/hooks/useMounted";
import { useConfetti } from "@/hooks/useConfetti";
import { COLORS } from "@/constants/game";

const PAGES = [
  "/flipbook/1.png",
  "/flipbook/2.png",
  "/flipbook/3.png",
  "/flipbook/4.png",
  "/flipbook/5.png",
  "/flipbook/6.png",
  "/flipbook/7.png",
  "/flipbook/8.png",
  "/flipbook/9.png",
  "/flipbook/10.png",
  "/flipbook/11.png",
  "/flipbook/12.png",
  "/flipbook/13.png",
  "/flipbook/14.png",
  "/flipbook/15.png",
  "/flipbook/16.png",
  "/flipbook/17.png",
  "/flipbook/18.png",
  "/flipbook/19.png",
  "/flipbook/20.png",
  "/flipbook/21.png",
  "/flipbook/22.png",
  "/flipbook/23.png",
  "/flipbook/24.png",
  "/flipbook/25.png",
  "/flipbook/26.png",
  "/flipbook/27.png",
  "/flipbook/28.png",
  "/flipbook/29.png",
  "/flipbook/30.png",
  "/flipbook/31.png",
  "/flipbook/32.png",
];

export default function Page() {
  const router = useRouter();
  const mounted = useMounted(0);
  const { windowSize, confettiConfig } = useConfetti();

  useEffect(() => {
    const completedLevel = getCompletedLevel();
    if (completedLevel < 7) {
      router.replace(`/level-${completedLevel + 1}`);
    }
  }, [router]);

  return (
    <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#1A120B] relative overflow-hidden px-4">
      {mounted && (
        <Confetti
          numberOfPieces={confettiConfig.numberOfPieces}
          recycle={confettiConfig.recycle}
          width={windowSize.width}
          height={windowSize.height}
        />
      )}
      <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
        <Lottie animationData={cat} loop autoplay />
      </div>
      <ShinyText
        text="Wiihh tebakan kakak benar, sekarang ambil hadiahnya yaa sayaang ❤️"
        speed={2}
        delay={0}
        color={COLORS.PRIMARY}
        shineColor={COLORS.SHINE}
        spread={120}
        direction="left"
        yoyo={false}
        pauseOnHover={false}
        disabled={false}
        className="text-center text-lg sm:text-xl font-bold mb-2 mx-4"
      />
      <p className="text-[#D5CEA3]/50 text-sm font-medium opacity-80 mb-2">
        &quot;Klik Giftnya ya sayang&quot;
      </p>
      <div className="text-center max-w-md text-gray-600 px-4">
        <FlipbookModal pages={PAGES} />
      </div>
    </main>
  );
}
