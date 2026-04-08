"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TERMINAL_LINES = [
  "> Initializing AI analysis engine...",
  "> Parsing code submissions...",
  "> Measuring Big-O complexity...",
  "> Checking edge case coverage...",
  "> Analyzing variable naming patterns...",
  "> Computing space complexity...",
  "> Running spaced repetition algorithm...",
  "> Identifying weak skill vectors...",
  "> Calculating Forgetting Curve coefficients...",
  "> Mapping personalized topic sequence...",
  "> Building your 7-day roadmap...",
  "> Assigning Alien Rank...",
  "> Finalizing your protocol...",
];

interface AILoadingStateProps {
  onComplete?: () => void;
  durationMs?: number;
}

export default function AILoadingState({ onComplete, durationMs = 4000 }: AILoadingStateProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lineIndex = useRef(0);

  useEffect(() => {
    const delay = durationMs / TERMINAL_LINES.length;

    intervalRef.current = setInterval(() => {
      if (lineIndex.current < TERMINAL_LINES.length) {
        setVisibleLines((prev) => [...prev, TERMINAL_LINES[lineIndex.current]]);
        lineIndex.current += 1;
      } else {
        clearInterval(intervalRef.current!);
        setDone(true);
        timeoutRef.current = setTimeout(() => onComplete?.(), 600);
      }
    }, delay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(2,8,23,0.97)" }}
    >
      {/* Scan-line effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, #38bdf8 2px, #38bdf8 4px)",
        }}
      />

      {/* Terminal window */}
      <motion.div
        className="terminal w-full max-w-2xl mx-4 p-6 rounded-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{ minHeight: 360 }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
          <span className="ml-3 text-xs font-mono-code text-slate-500">
            alien-learn — AI Analysis Engine
          </span>
        </div>

        {/* Lines */}
        <div className="space-y-1.5 overflow-hidden">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="font-mono-code text-sm"
                style={{
                  color: i === visibleLines.length - 1 ? "#4ade80" : "#38bdf8",
                }}
              >
                {line}
                {i === visibleLines.length - 1 && !done && (
                  <span className="animate-blink">█</span>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 font-mono-code text-sm"
            style={{ color: "#4ade80" }}
          >
            ✓ Analysis complete. Revealing your profile...
          </motion.div>
        )}
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="mt-6 w-full max-w-2xl mx-4 h-0.5 rounded-full overflow-hidden"
        style={{ background: "rgba(56,189,248,0.1)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg, #0ea5e9, #38bdf8, #4ade80)" }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: durationMs / 1000, ease: "linear" }}
        />
      </motion.div>
    </div>
  );
}
