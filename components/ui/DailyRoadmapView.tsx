"use client";

import { motion } from "framer-motion";
import { UserRoadmap } from "@/lib/types";

interface DailyRoadmapViewProps {
  roadmap: UserRoadmap;
  onSelectDay?: (day: number) => void;
}

export default function DailyRoadmapView({ roadmap, onSelectDay }: DailyRoadmapViewProps) {
  const { currentDay, tasks } = roadmap;

  return (
    <div className="w-full">
      <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        7-Day Protocol
      </h3>

      {/* Desktop: horizontal timeline */}
      <div className="relative flex items-center gap-0 overflow-x-auto pb-2">
        {/* Connecting line */}
        <div
          className="absolute top-5 left-0 right-0 h-px"
          style={{ background: "rgba(56,189,248,0.1)" }}
        />

        {Array.from({ length: 7 }, (_, i) => i + 1).map((day) => {
          const dayTasks = tasks[day] ?? [];
          const isCompleted = day < currentDay || dayTasks.every((t) => t.status === "completed");
          const isCurrent = day === currentDay;
          const isLocked = day > currentDay;
          const completedCount = dayTasks.filter((t) => t.status === "completed").length;

          return (
            <motion.div
              key={day}
              className="relative flex flex-col items-center flex-1 min-w-[80px] cursor-pointer group"
              onClick={() => !isLocked && onSelectDay?.(day)}
              whileHover={!isLocked ? { y: -2 } : undefined}
            >
              {/* Circle */}
              <motion.div
                className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                animate={
                  isCurrent
                    ? {
                        boxShadow: [
                          "0 0 0px rgba(74,222,128,0)",
                          "0 0 20px rgba(74,222,128,0.5)",
                          "0 0 0px rgba(74,222,128,0)",
                        ],
                      }
                    : {}
                }
                transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
                style={
                  isCompleted
                    ? {
                        background: "rgba(74,222,128,0.2)",
                        border: "2px solid #4ade80",
                        color: "#4ade80",
                      }
                    : isCurrent
                    ? {
                        background: "rgba(74,222,128,0.25)",
                        border: "2px solid #4ade80",
                        color: "#4ade80",
                      }
                    : {
                        background: "rgba(10,22,40,0.8)",
                        border: "1px solid rgba(56,189,248,0.1)",
                        color: "var(--text-muted)",
                      }
                }
              >
                {isCompleted ? "✓" : isLocked ? "🔒" : `D${day}`}
              </motion.div>

              {/* Label */}
              <div className="mt-2 text-center">
                <div
                  className="text-xs font-semibold"
                  style={{
                    color: isCompleted
                      ? "#4ade80"
                      : isCurrent
                      ? "#f0f9ff"
                      : "var(--text-muted)",
                  }}
                >
                  Day {day}
                </div>
                <div
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                >
                  {isLocked
                    ? "Locked"
                    : `${completedCount}/${dayTasks.length} done`}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
