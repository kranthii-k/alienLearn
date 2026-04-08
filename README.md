# 👽 Alien Learn — AI-Powered Placement Prep

A full-stack Next.js 16 application with an AI-driven calibration engine that builds personalized 7-day spaced repetition roadmaps for technical placement preparation.

## ✨ Features

- **Track Selection** — Choose DSA, React, or TypeScript tracks
- **Calibration OA** — Monaco-powered split-screen coding assessment (45 min, 3 problems)
- **AI Analysis** — Deep skill profiling across 5 vectors: Logic, Optimization, Clean Code, Speed, Edge Cases
- **Alien Rank System** — 7 tiers from "Code Padawan" to "Grand Master Coder"
- **7-Day Roadmap** — Personalized spaced-repetition daily problems
- **Daily Feedback** — AI evaluates each submission with targeted next steps

## 🛠 Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion 12 |
| Code Editor | @monaco-editor/react |
| Charts | Recharts |
| State | React Context + localStorage |
| AI Backend | DeepSeek API (mock mode by default) |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/alien-learn`.

## 🔧 Environment Variables

Create a `.env.local` file:

```env
# Use mock AI (no API key needed)
NEXT_PUBLIC_USE_MOCK_AI=true

# To use real DeepSeek AI, set this and change MOCK to false:
# DEEPSEEK_API_KEY=your_key_here
# NEXT_PUBLIC_USE_MOCK_AI=false
```

## 📁 Project Structure

```
app/
  alien-learn/
    page.tsx           # Track selection
    calibration/       # OA with Monaco editor
    results/           # AI reveal + radar chart
    dashboard/         # Daily roadmap + task cards
  api/
    evaluate-oa/       # POST: OA assessment → AI roadmap
    evaluate-daily/    # POST: Daily code → AI feedback
components/ui/
  TrackCard.tsx        # Glassmorphic track selector
  CodeArena.tsx        # Monaco editor + timer + terminal
  AILoadingState.tsx   # Hacker terminal loading overlay
  SkillRadarChart.tsx  # Pentagon radar with Recharts
  DailyRoadmapView.tsx # 7-day timeline stepper
  TaskCard.tsx         # Daily problem card
  SubmitModal.tsx      # Code paste + AI feedback modal
  CalibrationModal.tsx # Pre-assessment confirmation
context/
  AppContext.tsx        # Global state + localStorage
lib/
  types.ts             # All TypeScript interfaces
  tracks.ts            # Calibration problem data
  ai.ts                # AI wrapper (mock + real)
```

## 🎨 Design System

- **Background**: Deep space (`#020817`) with star-field
- **Glassmorphism cards**: `backdrop-blur(12px)` with `rgba` borders
- **Cyber Blue** `#38bdf8` — AI actions, links
- **Neon Green** `#4ade80` — Success, completions, streak
- **Typography**: Inter (UI) + JetBrains Mono (code)
