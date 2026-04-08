"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { RadarScores, AlienRank } from "@/lib/types";

interface SkillRadarChartProps {
  scores: RadarScores;
  rank: AlienRank;
}

const RANK_COLORS: Record<string, string> = {
  "Code Padawan": "#94a3b8",
  "Syntax Sorcerer": "#38bdf8",
  "Brute-Force Brawler": "#fb923c",
  "Recursion Ranger": "#4ade80",
  "Optimization Oracle": "#a78bfa",
  "Algorithm Architect": "#facc15",
  "Grand Master Coder": "#f472b6",
};

const RANK_DESCRIPTIONS: Record<string, string> = {
  "Code Padawan": "You're just getting started. The force is strong — keep training.",
  "Syntax Sorcerer": "Clean code flows naturally from your fingertips. Logic is your next frontier.",
  "Brute-Force Brawler": "Solid instincts, but nested loops are holding you back. Time to level up.",
  "Recursion Ranger": "You think recursively and break problems elegantly. Complexity analysis is next.",
  "Optimization Oracle": "You see time and space trade-offs instantly. Almost at the top.",
  "Algorithm Architect": "You design systems, not just solutions. Interviewers are impressed.",
  "Grand Master Coder": "You are the algorithm. Go build something extraordinary.",
};

export default function SkillRadarChart({ scores, rank }: SkillRadarChartProps) {
  const data = [
    { skill: "Logic", value: scores.logic },
    { skill: "Optimization", value: scores.optimization },
    { skill: "Clean Code", value: scores.clean_code },
    { skill: "Edge Cases", value: scores.edge_cases },
    { skill: "Speed", value: scores.speed },
  ];

  const rankColor = RANK_COLORS[rank] ?? "#38bdf8";

  return (
    <motion.div
      className="flex flex-col items-center gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Rank Badge */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="text-center"
      >
        <div
          className="inline-block px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase mb-2"
          style={{
            background: `${rankColor}18`,
            border: `1px solid ${rankColor}40`,
            color: rankColor,
            boxShadow: `0 0 24px ${rankColor}30`,
          }}
        >
          {rank}
        </div>
        <p className="text-sm max-w-xs text-center" style={{ color: "var(--text-secondary)" }}>
          {RANK_DESCRIPTIONS[rank]}
        </p>
      </motion.div>

      {/* Radar Chart */}
      <motion.div
        className="w-full"
        style={{ height: 320, minHeight: 320, minWidth: 0 }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
            <PolarGrid
              stroke="rgba(56,189,248,0.12)"
              strokeDasharray="3 3"
            />
            <PolarAngleAxis
              dataKey="skill"
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
            />
            <Radar
              name="Skills"
              dataKey="value"
              stroke={rankColor}
              fill={rankColor}
              fillOpacity={0.18}
              strokeWidth={2}
              dot={{ r: 4, fill: rankColor, strokeWidth: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Score grid */}
      <motion.div
        className="grid grid-cols-5 gap-3 w-full"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {data.map((d) => (
          <div key={d.skill} className="glass text-center p-3 rounded-xl">
            <div className="text-xl font-bold" style={{ color: rankColor }}>
              {d.value}
            </div>
            <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {d.skill}
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
