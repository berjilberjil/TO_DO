"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ANIMATION_URLS: Record<string, string[]> = {
  idle: [
    "https://assets2.lottiefiles.com/packages/lf20_uu0x8lqv.json",
    "https://assets10.lottiefiles.com/packages/lf20_uu0x8lqv.json",
    "https://lottie.host/embed/b239998f-9a21-44bd-b68c-f113e018dfea/vVHcmwvT8R.json",
  ],
  celebrate: [
    "https://assets2.lottiefiles.com/packages/lf20_touohxv0.json",
    "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json",
    "https://lottie.host/embed/0f0ef4fc-bd81-4ae7-8675-42e138aa2dda/YTJxiCJKwM.json",
  ],
  think: [
    "https://assets2.lottiefiles.com/packages/lf20_j1klkqk2.json",
    "https://assets10.lottiefiles.com/packages/lf20_j1klkqk2.json",
  ],
  sad: [
    "https://assets2.lottiefiles.com/packages/lf20_qm8eqzse.json",
    "https://assets10.lottiefiles.com/packages/lf20_qm8eqzse.json",
  ],
};

interface MascotProps {
  mood: "idle" | "celebrate" | "think" | "sad";
  size?: number;
  message?: string;
}

// SVG fallback characters when Lottie fails to load
function FallbackCharacter({ mood, size }: { mood: string; size: number }) {
  const faceColor =
    mood === "celebrate"
      ? "#22c55e"
      : mood === "sad"
        ? "#94a3b8"
        : mood === "think"
          ? "#3b82f6"
          : "#f59e0b";

  const eyeVariant =
    mood === "sad"
      ? { d: "M28 38 Q32 42 36 38", d2: "M52 38 Q56 42 60 38" }
      : { d: "M30 36 A2 2 0 1 1 34 36 A2 2 0 1 1 30 36", d2: "M54 36 A2 2 0 1 1 58 36 A2 2 0 1 1 54 36" };

  const mouth =
    mood === "celebrate"
      ? "M30 52 Q44 66 58 52"
      : mood === "sad"
        ? "M30 58 Q44 48 58 58"
        : mood === "think"
          ? "M36 54 L52 54"
          : "M32 52 Q44 62 56 52";

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 88 88"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      {/* Body */}
      <motion.circle
        cx="44"
        cy="44"
        r="38"
        fill={faceColor}
        animate={
          mood === "celebrate"
            ? { scale: [1, 1.05, 1], y: [0, -3, 0] }
            : mood === "idle"
              ? { y: [0, -2, 0] }
              : {}
        }
        transition={{ repeat: Infinity, duration: mood === "celebrate" ? 0.6 : 2, ease: "easeInOut" }}
      />
      {/* Eyes */}
      {mood === "sad" ? (
        <>
          <path d={eyeVariant.d} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d={eyeVariant.d2} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </>
      ) : mood === "celebrate" ? (
        <>
          <motion.path
            d="M28 34 L32 30 L36 34"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ scaleY: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
          <motion.path
            d="M52 34 L56 30 L60 34"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            animate={{ scaleY: [1, 0.8, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        </>
      ) : (
        <>
          <circle cx="32" cy="36" r="3" fill="white" />
          <circle cx="56" cy="36" r="3" fill="white" />
          {mood === "think" && (
            <motion.circle
              cx="32"
              cy="36"
              r="3"
              fill="white"
              animate={{ cx: [32, 34, 32] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
        </>
      )}
      {/* Mouth */}
      <path d={mouth} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      {mood === "celebrate" && (
        <>
          <circle cx="22" cy="46" r="5" fill="rgba(255,255,255,0.3)" />
          <circle cx="66" cy="46" r="5" fill="rgba(255,255,255,0.3)" />
        </>
      )}
      {/* Think bubbles */}
      {mood === "think" && (
        <>
          <motion.circle
            cx="70"
            cy="18"
            r="4"
            fill={faceColor}
            opacity="0.5"
            animate={{ y: [0, -3, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          <motion.circle
            cx="76"
            cy="10"
            r="2.5"
            fill={faceColor}
            opacity="0.4"
            animate={{ y: [0, -2, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
          />
        </>
      )}
      {/* Celebrate stars */}
      {mood === "celebrate" && (
        <>
          <motion.text
            x="8"
            y="18"
            fontSize="12"
            animate={{ y: [18, 12, 18], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            ✨
          </motion.text>
          <motion.text
            x="68"
            y="14"
            fontSize="10"
            animate={{ y: [14, 8, 14], opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          >
            ⭐
          </motion.text>
        </>
      )}
      {/* Sad tear */}
      {mood === "sad" && (
        <motion.ellipse
          cx="34"
          cy="44"
          rx="2"
          ry="3"
          fill="rgba(255,255,255,0.6)"
          animate={{ cy: [44, 50, 44], opacity: [0.6, 0, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </motion.svg>
  );
}

export default function Mascot({ mood, size = 120, message }: MascotProps) {
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setAnimationData(null);
    setUseFallback(false);
    attemptedRef.current = false;

    async function loadAnimation() {
      const urls = ANIMATION_URLS[mood] || [];
      for (const url of urls) {
        if (cancelled) return;
        try {
          const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
          if (!res.ok) continue;
          const data = await res.json();
          if (!cancelled && data && (data.v || data.layers)) {
            setAnimationData(data);
            return;
          }
        } catch {
          continue;
        }
      }
      if (!cancelled) {
        setUseFallback(true);
      }
    }

    loadAnimation();
    // If nothing loads in 5s, show fallback
    const timeout = setTimeout(() => {
      if (!animationData && !cancelled) {
        setUseFallback(true);
      }
    }, 5000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [mood]);

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3 }}
            className="relative mb-2 max-w-[200px] rounded-xl bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 shadow-md text-center z-10"
          >
            {message}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white dark:bg-gray-800" />
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ width: size, height: size }} className="flex items-center justify-center">
        {useFallback ? (
          <FallbackCharacter mood={mood} size={size} />
        ) : animationData ? (
          <Lottie animationData={animationData} loop autoplay style={{ width: size, height: size }} />
        ) : (
          <FallbackCharacter mood={mood} size={size} />
        )}
      </div>
    </div>
  );
}
