// ─── Core Domain Types ───────────────────────────────────────────────────────

export type Difficulty = "Easy" | "Medium" | "Hard";
export type TaskStatus = "locked" | "pending" | "completed";

export interface DailyTask {
  id: string;
  title: string;
  externalLink: string;
  topic: string;
  difficulty: Difficulty;
  status: TaskStatus;
  aiFeedback?: string;
}

export interface UserRoadmap {
  currentDay: number;
  streak: number;
  lastLoginDate: string; // ISO date string
  tasks: Record<number, DailyTask[]>; // day number → tasks
}

// ─── Radar / Assessment Types ────────────────────────────────────────────────

export interface RadarScores {
  logic: number;
  optimization: number;
  clean_code: number;
  edge_cases: number;
  speed: number;
}

export type AlienRank =
  | "Code Padawan"
  | "Syntax Sorcerer"
  | "Brute-Force Brawler"
  | "Recursion Ranger"
  | "Optimization Oracle"
  | "Algorithm Architect"
  | "Grand Master Coder";

// ─── Calibration / Submission Types ─────────────────────────────────────────

export interface CodeSubmission {
  problemId: string;
  problemTitle: string;
  language: string;
  code: string;
  testsPassed: number;
  totalTests: number;
  executionTimeMs: number;
}

export interface OAPayload {
  track: string;
  submissions: CodeSubmission[];
}

// ─── API Response Types ──────────────────────────────────────────────────────

export interface OAEvaluationResult {
  radar_scores: RadarScores;
  alien_rank: AlienRank;
  summary_feedback: string;
  roadmap: Record<string, Array<{ title: string; topic: string; url: string; difficulty: Difficulty }>>;
}

export interface DailyEvaluationResult {
  feedback: string;
  next_spaced_repetition_topic: string;
  days_until_repetition: number;
}

// ─── App-wide State ──────────────────────────────────────────────────────────

export interface AppState {
  /** selected track: "react" | "typescript" | "dsa" */
  selectedTrack: string | null;
  radarScores: RadarScores | null;
  alienRank: AlienRank | null;
  summaryFeedback: string | null;
  roadmap: UserRoadmap | null;
  /** calibration submissions cached for /results */
  oaPayload: OAPayload | null;
}

// ─── Track Definition ────────────────────────────────────────────────────────

export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon key
  color: "blue" | "green" | "violet";
  problems: CalibrationProblem[];
}

export interface CalibrationProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  starterCode: string;
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expected: string;
  description: string;
}
