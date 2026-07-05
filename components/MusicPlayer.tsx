"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isLoading } = useLoading();
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isFadingRef = useRef(false);

  const stopFade = useCallback(() => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
    isFadingRef.current = false;
  }, []);

  const fadeIn = useCallback(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const step = 0.05;
    const fadeDuration = 1500;
    const intervalTime = fadeDuration / (1 / step);
    
    audio.volume = 1;
    const playPromise = audio.play();
    
    // Handle autoplay policy - play might fail silently
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          isFadingRef.current = true;
          fadeIntervalRef.current = setInterval(() => {
            if (audio.volume < 1) {
              audio.volume = Math.min(audio.volume + step, 1);
            } else {
              stopFade();
            }
          }, intervalTime);
        })
        .catch((error) => {
          console.log("Autoplay prevented by browser:", error);
          // Autoplay was prevented, user needs to click play button
          // Don't set isPlaying to true, keep the bubble visible
        });
    }
  }, [stopFade]);

  useEffect(() => {
    const handleCountdownFinished = () => {
      if (audioRef.current) {
        fadeIn();
      }
    };

    window.addEventListener('countdownFinished', handleCountdownFinished);

    return () => {
      window.removeEventListener('countdownFinished', handleCountdownFinished);
      stopFade();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.volume = 1;
      }
    };
  }, [fadeIn, stopFade]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    stopFade();

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.volume = 1;
      setIsPlaying(false);
    } else {
      fadeIn();
    }
  }, [isPlaying, fadeIn, stopFade]);

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <audio
        ref={audioRef}
        src="/audio/music.mp3"
        loop
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
      {!isLoading && (
        <>
          {!isPlaying && (
            <div className="absolute bottom-15 right-0 animate-bubbleContinuous">
              <div className="bg-[#D5CEA3] text-[#3C2A21] font-bold px-3 py-1 rounded-lg text-sm font-medium shadow-lg relative whitespace-nowrap max-w-[calc(100vw-6rem)] sm:max-w-xs">
                Play Music
                <div className="absolute top-full right-4 w-0 h-0 border-t-8 border-t-[#D5CEA3] border-x-8 border-x-transparent"></div>
              </div>
            </div>
          )}
          <button
            onClick={togglePlay}
            className="bg-[#D5CEA3] hover:bg-[#E5E5CB] text-[#3C2A21] w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-lg border-2 border-white/50"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default MusicPlayer;
