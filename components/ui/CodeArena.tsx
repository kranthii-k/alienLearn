"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CalibrationProblem, CodeSubmission } from "@/lib/types";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface CodeArenaProps {
  problems: CalibrationProblem[];
  onFinalSubmit: (submissions: CodeSubmission[]) => void;
  timeLimitMinutes?: number;
}

function parseMarkdownDescription(md: string) {
  // Simple markdown → HTML (no library needed for this small scope)
  return md
    .replace(/## (.+)/g, '<h2 class="text-base font-bold mb-2" style="color:var(--text-primary)">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:var(--text-primary)">$1</strong>')
    .replace(/`(.+?)`/g, '<code style="background:rgba(56,189,248,0.1);color:#38bdf8;padding:1px 5px;border-radius:4px;font-family:monospace">$1</code>')
    .replace(/```[\w]*\n([\s\S]*?)```/g, '<pre style="background:rgba(2,8,23,0.8);border:1px solid rgba(56,189,248,0.12);padding:12px;border-radius:8px;font-size:0.8rem;color:#94a3b8;overflow-x:auto;margin:8px 0"><code>$1</code></pre>')
    .replace(/\n/g, "<br/>");
}

function useCountdown(minutes: number, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          onExpire();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const pct = secondsLeft / (minutes * 60);

  return { display: `${mm}:${ss}`, pct, secondsLeft };
}

export default function CodeArena({ problems, onFinalSubmit, timeLimitMinutes = 45 }: CodeArenaProps) {
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const [codes, setCodes] = useState<string[]>(problems.map((p) => p.starterCode));
  const [testResults, setTestResults] = useState<Record<number, { passed: number; total: number; output: string }>>({});
  const [running, setRunning] = useState(false);

  const currentProblem = problems[currentProblemIdx];
  const currentCode = codes[currentProblemIdx];

  const handleCodeChange = (val: string | undefined) => {
    setCodes((prev) => {
      const next = [...prev];
      next[currentProblemIdx] = val ?? "";
      return next;
    });
  };

  const handleRun = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      // Simulate test results
      const total = currentProblem.testCases.length;
      const passed = Math.min(total, Math.floor(Math.random() * (total + 1)));
      setTestResults((prev) => ({
        ...prev,
        [currentProblemIdx]: {
          passed,
          total,
          output: currentProblem.testCases
            .slice(0, passed)
            .map((tc, i) => `✓ Test ${i + 1}: ${tc.description} → Passed`)
            .concat(
              currentProblem.testCases
                .slice(passed)
                .map((tc, i) => `✗ Test ${passed + i + 1}: ${tc.description} → Failed`)
            )
            .join("\n"),
        },
      }));
      setRunning(false);
    }, 800);
  }, [currentProblem, currentProblemIdx]);

  const handleFinalSubmit = () => {
    const submissions: CodeSubmission[] = problems.map((p, i) => ({
      problemId: p.id,
      problemTitle: p.title,
      language: "typescript",
      code: codes[i],
      testsPassed: testResults[i]?.passed ?? 0,
      totalTests: testResults[i]?.total ?? p.testCases.length,
      executionTimeMs: Math.floor(Math.random() * 200) + 50,
    }));
    onFinalSubmit(submissions);
  };

  const { display: timerDisplay, pct, secondsLeft } = useCountdown(timeLimitMinutes, handleFinalSubmit);
  const timerColor = pct > 0.5 ? "#4ade80" : pct > 0.25 ? "#facc15" : "#f87171";

  return (
    <div className="flex flex-col h-full min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-5 py-3 flex-shrink-0"
        style={{ background: "rgba(10,22,40,0.9)", borderBottom: "1px solid rgba(56,189,248,0.08)" }}
      >
        {/* Problem tabs */}
        <div className="flex items-center gap-2">
          {problems.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setCurrentProblemIdx(i)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={
                i === currentProblemIdx
                  ? { background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)" }
                  : { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" }
              }
            >
              P{i + 1}{" "}
              <span
                className="ml-1 text-xs"
                style={{
                  color:
                    p.difficulty === "Easy" ? "#4ade80" : p.difficulty === "Medium" ? "#facc15" : "#f87171",
                }}
              >
                {p.difficulty}
              </span>
              {testResults[i] && (
                <span className="ml-1.5" style={{ color: testResults[i].passed === testResults[i].total ? "#4ade80" : "#f87171" }}>
                  {testResults[i].passed === testResults[i].total ? "✓" : "✗"}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="text-lg font-bold font-mono-code tracking-widest"
              style={{ color: timerColor }}
            >
              {timerDisplay}
            </div>
            {/* Mini progress arc */}
            <svg width="20" height="20" viewBox="0 0 20 20">
              <circle cx="10" cy="10" r="8" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
              <circle
                cx="10" cy="10" r="8"
                fill="none"
                stroke={timerColor}
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 8 * pct} ${2 * Math.PI * 8}`}
                strokeLinecap="round"
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>

          <button
            className="btn-primary py-2 px-4 text-sm"
            onClick={handleFinalSubmit}
          >
            Submit Assessment →
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem Description */}
        <div
          className="w-2/5 flex-shrink-0 overflow-y-auto p-5"
          style={{ borderRight: "1px solid rgba(56,189,248,0.07)" }}
        >
          <div className="mb-3">
            <span
              className={`badge ${
                currentProblem.difficulty === "Easy"
                  ? "badge-easy"
                  : currentProblem.difficulty === "Medium"
                  ? "badge-medium"
                  : "badge-hard"
              } mr-2`}
            >
              {currentProblem.difficulty}
            </span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              {currentProblem.title}
            </span>
          </div>

          <div
            className="prose-sm leading-relaxed text-sm"
            style={{ color: "var(--text-secondary)" }}
            dangerouslySetInnerHTML={{ __html: parseMarkdownDescription(currentProblem.description) }}
          />

          {/* Test cases */}
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--text-muted)" }}>
              Test Cases
            </h4>
            {currentProblem.testCases.map((tc, i) => (
              <div
                key={i}
                className="rounded-lg p-3 mb-2 text-xs font-mono-code"
                style={{
                  background: "rgba(2,8,23,0.6)",
                  border: "1px solid rgba(56,189,248,0.08)",
                  color: "#94a3b8",
                }}
              >
                <div style={{ color: "#38bdf8" }}>Input: {tc.input}</div>
                <div style={{ color: "#4ade80" }}>Expected: {tc.expected}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{tc.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Editor + Terminal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Monaco Editor */}
          <div className="flex-1 overflow-hidden">
            <MonacoEditor
              height="100%"
              defaultLanguage="typescript"
              value={currentCode}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                padding: { top: 12, bottom: 12 },
                bracketPairColorization: { enabled: true },
                suggest: { showKeywords: true },
              }}
            />
          </div>

          {/* Terminal / Output */}
          <div
            className="flex-shrink-0"
            style={{
              height: 160,
              borderTop: "1px solid rgba(56,189,248,0.08)",
              background: "rgba(2,8,23,0.95)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-2"
              style={{ borderBottom: "1px solid rgba(56,189,248,0.06)" }}
            >
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                Terminal
              </span>
              <button
                className="btn-ghost py-1 px-3 text-xs"
                onClick={handleRun}
                disabled={running}
              >
                {running ? "Running..." : "▶ Run Tests"}
              </button>
            </div>

            <div className="p-4 h-full overflow-y-auto font-mono-code text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
              {testResults[currentProblemIdx] ? (
                <div>
                  {testResults[currentProblemIdx].output.split("\n").map((line, i) => (
                    <div
                      key={i}
                      style={{
                        color: line.startsWith("✓") ? "#4ade80" : line.startsWith("✗") ? "#f87171" : "#94a3b8",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                  <div className="mt-2" style={{ color: "var(--text-muted)" }}>
                    {testResults[currentProblemIdx].passed}/{testResults[currentProblemIdx].total} tests passed
                  </div>
                </div>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  {">"} Click &quot;Run Tests&quot; to validate your solution
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
