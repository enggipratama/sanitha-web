"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/level-1.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  
  const months = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day} ${month} ${year}`;
};

export default function LevelOne() {
  const router = useRouter();
  const [answer, setAnswer] = useState("");
  const [displayDate, setDisplayDate] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { CORRECT_ANSWER, TITLE } = GAME_CONFIG.LEVEL_1;

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAnswer(value);
    setDisplayDate(formatDate(value));
    if (isCorrect !== null) setIsCorrect(null);
  };

  const handleSubmit = () => {
    if (answer === CORRECT_ANSWER) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
      setTimeout(() => setIsCorrect(null), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleSuccess = () => {
    setLevelCompleted(1);
    router.push("/level-2");
  };

  return (
    <ProtectedLevel level={1}>
      <main className="h-dvh w-full flex flex-col items-center justify-center bg-[#1A120B] relative overflow-hidden px-4">
        <style jsx global>{`
          html, body {
            background-color: ${COLORS.BACKGROUND} !important;
            margin: 0;
            padding: 0;
            overflow: hidden;
            width: 100%;
            height: 100%;
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .shake-animation {
            animation: shake 0.2s ease-in-out 0s 2;
          }
          input[type="date"]::placeholder {
            color: transparent;
          }
          input[type="date"] {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]:invalid {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
          }
          input[type="date"]::-webkit-calendar-picker-indicator {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
          input[type="date"]::-webkit-date-and-time-value {
            text-align: center;
          }
          input[type="date"]:focus {
            outline: none;
          }
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-2">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isCorrect ? "You made me happy!" : `${TITLE} ❤️`}
          speed={2}
          delay={0}
          color={COLORS.PRIMARY}
          shineColor={COLORS.SHINE}
          spread={120}
          direction="left"
          yoyo={false}
          pauseOnHover={false}
          disabled={false}
          className="text-center text-xl sm:text-2xl font-bold mb-1"
        />

        <p className="text-center max-w-md text-[#D5CEA3]/50 px-4 text-sm mb-3 font-medium">
          {isCorrect ? "You made me happy!" : "Answer correctly to make me happy!"}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#D5CEA3]/50 backdrop-blur-xl p-4 sm:p-5 rounded-2xl shadow-xl border border-[#E5E5CB]/40 w-full max-w-[300px] mx-auto relative z-10"
        >
          <AnimatePresence mode="wait">
            {!isCorrect ? (
              <motion.div
                key="question"
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center w-full space-y-4"
              >
                <div className="text-center">
                  <h2 className="text-[#1A120B]/70 text-lg font-bold italic">
                    Kapan kita jadian?
                  </h2>
                  <p className="text-xs text-[#1A120B] font-medium">
                    Hayoo inget gak? 🧐
                  </p>
                </div>

                <div className="w-full max-w-[260px] space-y-3">
                  <div className="relative w-full">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={answer}
                      onChange={handleDateChange}
                      onKeyDown={handleKeyDown}
                      className={`w-full min-w-0 block py-2.5 px-0 rounded-xl border-2 transition-all duration-300 outline-none font-bold text-sm box-border text-center cursor-pointer text-transparent appearance-none
                        ${
                          isCorrect === false
                            ? "border-red-400 bg-red-50 shake-animation"
                            : "border-[#E5E5CB]/40 focus:border-[#E5E5CB]/40 focus:ring-4 focus:ring-pink-500/10 bg-white/80"
                        }`}
                    />
                    
                    <div 
                      className={`absolute inset-0 flex items-center justify-center pointer-events-none text-sm rounded-xl ${
                        answer 
                          ? "text-[#1A120B] font-bold" 
                          : "text-[#1A120B]/60 font-normal"
                      }`}
                    >
                      {displayDate || "Pilih tanggal"}
                    </div>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#1A120B] text-[#E5E5CB] rounded-xl shadow-lg hover:bg-[#1A120B]/50 active:scale-95 transition duration-300 text-sm py-2.5"
                  >
                    Kirim Jawaban 💌
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center w-full space-y-4"
              >
                <div className="text-center mt-5">
                  {/* <p className="text-3xl mb-1">🎉</p> */}
                  <p className="font-extrabold text-[#1A120B]/80">
                    Benar! pinternyaaaa 😍
                  </p>
                </div>

                <button
                  onClick={handleSuccess}
                  className="px-4 py-2.5 w-full font-bold bg-[#1A120B] text-[#E5E5CB] rounded-xl shadow-lg hover:bg-[#1A120B]/50 active:scale-95 transition duration-300 text-sm"
                >
                  Continue
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="h-5 mt-3 flex justify-center">
            <AnimatePresence>
              {isCorrect === false && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-[#1A120B] italic"
                >
                  Hmm… Masa lupa 😌 Coba lagi ya 💕
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </ProtectedLevel>
  );
}
