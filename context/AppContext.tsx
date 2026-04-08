"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  AppState,
  AlienRank,
  OAPayload,
  OAEvaluationResult,
  RadarScores,
  UserRoadmap,
} from "@/lib/types";

// ─── State shape ─────────────────────────────────────────────────────────────

const INITIAL_STATE: AppState = {
  selectedTrack: null,
  radarScores: null,
  alienRank: null,
  summaryFeedback: null,
  roadmap: null,
  oaPayload: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_TRACK"; track: string }
  | { type: "SET_OA_PAYLOAD"; payload: OAPayload }
  | { type: "SET_EVALUATION"; result: OAEvaluationResult }
  | { type: "SET_ROADMAP"; roadmap: UserRoadmap }
  | { type: "COMPLETE_TASK"; day: number; taskId: string; feedback: string }
  | { type: "INCREMENT_STREAK" }
  | { type: "HYDRATE"; state: AppState };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_TRACK":
      return { ...state, selectedTrack: action.track };

    case "SET_OA_PAYLOAD":
      return { ...state, oaPayload: action.payload };

    case "SET_EVALUATION": {
      const { radar_scores, alien_rank, summary_feedback, roadmap } = action.result;
      const today = new Date().toISOString().split("T")[0];

      // Build UserRoadmap from AI result
      const tasks: UserRoadmap["tasks"] = {};
      for (const [dayKey, problems] of Object.entries(roadmap)) {
        const dayNum = parseInt(dayKey.replace("day_", ""), 10);
        tasks[dayNum] = problems.map((p, i) => ({
          id: `${dayNum}-${i}`,
          title: p.title,
          externalLink: p.url,
          topic: p.topic,
          difficulty: p.difficulty,
          status: dayNum === 1 ? "pending" : "locked",
        }));
      }

      const userRoadmap: UserRoadmap = {
        currentDay: 1,
        streak: 0,
        lastLoginDate: today,
        tasks,
      };

      return {
        ...state,
        radarScores: radar_scores,
        alienRank: alien_rank,
        summaryFeedback: summary_feedback,
        roadmap: userRoadmap,
      };
    }

    case "SET_ROADMAP":
      return { ...state, roadmap: action.roadmap };

    case "COMPLETE_TASK": {
      if (!state.roadmap) return state;
      const { day, taskId, feedback } = action;
      const dayTasks = state.roadmap.tasks[day] ?? [];
      const updated = dayTasks.map((t) =>
        t.id === taskId
          ? { ...t, status: "completed" as const, aiFeedback: feedback }
          : t
      );

      // If all tasks for today are completed → unlock next day
      const allDone = updated.every((t) => t.status === "completed");
      const newTasks = { ...state.roadmap.tasks, [day]: updated };

      if (allDone && day < 7) {
        const nextDay = state.roadmap.tasks[day + 1] ?? [];
        newTasks[day + 1] = nextDay.map((t) => ({ ...t, status: "pending" as const }));
      }

      const newDay = allDone && day < 7 ? day + 1 : state.roadmap.currentDay;
      const today = new Date().toISOString().split("T")[0];
      const newStreak =
        state.roadmap.lastLoginDate !== today
          ? state.roadmap.streak + 1
          : state.roadmap.streak;

      return {
        ...state,
        roadmap: {
          ...state.roadmap,
          currentDay: newDay,
          streak: newStreak,
          lastLoginDate: today,
          tasks: newTasks,
        },
      };
    }

    case "INCREMENT_STREAK": {
      if (!state.roadmap) return state;
      return {
        ...state,
        roadmap: { ...state.roadmap, streak: state.roadmap.streak + 1 },
      };
    }

    case "HYDRATE":
      return action.state;

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "alien-learn-state";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as AppState;
        dispatch({ type: "HYDRATE", state: saved });
      }
    } catch {
      // ignore
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  }, [state, isHydrated]);

  return (
    <AppContext.Provider value={{ state, dispatch, isHydrated }}>
      {children}
    </AppContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within <AppProvider>");
  return ctx;
}
