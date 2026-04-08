"use client";

import { motion } from "framer-motion";
import { DailyTask } from "@/lib/types";

interface TaskCardProps {
  task: DailyTask;
  onSubmit: (task: DailyTask) => void;
  /** If true, shows the "Unlock X-Ray Mentor" button */
  hasVisualizer?: boolean;
  onOpenVisualizer?: (task: DailyTask) => void;
}

const difficultyConfig = {
  Easy: { class: "badge-easy", label: "Easy" },
  Medium: { class: "badge-medium", label: "Medium" },
  Hard: { class: "badge-hard", label: "Hard" },
};

export default function TaskCard({ task, onSubmit, hasVisualizer = false, onOpenVisualizer }: TaskCardProps) {
  const diff = difficultyConfig[task.difficulty];
  const isCompleted = task.status === "completed";

  return (
    <motion.div
      className="glass glass-hover relative flex flex-col gap-4 p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      style={
        isCompleted
          ? { borderColor: "rgba(74,222,128,0.25)" }
          : undefined
      }
    >
      {/* Completed top line */}
      {isCompleted && (
        <div
          className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
          style={{ background: "linear-gradient(90deg, transparent, rgba(74,222,128,0.4), transparent)" }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`badge ${diff.class}`}>{diff.label}</span>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-mono-code"
              style={{
                background: "rgba(56,189,248,0.08)",
                color: "#38bdf8",
                border: "1px solid rgba(56,189,248,0.15)",
              }}
            >
              {task.topic}
            </span>
          </div>
          <h4 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            {task.title}
          </h4>
        </div>

        {isCompleted && (
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm"
            style={{ background: "rgba(74,222,128,0.2)", color: "#4ade80" }}
          >
            ✓
          </div>
        )}
      </div>

      {/* AI Feedback (after completion) */}
      {isCompleted && task.aiFeedback && (
        <div
          className="rounded-xl p-3 text-sm leading-relaxed"
          style={{
            background: "rgba(74,222,128,0.06)",
            border: "1px solid rgba(74,222,128,0.15)",
            color: "#86efac",
          }}
        >
          <span className="text-xs font-semibold text-green-500 mr-1">AI:</span>
          {task.aiFeedback}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-1 flex-wrap">
        <a
          href={task.externalLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost text-xs py-2 px-3 flex items-center gap-1.5 no-underline"
          style={{ fontSize: "0.8rem" }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          Open on LeetCode
        </a>

        {/* X-Ray Mentor button — shown when hasVisualizer is true and not completed */}
        {hasVisualizer && !isCompleted && (
          <motion.button
            id={`xray-btn-${task.id}`}
            className="text-xs py-2 px-3 rounded-xl font-semibold flex items-center gap-1.5"
            style={{
              color: "#38bdf8",
              border: "1px solid rgba(56,189,248,0.4)",
              background: "rgba(56,189,248,0.06)",
              fontSize: "0.8rem",
            }}
            animate={{
              boxShadow: [
                "0 0 0px rgba(56,189,248,0)",
                "0 0 12px rgba(56,189,248,0.35)",
                "0 0 0px rgba(56,189,248,0)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.04, background: "rgba(56,189,248,0.12)" }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onOpenVisualizer?.(task)}
          >
            👁️ Unlock X-Ray Mentor
          </motion.button>
        )}

        {!isCompleted && (
          <button
            className="btn-green text-xs py-2 px-4 ml-auto"
            style={{ fontSize: "0.8rem" }}
            onClick={() => onSubmit(task)}
          >
            Submit Solution
          </button>
        )}

        {isCompleted && (
          <span
            className="ml-auto text-xs font-semibold"
            style={{ color: "#4ade80" }}
          >
            ✓ Completed
          </span>
        )}
      </div>
    </motion.div>
  );
}
