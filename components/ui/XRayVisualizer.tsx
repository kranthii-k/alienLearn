"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VisualizationData } from "@/lib/types";

interface XRayVisualizerProps {
  data: VisualizationData;
}

// Unique label colors per pointer name so L and R are visually distinct
const POINTER_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  L: { text: "#4ade80", bg: "rgba(74,222,128,0.15)", border: "rgba(74,222,128,0.5)" },
  R: { text: "#f87171", bg: "rgba(248,113,113,0.15)", border: "rgba(248,113,113,0.5)" },
};

function getPointerStyle(key: string) {
  return (
    POINTER_COLORS[key] ?? {
      text: "#38bdf8",
      bg: "rgba(56,189,248,0.15)",
      border: "rgba(56,189,248,0.5)",
    }
  );
}

export default function XRayVisualizer({ data }: XRayVisualizerProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const step = data.steps[currentStepIndex];
  const { array_values, pointers, highlighted_indexes } = step.visual_state;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === data.total_steps - 1;

  // Build a reverse map: index → [pointer labels pointing at it]
  const indexToPointers: Record<number, string[]> = {};
  for (const [label, idx] of Object.entries(pointers)) {
    if (!indexToPointers[idx]) indexToPointers[idx] = [];
    indexToPointers[idx].push(label);
  }

  return (
    <div
      className="flex flex-col gap-0 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(2,8,23,0.85)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(56,189,248,0.18)",
        minHeight: 380,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(56,189,248,0.1)", background: "rgba(10,22,40,0.6)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">👁️</span>
          <span className="text-sm font-bold" style={{ color: "#38bdf8" }}>
            X-Ray Logic Visualizer
          </span>
        </div>
        <span
          className="text-xs font-mono-code px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(56,189,248,0.08)",
            border: "1px solid rgba(56,189,248,0.2)",
            color: "#38bdf8",
          }}
        >
          {data.algorithm_name}
        </span>
      </div>

      {/* ── Stage — Array Boxes ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center justify-center px-6 pt-8 pb-4 gap-6">
        {/* Pointer labels row (above boxes) */}
        <div className="relative flex gap-3">
          {array_values.map((_, i) => {
            const labels = indexToPointers[i] ?? [];
            return (
              <div
                key={i}
                className="w-14 flex flex-col items-center"
                style={{ minWidth: 56 }}
              >
                <AnimatePresence>
                  {labels.map((label) => {
                    const style = getPointerStyle(label);
                    return (
                      <motion.div
                        key={label}
                        layoutId={`ptr-${label}`}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                        className="flex flex-col items-center gap-0.5 mb-1"
                      >
                        <span
                          className="text-xs font-bold font-mono-code px-2 py-0.5 rounded"
                          style={{
                            color: style.text,
                            background: style.bg,
                            border: `1px solid ${style.border}`,
                          }}
                        >
                          {label}
                        </span>
                        {/* Arrow down */}
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M4 6L0 0H8L4 6Z" fill={style.text} />
                        </svg>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Array boxes */}
        <div className="flex gap-3">
          {array_values.map((val, i) => {
            const isHighlighted = highlighted_indexes.includes(i);
            return (
              <motion.div
                key={i}
                layout
                animate={
                  isHighlighted
                    ? {
                        borderColor: "rgba(56,189,248,0.8)",
                        backgroundColor: "rgba(56,189,248,0.15)",
                        boxShadow: "0 0 18px rgba(56,189,248,0.35)",
                      }
                    : {
                        borderColor: "rgba(56,189,248,0.2)",
                        backgroundColor: "rgba(10,22,40,0.6)",
                        boxShadow: "none",
                      }
                }
                transition={{ duration: 0.35 }}
                className="w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold text-xl font-mono-code"
                style={{
                  border: "1px solid rgba(56,189,248,0.2)",
                  color: isHighlighted ? "#38bdf8" : "#94a3b8",
                }}
              >
                {val}
                <span
                  className="text-xs font-normal mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: "0.6rem" }}
                >
                  [{i}]
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Console — Explanation ───────────────────────────────────────────── */}
      <div className="mx-5 mb-4">
        <div
          className="rounded-xl p-4 font-mono-code text-sm leading-relaxed"
          style={{
            background: "rgba(2,8,23,0.9)",
            border: "1px solid rgba(56,189,248,0.1)",
            minHeight: 72,
          }}
        >
          <span style={{ color: "#4ade80" }}>{"> "}</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentStepIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: "#cbd5e1" }}
            >
              {step.explanation}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* ── Controls ───────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}
      >
        {/* Step counter */}
        <span className="text-xs font-mono-code" style={{ color: "var(--text-muted)" }}>
          Step{" "}
          <span style={{ color: "#38bdf8", fontWeight: 700 }}>{currentStepIndex + 1}</span>
          {" / "}
          {data.total_steps}
        </span>

        {/* Step progress bar */}
        <div
          className="flex-1 mx-4 h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(56,189,248,0.1)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #4ade80)" }}
            animate={{ width: `${((currentStepIndex + 1) / data.total_steps) * 100}%` }}
            transition={{ duration: 0.35 }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="xray-prev-btn"
            disabled={isFirst}
            onClick={() => setCurrentStepIndex((i) => i - 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              isFirst
                ? { color: "var(--text-muted)", border: "1px solid rgba(56,189,248,0.1)", cursor: "not-allowed" }
                : { color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", cursor: "pointer", background: "rgba(56,189,248,0.06)" }
            }
          >
            ← Prev
          </button>

          <button
            id="xray-reset-btn"
            onClick={() => setCurrentStepIndex(0)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              color: "#94a3b8",
              border: "1px solid rgba(148,163,184,0.2)",
              cursor: "pointer",
              background: "rgba(148,163,184,0.05)",
            }}
          >
            Reset
          </button>

          <button
            id="xray-next-btn"
            disabled={isLast}
            onClick={() => setCurrentStepIndex((i) => i + 1)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={
              isLast
                ? { color: "var(--text-muted)", border: "1px solid rgba(56,189,248,0.1)", cursor: "not-allowed" }
                : { color: "#020817", border: "none", cursor: "pointer", background: "linear-gradient(135deg, #0ea5e9, #38bdf8)"}
            }
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
