"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AILoadingState from "@/components/ui/AILoadingState";
import SkillRadarChart from "@/components/ui/SkillRadarChart";
import { useAppContext } from "@/context/AppContext";

// Fallback mock scores if user lands here directly
const MOCK_SCORES = {
  logic: 78,
  optimization: 42,
  clean_code: 65,
  edge_cases: 55,
  speed: 72,
};

export default function ResultsPage() {
  const router = useRouter();
  const { state } = useAppContext();
  const [phase, setPhase] = useState<"loading" | "reveal">("loading");

  const scores = state.radarScores ?? MOCK_SCORES;
  const rank = state.alienRank ?? "Brute-Force Brawler";
  const feedback = state.summaryFeedback ?? "Analyzing your submission...";

  return (
    <main className="relative min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <AILoadingState
            key="loading"
            durationMs={4000}
            onComplete={() => setPhase("reveal")}
          />
        )}

        {phase === "reveal" && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center px-6 py-12 max-w-3xl mx-auto w-full"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-center mb-8"
            >
              <div
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-4"
                style={{
                  background: "rgba(74,222,128,0.08)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  color: "#4ade80",
                }}
              >
                ✓ Analysis Complete
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-3" style={{ letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                Your Skill{" "}
                <span className="gradient-text-blue">Blueprint</span>
              </h1>
              <p className="text-sm sm:text-base max-w-lg" style={{ color: "var(--text-secondary)" }}>
                Based on your calibration, here&apos;s what the AI found.
              </p>
            </motion.div>

            {/* Radar chart card */}
            <motion.div
              className="glass w-full p-6 sm:p-8 mb-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <SkillRadarChart scores={scores} rank={rank} />
            </motion.div>

            {/* Feedback card */}
            <motion.div
              className="glass w-full p-5 mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ borderColor: "rgba(56,189,248,0.2)" }}
            >
              <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#38bdf8" }}>
                AI Summary
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {feedback}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.button
              className="btn-primary py-4 px-10 text-base"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px rgba(56,189,248,0.4)" }}
              onClick={() => router.push("/alien-learn/dashboard")}
            >
              🚀 Generate My 7-Day Spaced Repetition Protocol
            </motion.button>

            <p className="text-xs mt-4" style={{ color: "var(--text-muted)" }}>
              Your roadmap is already ready — we built it while you were reading this.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
