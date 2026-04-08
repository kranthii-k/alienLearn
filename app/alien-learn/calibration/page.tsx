"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CodeArena from "@/components/ui/CodeArena";
import { useAppContext } from "@/context/AppContext";
import { TRACKS } from "@/lib/tracks";
import { CodeSubmission, OAPayload } from "@/lib/types";

function CalibrationContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { dispatch } = useAppContext();

  const trackId = params.get("track") ?? "dsa";
  const track = TRACKS.find((t) => t.id === trackId) ?? TRACKS[0];

  const handleFinalSubmit = async (submissions: CodeSubmission[]) => {
    const payload: OAPayload = { track: trackId, submissions };
    dispatch({ type: "SET_OA_PAYLOAD", payload });

    try {
      const res = await fetch("/api/evaluate-oa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      dispatch({ type: "SET_EVALUATION", result });
    } catch (e) {
      console.error("OA evaluation failed", e);
    }

    router.push("/alien-learn/results");
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <CodeArena
        problems={track.problems}
        onFinalSubmit={handleFinalSubmit}
        timeLimitMinutes={45}
      />
    </div>
  );
}

export default function CalibrationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm font-mono-code" style={{ color: "var(--cyber-blue)" }}>
          Loading assessment...
        </div>
      </div>
    }>
      <CalibrationContent />
    </Suspense>
  );
}
