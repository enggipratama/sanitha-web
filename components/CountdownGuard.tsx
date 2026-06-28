"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
// import Lottie from "lottie-react";
import Image from "next/image";

import cat from "@/public/cat/awal.png";
import ShinyText from "@/components/ShinyText";

interface Props {
  targetDate: string;
  children?: React.ReactNode;
  blockAccess?: boolean;
}

export default function CountdownGuard({
  targetDate,
  children,
  blockAccess = true,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const getRemaining = useCallback(() => {
    const targetTime = new Date(targetDate).getTime();
    if (isNaN(targetTime)) {
      console.error("Invalid target date:", targetDate);
      return 0;
    }
    return Math.max(0, targetTime - Date.now());
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(getRemaining);
  const [redirectReady, setRedirectReady] = useState(getRemaining() === 0);
  const [isFinalMode, setIsFinalMode] = useState(
    getRemaining() <= 16 && getRemaining() > 0,
  );
  const [finalSeconds, setFinalSeconds] = useState(() => {
    const r = getRemaining();
    return r <= 15 && r > 0 ? Math.ceil(r / 1000) : null;
  });
  const [showCurtain, setShowCurtain] = useState(
    getRemaining() <= 15 && getRemaining() > 0,
  );
  const [curtainOpening, setCurtainOpening] = useState(false);

  useEffect(() => {
    const newRemaining = getRemaining();
    setTimeLeft(newRemaining);
    setRedirectReady(newRemaining === 0);
    setIsFinalMode(newRemaining <= 16 && newRemaining > 0);
    setFinalSeconds(newRemaining <= 15 && newRemaining > 0 ? Math.ceil(newRemaining / 1000) : null);
    setShowCurtain(newRemaining <= 15 && newRemaining > 0);
    setCurtainOpening(newRemaining === 0);
  }, [getRemaining, targetDate]);

  useEffect(() => {
    if (redirectReady) return;

    const target = new Date(targetDate).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(target - now, 0);
      const secondsLeft = Math.ceil(distance / 1000);

      setTimeLeft(distance);

      if (secondsLeft <= 16 && secondsLeft > 0 && !isFinalMode) {
        setIsFinalMode(true);
        setShowCurtain(true);
        setFinalSeconds(secondsLeft);
      }

      if (isFinalMode && secondsLeft > 0 && secondsLeft <= 16) {
        setFinalSeconds(secondsLeft);
      }

      if (secondsLeft === 0 && !redirectReady) {
        setFinalSeconds(null);
        setCurtainOpening(true);

        setTimeout(() => {
          setRedirectReady(true);
          window.dispatchEvent(new CustomEvent('countdownFinished'));
        }, 1600);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isFinalMode, redirectReady]);

  useEffect(() => {
    if (blockAccess && !redirectReady && pathname !== "/") {
      router.replace("/");
    }
  }, [blockAccess, redirectReady, pathname, router]);

  const formatTime = (ms: number) => {
    if (isNaN(ms) || ms < 0) {
      return "Loading...";
    }
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  };

  const getDateText = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Tanggal tidak valid";
    }
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (blockAccess && !redirectReady) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A120B] px-4">
        {!isFinalMode && (
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="relative w-[70vw] max-w-[320px] aspect-[1081/648]">
              <Image
                src={cat}
                alt="Couple"
                fill
                className="object-contain"
                priority
              />
            </div>
            <ShinyText
              text="Sabar dulu Yaa..."
              speed={2}
              color="#D5CEA3"
              shineColor="#E5E5CB"
              className="mb-2 text-center text-xl font-bold sm:text-2xl"
            />
            <div className="rounded-xl bg-gradient-to-r from-[#3C2A21] to-[#3C2A21] px-6 py-1 font-mono text-xl tracking-wide text-white shadow-xl sm:text-2xl">
              {formatTime(timeLeft)}
            </div>
            <div className="mt-2 rounded-full bg-[#3C2A21]/70 px-4 py-1 text-xs font-semibold text-[#D5CEA3] sm:text-sm">
              Hari Spesial: <strong>{getDateText(targetDate)} 🎉</strong>
            </div>
          </div>
        )}

        {showCurtain && (
          <div
            className={`fixed inset-0 z-40 bg-[#3C2A21]/70 ${
              curtainOpening ? "animate-curtainUp" : "animate-curtainDown"
            }`}
          />
        )}

        {finalSeconds !== null && (
          <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
            <div
              key={finalSeconds}
              className="animate-heartBeat text-8xl font-extrabold text-[#E5E5CB] drop-shadow-xl sm:text-9xl"
            >
              {finalSeconds}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}
