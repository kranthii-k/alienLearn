"use client";

import { motion } from "framer-motion";

interface TrackCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: "blue" | "green" | "violet";
  onClick: () => void;
}

const colorMap = {
  blue: {
    glow: "rgba(56,189,248,0.3)",
    border: "rgba(56,189,248,0.4)",
    bg: "rgba(56,189,248,0.08)",
    text: "#38bdf8",
    iconBg: "rgba(56,189,248,0.12)",
  },
  green: {
    glow: "rgba(74,222,128,0.3)",
    border: "rgba(74,222,128,0.4)",
    bg: "rgba(74,222,128,0.08)",
    text: "#4ade80",
    iconBg: "rgba(74,222,128,0.12)",
  },
  violet: {
    glow: "rgba(167,139,250,0.3)",
    border: "rgba(167,139,250,0.4)",
    bg: "rgba(167,139,250,0.08)",
    text: "#a78bfa",
    iconBg: "rgba(167,139,250,0.12)",
  },
};

export default function TrackCard({ id, title, description, icon, color, onClick }: TrackCardProps) {
  const c = colorMap[color];

  return (
    <motion.div
      id={`track-card-${id}`}
      className="glass glass-hover relative cursor-pointer flex flex-col p-7 gap-5"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        boxShadow: `0 0 40px ${c.glow}, 0 8px 40px rgba(0,0,0,0.5)`,
        borderColor: c.border,
        y: -4,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      style={{ minHeight: 260 }}
    >
      {/* Subtle top-edge glow line */}
      <div
        className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, transparent, ${c.text}40, transparent)` }}
      />

      {/* Icon */}
      <div
        className="flex items-center justify-center w-16 h-16 rounded-2xl text-3xl"
        style={{ background: c.iconBg }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </div>

      {/* CTA */}
      <motion.button
        className="mt-auto w-full py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all"
        style={{
          background: c.bg,
          color: c.text,
          border: `1px solid ${c.border}`,
        }}
        whileHover={{
          background: `linear-gradient(135deg, ${c.text}20, ${c.text}10)`,
          boxShadow: `0 0 16px ${c.glow}`,
        }}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        Start Calibration →
      </motion.button>
    </motion.div>
  );
}
