"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import cat from "@/public/cat/melet.json";
import ProtectedLevel from "@/components/ProtectedLevel";
import ShinyText from "@/components/ShinyText";
import { setLevelCompleted } from "@/utils/progress";
import { GAME_CONFIG, COLORS } from "@/constants/game";

const { WORDS, TIME_LIMIT, WORD_COUNT, TITLE } = GAME_CONFIG.LEVEL_6;

const shuffle = (word: string) =>
  word
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

const getRandomWords = (words: string[], count: number) => {
  return [...words].sort(() => Math.random() - 0.5).slice(0, count);
};


const getInitialLetterStates = (word: string) => {
  const shuffled = shuffle(word);
  return shuffled.split("").map((letter, index) => ({
    letter,
    used: false,
    originalIndex: index,
  }));
};

interface LetterState {
  letter: string;
  used: boolean;
  originalIndex: number;
}

const LevelSix: React.FC = () => {
  const router = useRouter();
  

  const [shuffledWords, setShuffledWords] = useState<string[]>(() => getRandomWords(WORDS, WORD_COUNT));
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);
  const [input, setInput] = useState("");
  const [isWin, setIsWin] = useState(false);
  const [showLosePopup, setShowLosePopup] = useState(false);
  const [shake, setShake] = useState(false);
  const [letterStates, setLetterStates] = useState<LetterState[]>([]);

  const [isChecking, setIsChecking] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const word = shuffledWords[level] || "";


  useEffect(() => {
    if (word) {
      setLetterStates(getInitialLetterStates(word));
      setIsChecking(false);
      setIsTransitioning(false);
    }
  }, [word]);

  const resetFullGame = useCallback(() => {
    const newWords = getRandomWords(WORDS, WORD_COUNT);
    setShuffledWords(newWords);
    setLevel(0);
    setInput("");
    setTimeLeft(TIME_LIMIT);
    setIsWin(false);
    setShowLosePopup(false);
    setShake(false);
    const firstWord = newWords[0] || "";
    setLetterStates(firstWord ? getInitialLetterStates(firstWord) : []);
    setIsChecking(false);
    setIsTransitioning(false);
  }, []);


  useEffect(() => {
    if (isWin || showLosePopup || !word) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowLosePopup(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isWin, showLosePopup, word]);

  const checkAnswer = useCallback((currentInput: string) => {

    if (isChecking) return;
    setIsChecking(true);

    if (currentInput === word) {
      if (level === shuffledWords.length - 1) {
        setIsWin(true);
        setIsChecking(false);
      } else {
        setIsTransitioning(true);
        setTimeout(() => {
          setLevel((prev) => prev + 1);
          setInput("");
          setTimeLeft(TIME_LIMIT);
          setIsChecking(false);
          setIsTransitioning(false);
        }, 400);
      }
    } else {
      setShake(true);
      setTimeout(() => {
        setInput("");
        setShake(false);
        setLetterStates(getInitialLetterStates(word));
        setIsChecking(false);
      }, 300);
    }
  }, [word, level, shuffledWords.length, isChecking]);

  const handleLetterClick = useCallback((index: number) => {
  
    if (isWin || showLosePopup || isTransitioning || isChecking) return;
    if (input.length >= word.length) return;

    const letterState = letterStates[index];
    if (!letterState || letterState.used) return;


    setLetterStates((prev) =>
      prev.map((ls, i) => (i === index ? { ...ls, used: true } : ls))
    );

    const newInput = input + letterState.letter;
    setInput(newInput);


    if (newInput.length === word.length) {
      setTimeout(() => {
        checkAnswer(newInput);
      }, 100);
    }
  }, [input, word.length, letterStates, isWin, showLosePopup, isTransitioning, isChecking, checkAnswer]);

  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isWin || showLosePopup || isTransitioning || isChecking) return;
      
      const letter = e.key.toUpperCase();
      

      const availableIndex = letterStates.findIndex(
        (ls) => ls.letter === letter && !ls.used
      );
      
      if (availableIndex !== -1) {
        handleLetterClick(availableIndex);
      }
      
      if (e.key === "Backspace") {
        if (input.length === 0) return;

        const lastInputLetter = input[input.length - 1];
        
          setLetterStates((prev) => {
          const newStates = [...prev];
          for (let i = newStates.length - 1; i >= 0; i--) {
            if (newStates[i].letter === lastInputLetter && newStates[i].used) {
              newStates[i] = { ...newStates[i], used: false };
              break;
            }
          }
          return newStates;
        });

        setInput((prev) => prev.slice(0, -1));
      }
      
      if (e.key === "r" || e.key === "R") {
        resetFullGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [letterStates, handleLetterClick, isWin, showLosePopup, isTransitioning, isChecking, resetFullGame, input]);

  const handleRemove = (index: number) => {
    if (isTransitioning || isChecking) return;
    
    const letterToRemove = input[index];
    if (!letterToRemove) return;

    setLetterStates((prev) => {
      const newStates = [...prev];
      let countToSkip = 0;
      

      for (let i = 0; i < index; i++) {
        if (input[i] === letterToRemove) countToSkip++;
      }
      

      let foundCount = 0;
      for (let i = 0; i < newStates.length; i++) {
        if (newStates[i].letter === letterToRemove && newStates[i].used) {
          if (foundCount === countToSkip) {
            newStates[i] = { ...newStates[i], used: false };
            break;
          }
          foundCount++;
        }
      }
      return newStates;
    });

    setInput((prev) => prev.slice(0, index) + prev.slice(index + 1));
  };

  const resetAnswerOnly = () => {
    if (isTransitioning || isChecking) return;
    
    setInput("");
    setShake(false);
    setLetterStates(getInitialLetterStates(word));
    setIsChecking(false);
  };

  const handleSuccess = () => {
    setLevelCompleted(6);
    router.push("/level-7");
  };

  const progressPercent = (timeLeft / TIME_LIMIT) * 100;
  const isBlocked = isTransitioning || isChecking;

  return (
    <ProtectedLevel level={6}>
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
        `}</style>

        <div className="w-16 h-16 sm:w-20 sm:h-20 mb-1">
          <Lottie animationData={cat} loop autoplay />
        </div>

        <ShinyText
          text={isWin ? "Pintar banget sih kamu 💖" : `${TITLE} ✨`}
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

        <p className="text-center max-w-md text-[#D5CEA3]/50 px-4 text-xs mb-2 font-medium">
          {isWin ? "Kamu berhasil menyusun semua kata cinta ❤️" : `Susun huruf menjadi kata yang benar! (${level + 1}/${shuffledWords.length})`}
        </p>

        <div className="flex gap-4 mb-2 text-xs font-semibold text-[#D5CEA3]/50 items-center">
          <p>Time: {timeLeft}s</p>
          <p>
            Word: {level + 1}/{shuffledWords.length}
          </p>
        </div>
        <div className="w-full max-w-[260px] h-1.5 bg-[#D5CEA3]/50 rounded-full overflow-hidden mb-3 shadow-inner">
          <div
            className="h-full bg-[#D5CEA3]/90 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div
          className={`flex flex-wrap gap-1.5 mb-3 justify-center ${
            shake ? "animate-shake" : ""
          }`}
        >
          {Array.from({ length: word.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => handleRemove(i)}
              disabled={isBlocked}
              className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center text-base font-bold ${
                input[i]
                  ? "bg-green-200 border-green-400"
                  : "bg-[#D5CEA3] border-[#D5CEA3]/90"
              } ${isBlocked ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-label={`Remove letter ${i + 1}`}
            >
              {input[i] || ""}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 justify-center bg-[#D5CEA3]/50 p-3 rounded-2xl shadow-2xl mb-3 max-w-[280px]">
          {letterStates.map((letterState, index) => (
            <button
              key={index}
              onClick={() => handleLetterClick(index)}
              disabled={letterState.used || isBlocked}
              className={`w-10 h-10 rounded-lg font-bold text-base shadow-md transition-all ${
                letterState.used
                  ? "bg-[#D5CEA3]/40 text-[#1A120B]/70 cursor-not-allowed"
                  : isBlocked
                    ? "bg-[#1A120B]/70 cursor-not-allowed"
                    : "bg-[#1A120B] hover:bg-[#1A120B]/70 text-[#D5CEA3]/40"
              }`}
              aria-label={`Letter ${letterState.letter}${letterState.used ? " (used)" : ""}`}
            >
              {letterState.letter}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={isWin ? resetFullGame : resetAnswerOnly}
            disabled={isBlocked}
            className={`px-4 py-2 text-xs font-bold text-[#1A120B] rounded-xl ${
              isBlocked
                ? "bg-[#D5CEA3] cursor-not-allowed"
                : "bg-[#D5CEA3] hover:scale-110 transition duration-300"
            }`}
          >
            {isWin ? "Play Again" : "Reset Jawaban (R)"}
          </button>

          {isWin && (
            <button
              onClick={handleSuccess}
              className="px-3 py-1.5 text-xs font-bold text-[#D5CEA3] bg-[#3C2A21]/70 rounded-lg shadow-lg hover:bg-[##E5E5CB] hover:scale-110 transition duration-300"
                >
              Continue
            </button>
          )}
        </div>

        {showLosePopup && !isWin && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
            <div className="bg-[#D5CEA3]/90 rounded-2xl shadow-xl p-5 w-[85%] max-w-[260px] text-center animate-scalePulse">
              <p className="text-lg font-bold text-[#3C2A21] mb-1">
                Kamu Kalah, Cupu!
              </p>
              <p className="text-xs text-gray-600 mb-3">
                Mulai lagi dari awal ya ❤️
              </p>
              <button
                onClick={resetFullGame}
                className="px-3 py-1.5 text-xs font-bold text-[#D5CEA3] bg-[#3C2A21]/70 rounded-lg shadow-lg hover:bg-[##E5E5CB] hover:scale-110 transition duration-300"
                >
                Play Again
              </button>
            </div>
          </div>
        )}
      </main>
    </ProtectedLevel>
  );
};

export default LevelSix;
