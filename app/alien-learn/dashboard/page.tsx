"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import DailyRoadmapView from "@/components/ui/DailyRoadmapView";
import TaskCard from "@/components/ui/TaskCard";
import SubmitModal from "@/components/ui/SubmitModal";
import XRayVisualizer from "@/components/ui/XRayVisualizer";
import { useAppContext } from "@/context/AppContext";
import { DailyTask, UserRoadmap, Difficulty } from "@/lib/types";
import { MOCK_VISUALIZER_DATA } from "@/lib/ai";

// Fallback roadmap for demo / no-calibration access
const DEMO_ROADMAP: UserRoadmap = {
  currentDay: 1,
  streak: 0,
  lastLoginDate: new Date().toISOString().split("T")[0],
  tasks: {
    1: [
      {
        id: "1-0",
        title: "Two Sum",
        externalLink: "https://leetcode.com/problems/two-sum/",
        topic: "Hash Maps",
        difficulty: "Easy" as Difficulty,
        status: "pending",
      },
      {
        id: "1-1",
        title: "Valid Anagram",
        externalLink: "https://leetcode.com/problems/valid-anagram/",
        topic: "Hash Maps",
        difficulty: "Easy" as Difficulty,
        status: "pending",
      },
    ],
    2: [
      {
        id: "2-0",
        title: "Contains Duplicate",
        externalLink: "https://leetcode.com/problems/contains-duplicate/",
        topic: "Arrays",
        difficulty: "Easy" as Difficulty,
        status: "locked",
      },
    ],
    3: [
      {
        id: "3-0",
        title: "3Sum",
        externalLink: "https://leetcode.com/problems/3sum/",
        topic: "Two Pointers",
        difficulty: "Medium" as Difficulty,
        status: "locked",
      },
    ],
    4: [
      {
        id: "4-0",
        title: "Subarray Sum Equals K",
        externalLink: "https://leetcode.com/problems/subarray-sum-equals-k/",
        topic: "Hash Maps (Revisit)",
        difficulty: "Medium" as Difficulty,
        status: "locked",
      },
    ],
    5: [{ id: "5-0", title: "Word Search", externalLink: "https://leetcode.com/problems/word-search/", topic: "Backtracking", difficulty: "Medium" as Difficulty, status: "locked" }],
    6: [{ id: "6-0", title: "Number of Islands", externalLink: "https://leetcode.com/problems/number-of-islands/", topic: "BFS/DFS", difficulty: "Medium" as Difficulty, status: "locked" }],
    7: [{ id: "7-0", title: "Merge k Sorted Lists", externalLink: "https://leetcode.com/problems/merge-k-sorted-lists/", topic: "Heaps", difficulty: "Hard" as Difficulty, status: "locked" }],
  },
};

const RANK_COLORS: Record<string, string> = {
  "Code Padawan": "#94a3b8",
  "Syntax Sorcerer": "#38bdf8",
  "Brute-Force Brawler": "#fb923c",
  "Recursion Ranger": "#4ade80",
  "Optimization Oracle": "#a78bfa",
  "Algorithm Architect": "#facc15",
  "Grand Master Coder": "#f472b6",
};

export default function DashboardPage() {
  const router = useRouter();
  const { state, dispatch } = useAppContext();
  const [submitTask, setSubmitTask] = useState<DailyTask | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [visualizerTask, setVisualizerTask] = useState<DailyTask | null>(null);

  const roadmap = state.roadmap ?? DEMO_ROADMAP;
  const rank = state.alienRank ?? "Recursion Ranger";
  const rankColor = RANK_COLORS[rank] ?? "#38bdf8";
  const currentDay = roadmap.currentDay;
  const viewDay = selectedDay ?? currentDay;
  const todayTasks = roadmap.tasks[viewDay] ?? [];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleSubmit = async (task: DailyTask, feedback: string) => {
    dispatch({
      type: "COMPLETE_TASK",
      day: viewDay,
      taskId: task.id,
      feedback,
    });
    setSubmitTask(null);
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
        <button
          className="btn-ghost text-xs py-1.5 px-3"
          onClick={() => router.push("/alien-learn")}
        >
          ← Tracks
        </button>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Top stats bar */}
        <motion.div
          className="glass flex flex-wrap items-center gap-4 p-5 mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Rank */}
          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${rankColor}18` }}
            >
              🏆
            </div>
            <div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Current Rank
              </div>
              <div className="text-sm font-bold" style={{ color: rankColor }}>
                {rank}
              </div>
            </div>
          </div>

          <div className="w-px h-10 hidden sm:block" style={{ background: "rgba(56,189,248,0.1)" }} />

          {/* Streak */}
          <div className="flex items-center gap-3 flex-1 min-w-[130px]">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{ background: "rgba(251,146,60,0.1)" }}
            >
              🔥
            </div>
            <div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Day Streak
              </div>
              <div className="text-2xl font-black" style={{ color: "#fb923c" }}>
                {roadmap.streak}
              </div>
            </div>
          </div>

          <div className="w-px h-10 hidden sm:block" style={{ background: "rgba(56,189,248,0.1)" }} />

          {/* Date & Day */}
          <div className="flex-1 min-w-[160px]">
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              Today
            </div>
            <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {today}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--cyber-blue)" }}>
              Protocol Day {currentDay} of 7
            </div>
          </div>
        </motion.div>

        {/* Roadmap timeline */}
        <motion.div
          className="glass p-5 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <DailyRoadmapView
            roadmap={roadmap}
            onSelectDay={(d) => setSelectedDay(d)}
          />
        </motion.div>

        {/* Today's tasks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
              {viewDay === currentDay ? "Today's Problems" : `Day ${viewDay} Problems`}
            </h2>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {todayTasks.filter((t) => t.status === "completed").length}/{todayTasks.length} completed
            </span>
          </div>

          {todayTasks.length === 0 ? (
            <div
              className="glass text-center py-12 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              No problems for this day yet.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {todayTasks.map((task, idx) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onSubmit={(t) => setSubmitTask(t)}
                  // Give the first task the X-Ray Mentor button as a demo
                  hasVisualizer={idx === 0}
                  onOpenVisualizer={(t) => setVisualizerTask(t)}
                />
              ))}
            </div>
          )}

          {/* All done for the day */}
          {todayTasks.length > 0 &&
            todayTasks.every((t) => t.status === "completed") && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass mt-6 text-center py-8"
                style={{ borderColor: "rgba(74,222,128,0.3)" }}
              >
                <div className="text-3xl mb-3">🎉</div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#4ade80" }}>
                  Day {viewDay} Complete!
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Excellent work. Come back tomorrow for Day {viewDay + 1}.
                </p>
              </motion.div>
            )}
        </motion.div>
      </div>

      {/* Submit Modal */}
      {submitTask && (
        <SubmitModal
          task={submitTask}
          onClose={() => setSubmitTask(null)}
          onSubmit={handleSubmit}
        />
      )}

      {/* X-Ray Visualizer Modal */}
      <AnimatePresence>
        {visualizerTask && (
          <motion.div
            key="xray-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: "rgba(2,8,23,0.88)" }}
            onClick={(e) => e.target === e.currentTarget && setVisualizerTask(null)}
          >
            <motion.div
              className="w-full max-w-2xl"
              initial={{ y: 32, scale: 0.97, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 32, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
            >
              {/* Modal header strip */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#38bdf8" }}>
                    X-Ray Logic Visualizer
                  </p>
                  <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    {visualizerTask.title}
                  </p>
                </div>
                <button
                  id="xray-modal-close"
                  onClick={() => setVisualizerTask(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-colors hover:bg-white/5"
                  style={{ color: "var(--text-muted)" }}
                >
                  ✕
                </button>
              </div>

              {/* Visualizer */}
              <XRayVisualizer data={MOCK_VISUALIZER_DATA} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
