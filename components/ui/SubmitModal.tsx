"use client";

import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DailyTask } from "@/lib/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface SubmitModalProps {
  task: DailyTask;
  onClose: () => void;
  onSubmit: (task: DailyTask, code: string) => Promise<void>;
}

export default function SubmitModal({ task, onClose, onSubmit }: SubmitModalProps) {
  const [code, setCode] = useState("// Paste your accepted solution here\n");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [nextTopic, setNextTopic] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!code.trim() || code.trim() === "// Paste your accepted solution here") return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/evaluate-daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemTitle: task.title, code }),
      });
      const data = await res.json();
      setFeedback(data.feedback);
      setNextTopic(data.next_spaced_repetition_topic);
      await onSubmit(task, data.feedback);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background: "rgba(2,8,23,0.85)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="glass w-full max-w-2xl flex flex-col gap-5 p-6 max-h-[90vh] overflow-y-auto"
          initial={{ y: 40, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          style={{ borderColor: "rgba(74,222,128,0.25)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "#4ade80" }}>
                Submit Solution
              </div>
              <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                {task.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              ✕
            </button>
          </div>

          <div className="divider" />

          {!feedback ? (
            <>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Paste your accepted LeetCode solution below. Our AI will analyze your approach and provide instant feedback.
              </p>

              {/* Monaco Editor */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(56,189,248,0.15)", height: 280 }}>
                <MonacoEditor
                  height="280px"
                  defaultLanguage="typescript"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    padding: { top: 12, bottom: 12 },
                    bracketPairColorization: { enabled: true },
                  }}
                />
              </div>

              <button
                className="btn-green w-full py-3"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Analyzing your code...
                  </span>
                ) : (
                  "Get AI Feedback →"
                )}
              </button>
            </>
          ) : (
            /* Feedback view */
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
              <div
                className="rounded-xl p-4 leading-relaxed text-sm"
                style={{
                  background: "rgba(74,222,128,0.07)",
                  border: "1px solid rgba(74,222,128,0.2)",
                  color: "#86efac",
                }}
              >
                <div className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">AI Feedback</div>
                {feedback}
              </div>

              {nextTopic && (
                <div
                  className="rounded-xl p-4 text-sm"
                  style={{
                    background: "rgba(56,189,248,0.07)",
                    border: "1px solid rgba(56,189,248,0.2)",
                    color: "#7dd3fc",
                  }}
                >
                  <div className="text-xs font-semibold text-sky-400 mb-1 uppercase tracking-wider">Coming Up (Spaced Repetition)</div>
                  {nextTopic}
                </div>
              )}

              <button className="btn-primary w-full py-3 mt-2" onClick={onClose}>
                Close ✓
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
