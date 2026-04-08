"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import TrackCard from "@/components/ui/TrackCard";
import CalibrationModal from "@/components/ui/CalibrationModal";
import { useAppContext } from "@/context/AppContext";
import { TRACKS } from "@/lib/tracks";
import { Track } from "@/lib/types";

export default function TrackSelectionPage() {
  const router = useRouter();
  const { dispatch } = useAppContext();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  const handleCardClick = (track: Track) => {
    setSelectedTrack(track);
  };

  const handleConfirm = () => {
    if (!selectedTrack) return;
    dispatch({ type: "SET_TRACK", track: selectedTrack.id });
    router.push(`/alien-learn/calibration?track=${selectedTrack.id}`);
  };

  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-6 py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">👽</span>
          <span className="font-bold tracking-tight" style={{ color: "var(--cyber-blue)" }}>
            Alien Learn
          </span>
        </div>
        <a
          href="/alien-learn/dashboard"
          className="text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Dashboard →
        </a>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
            style={{
              background: "rgba(56,189,248,0.08)",
              border: "1px solid rgba(56,189,248,0.2)",
              color: "#38bdf8",
            }}
          >
            ✦ AI-Powered Placement Prep
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
          >
            Select your target{" "}
            <span className="gradient-text-blue">orbit.</span>
            <br />
            Let AI build your{" "}
            <span className="gradient-text-green">path.</span>
          </h1>

          <p className="text-base sm:text-lg max-w-xl mx-auto" style={{ color: "var(--text-secondary)" }}>
            Complete a 45-minute calibration assessment. Our AI analyzes your strengths,
            weaknesses, and builds a personalized 7-day spaced repetition roadmap.
          </p>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-3 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {[
            ["🧠", "AI-analyzed calibration"],
            ["📅", "7-day personalized roadmap"],
            ["🔥", "Spaced repetition engine"],
            ["⚡", "Real-time feedback"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
              style={{
                background: "rgba(56,189,248,0.05)",
                border: "1px solid rgba(56,189,248,0.1)",
                color: "var(--text-secondary)",
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Track cards grid */}
      <section className="px-6 pb-20 max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2
            className="text-sm uppercase tracking-widest font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Choose your discipline
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRACKS.map((track, i) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.3 }}
            >
              <TrackCard
                id={track.id}
                title={track.title}
                description={track.description}
                icon={track.icon}
                color={track.color}
                onClick={() => handleCardClick(track)}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Modal */}
      {selectedTrack && (
        <CalibrationModal
          trackTitle={selectedTrack.title}
          onConfirm={handleConfirm}
          onCancel={() => setSelectedTrack(null)}
        />
      )}
    </main>
  );
}
