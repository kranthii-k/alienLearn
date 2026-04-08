"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CalibrationModalProps {
  trackTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function CalibrationModal({ trackTitle, onConfirm, onCancel }: CalibrationModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(2,8,23,0.88)" }}
        onClick={(e) => e.target === e.currentTarget && onCancel()}
      >
        <motion.div
          className="glass w-full max-w-md flex flex-col gap-6 p-7"
          initial={{ y: 30, scale: 0.96, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          style={{ borderColor: "rgba(56,189,248,0.25)" }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: "rgba(56,189,248,0.1)" }}
          >
            🚀
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              Ready for your Calibration?
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              You&apos;re about to begin the{" "}
              <span style={{ color: "var(--cyber-blue)", fontWeight: 600 }}>{trackTitle}</span>{" "}
              calibration assessment. This helps our AI understand your skill baseline.
            </p>
          </div>

          {/* Rules */}
          <div
            className="rounded-xl p-4 space-y-2"
            style={{ background: "rgba(56,189,248,0.05)", border: "1px solid rgba(56,189,248,0.12)" }}
          >
            {[
              ["⏱️", "45-minute time limit"],
              ["📝", "3 coding problems (Easy → Medium → Medium)"],
              ["🤖", "AI analyzes your code after submission"],
              ["🗺️", "Personalized 7-day roadmap generated instantly"],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button className="btn-ghost flex-1 py-3" onClick={onCancel}>
              Not now
            </button>
            <button className="btn-primary flex-1 py-3" onClick={onConfirm}>
              Begin Assessment →
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
