"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Internal Step Types ──────────────────────────────────────────────────────

type StepType = "init" | "outer" | "check" | "found" | "done";

interface VizStep {
  type: StepType;
  tag: string;
  msg: string; // may contain <strong> / <span class> HTML
  i: number;
  j: number;
  map: Record<string, number>;
  result?: { ok: boolean; text: string };
  line: number;
  freshKey?: string | number;
  storedKey?: string | number;
}

type Mode = "brute" | "optimal";

// ─── Step Builders ────────────────────────────────────────────────────────────

function buildBrute(arr: number[], tgt: number): VizStep[] {
  const s: VizStep[] = [];
  s.push({ type: "init", tag: "Start", msg: `Array loaded — n = <strong style="color:#38bdf8">${arr.length}</strong>. Target = <strong style="color:#4ade80">${tgt}</strong>. Checking every pair (i, j) where i < j.`, i: -1, j: -1, map: {}, line: 1 });
  for (let i = 0; i < arr.length; i++) {
    s.push({ type: "outer", tag: `i = ${i}`, msg: `Outer loop: i = <strong style="color:#38bdf8">${i}</strong>, nums[i] = <strong style="color:#38bdf8">${arr[i]}</strong>. Now checking all j > ${i}.`, i, j: -1, map: {}, line: 3 });
    for (let j = i + 1; j < arr.length; j++) {
      const sum = arr[i] + arr[j];
      const hit = sum === tgt;
      s.push({
        type: hit ? "found" : "check",
        tag: hit ? "✓ Found!" : `i=${i}, j=${j}`,
        msg: hit
          ? `<span style="color:#4ade80">nums[${i}] + nums[${j}] = ${arr[i]} + ${arr[j]} = <strong>${sum}</strong> == ${tgt} ✓ Match found!</span>`
          : `nums[${i}] + nums[${j}] = ${arr[i]} + ${arr[j]} = <strong style="color:#f87171">${sum}</strong> ≠ ${tgt} — keep scanning.`,
        i, j, map: {}, line: hit ? 6 : 5,
      });
      if (hit) {
        s.push({ type: "done", tag: "Done", msg: `<span style="color:#4ade80">Answer: indices <strong>[${i}, ${j}]</strong> — values ${arr[i]} and ${arr[j]} sum to ${tgt}.</span>`, i, j, map: {}, result: { ok: true, text: `[${i}, ${j}]` }, line: 6 });
        return s;
      }
    }
  }
  s.push({ type: "done", tag: "No solution", msg: `All pairs checked. No two elements sum to <strong style="color:#f87171">${tgt}</strong>.`, i: -1, j: -1, map: {}, result: { ok: false, text: "No solution found" }, line: 7 });
  return s;
}

function buildOptimal(arr: number[], tgt: number): VizStep[] {
  const s: VizStep[] = [];
  s.push({ type: "init", tag: "Start", msg: `Array loaded — n = <strong style="color:#38bdf8">${arr.length}</strong>. Target = <strong style="color:#4ade80">${tgt}</strong>. Single pass using a hash map.`, i: -1, j: -1, map: {}, line: 1 });
  const m: Record<string, number> = {};
  for (let i = 0; i < arr.length; i++) {
    const comp = tgt - arr[i];
    const found = Object.prototype.hasOwnProperty.call(m, comp);
    const snap = { ...m };
    if (found) {
      s.push({ type: "found", tag: "✓ Complement found!", msg: `i = ${i}, x = <strong style="color:#38bdf8">${arr[i]}</strong>. Complement = ${tgt} − ${arr[i]} = <strong style="color:#38bdf8">${comp}</strong>. <span style="color:#4ade80"><strong>${comp}</strong> is in the map at index ${m[comp]}!</span>`, i, j: m[comp], map: snap, freshKey: comp, line: 5 });
      s.push({ type: "done", tag: "Done", msg: `<span style="color:#4ade80">Answer: indices <strong>[${m[comp]}, ${i}]</strong> — values ${arr[m[comp]]} and ${arr[i]} sum to ${tgt}.</span>`, i, j: m[comp], map: snap, result: { ok: true, text: `[${m[comp]}, ${i}]` }, line: 6 });
      return s;
    }
    s.push({ type: "check", tag: `i = ${i}`, msg: `i = ${i}, x = <strong style="color:#38bdf8">${arr[i]}</strong>. Need complement <strong style="color:#a78bfa">${comp}</strong> — not in map yet. Storing <strong>${arr[i]} → ${i}</strong>.`, i, j: -1, map: snap, storedKey: arr[i], line: 7 });
    m[String(arr[i])] = i;
  }
  s.push({ type: "done", tag: "No solution", msg: `Scanned all elements. No complementary pair found for target <strong style="color:#f87171">${tgt}</strong>.`, i: -1, j: -1, map: { ...m }, result: { ok: false, text: "No solution found" }, line: 8 });
  return s;
}

// ─── Pseudocode ───────────────────────────────────────────────────────────────

const PSEUDO: Record<Mode, { title: string; lines: { id: number; html: string }[] }> = {
  brute: {
    title: "Brute Force",
    lines: [
      { id: 1, html: `<span style="color:#7dd3fc">def</span> <span style="color:#38bdf8">twoSum</span>(nums, target):` },
      { id: 2, html: `&nbsp;&nbsp;n = <span style="color:#7dd3fc">len</span>(nums)` },
      { id: 3, html: `&nbsp;&nbsp;<span style="color:#7dd3fc">for</span> i <span style="color:#7dd3fc">in</span> <span style="color:#7dd3fc">range</span>(n):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># outer loop</span>` },
      { id: 4, html: `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#7dd3fc">for</span> j <span style="color:#7dd3fc">in</span> <span style="color:#7dd3fc">range</span>(i + <span style="color:#86efac">1</span>, n):&nbsp;&nbsp;<span style="color:#475569"># inner loop</span>` },
      { id: 5, html: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#7dd3fc">if</span> nums[i] + nums[j] == target:` },
      { id: 6, html: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> [i, j]&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># ✓ found!</span>` },
      { id: 7, html: `&nbsp;&nbsp;<span style="color:#c084fc">return</span> []&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># no solution</span>` },
    ],
  },
  optimal: {
    title: "Optimal — Hash Map",
    lines: [
      { id: 1, html: `<span style="color:#7dd3fc">def</span> <span style="color:#38bdf8">twoSum</span>(nums, target):` },
      { id: 2, html: `&nbsp;&nbsp;seen = {}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># val → index</span>` },
      { id: 3, html: `&nbsp;&nbsp;<span style="color:#7dd3fc">for</span> i, x <span style="color:#7dd3fc">in</span> <span style="color:#7dd3fc">enumerate</span>(nums):` },
      { id: 4, html: `&nbsp;&nbsp;&nbsp;&nbsp;comp = target - x&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># need this</span>` },
      { id: 5, html: `&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#7dd3fc">if</span> comp <span style="color:#7dd3fc">in</span> seen:` },
      { id: 6, html: `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#c084fc">return</span> [seen[comp], i]&nbsp;&nbsp;<span style="color:#475569"># ✓ found!</span>` },
      { id: 7, html: `&nbsp;&nbsp;&nbsp;&nbsp;seen[x] = i&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569"># store for later</span>` },
      { id: 8, html: `&nbsp;&nbsp;<span style="color:#c084fc">return</span> []` },
    ],
  },
};

// ─── Walkthrough cards ────────────────────────────────────────────────────────

const WALKTHROUGHS: Record<Mode, { num: string; title: string; body: string }[]> = {
  brute: [
    { num: "01", title: "Pick pointer i (outer)", body: "Fix one element at index i. This outer loop runs from 0 to n-1, anchoring the first number of each pair." },
    { num: "02", title: "Scan with pointer j (inner)", body: "For every i, run j from i+1 to the end. This inner loop checks every pair — hence the nested structure." },
    { num: "03", title: "Compare the sum", body: "If nums[i] + nums[j] == target, return [i, j] immediately. No further scanning needed." },
    { num: "04", title: "Why O(n²)?", body: "For n elements: n×(n-1)/2 comparisons total. Two nested loops = quadratic growth in the worst case." },
  ],
  optimal: [
    { num: "01", title: "Create a hash map", body: "An empty map stores { value → index } for each element we visit. Lookup is O(1) constant time." },
    { num: "02", title: "Compute complement", body: "For each element x, its complement is target − x. If this value already exists in the map, we found our pair!" },
    { num: "03", title: "Lookup in O(1)", body: "Hash map lookups are constant time. We ask: have I seen this complement before? in a single step." },
    { num: "04", title: "Store & continue", body: "If no hit yet, store map[x] = i and move on. A future element may need x as its complement." },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function XRayVisualizer() {
  const [mode, setMode] = useState<Mode>("brute");
  const [arrInput, setArrInput] = useState("2, 7, 11, 15");
  const [tgtInput, setTgtInput] = useState("9");
  const [steps, setSteps] = useState<VizStep[]>([]);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [started, setStarted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const curRef = useRef(cur);
  curRef.current = cur;

  // Stop autoplay
  const stopPlay = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setPlaying(false);
  }, []);

  // Reset
  const resetState = useCallback(() => {
    stopPlay();
    setSteps([]);
    setCur(0);
    setStarted(false);
  }, [stopPlay]);

  // Switch mode
  const switchMode = (m: Mode) => {
    setMode(m);
    resetState();
  };

  // Parse + build steps
  const startViz = () => {
    stopPlay();
    const parsed = arrInput.split(",").map((x) => parseInt(x.trim())).filter((x) => !isNaN(x));
    const tgt = parseInt(tgtInput);
    if (parsed.length < 2 || isNaN(tgt)) return;
    const built = mode === "brute" ? buildBrute(parsed, tgt) : buildOptimal(parsed, tgt);
    setSteps(built);
    setCur(0);
    setStarted(true);
  };

  // Random example
  const loadRandom = () => {
    const n = Math.floor(Math.random() * 4) + 4;
    const a = Array.from({ length: n }, () => Math.floor(Math.random() * 14) + 1);
    const i1 = Math.floor(Math.random() * n);
    let i2 = Math.floor(Math.random() * n);
    while (i2 === i1) i2 = Math.floor(Math.random() * n);
    const t = a[i1] + a[i2];
    setArrInput(a.join(", "));
    setTgtInput(String(t));
    resetState();
  };

  // Autoplay ticker
  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      const next = curRef.current + 1;
      if (next >= steps.length) { stopPlay(); return; }
      setCur(next);
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [playing, speed, steps.length, stopPlay]);

  const togglePlay = () => {
    if (playing) { stopPlay(); return; }
    if (!started) { startViz(); setTimeout(() => setPlaying(true), 50); return; }
    if (cur >= steps.length - 1) setCur(0);
    setPlaying(true);
  };

  const step = steps[cur];
  const arr = arrInput.split(",").map((x) => parseInt(x.trim())).filter((x) => !isNaN(x));
  const tgt = parseInt(tgtInput);

  // Complexity values
  const TC = mode === "brute" ? "O(n²)" : "O(n)";
  const SC = mode === "brute" ? "O(1)" : "O(n)";
  const pseudo = PSEUDO[mode];

  return (
    <div className="flex flex-col gap-0 w-full font-sans" style={{ color: "var(--text-primary)" }}>

      {/* ── Header / Mode Tabs ──────────────────────────────────────────────── */}
      <div
        className="rounded-t-2xl px-5 py-4 flex flex-col gap-4"
        style={{ background: "rgba(10,22,40,0.9)", borderBottom: "1px solid rgba(56,189,248,0.1)" }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-base">👁️</span>
            <span className="text-sm font-bold" style={{ color: "#38bdf8" }}>X-Ray Logic Visualizer</span>
          </div>
          <span
            className="text-xs font-mono-code px-2.5 py-1 rounded-full"
            style={{ background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.18)", color: "#38bdf8" }}
          >
            LeetCode #1 · Arrays · Hash Maps
          </span>
        </div>

        {/* Mode tabs */}
        <div
          className="grid grid-cols-2 gap-1 p-1 rounded-xl"
          style={{ background: "rgba(2,8,23,0.6)" }}
        >
          {(["brute", "optimal"] as Mode[]).map((m) => (
            <button
              key={m}
              id={`xray-mode-${m}`}
              onClick={() => switchMode(m)}
              className="flex flex-col items-center gap-0.5 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all"
              style={
                mode === m
                  ? { background: "linear-gradient(135deg,#0ea5e9,#38bdf8)", color: "#020817" }
                  : { color: "var(--text-muted)" }
              }
            >
              {m === "brute" ? "Brute Force" : "Optimal — Hash Map"}
              <span
                className="font-mono-code text-xs font-normal"
                style={{ opacity: 0.8, fontSize: "0.65rem" }}
              >
                {m === "brute" ? "O(n²) time · O(1) space" : "O(n) time · O(n) space"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-5" style={{ background: "rgba(2,8,23,0.7)" }}>

        {/* Complexity cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Time Complexity", val: TC, icon: "⏱", accent: "#38bdf8", bg: "rgba(56,189,248,0.07)", border: "rgba(56,189,248,0.2)" },
            { label: "Space Complexity", val: SC, icon: "📦", accent: "#a78bfa", bg: "rgba(167,139,250,0.07)", border: "rgba(167,139,250,0.2)" },
          ].map((c) => (
            <motion.div
              key={c.label}
              layout
              className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <span className="text-xl">{c.icon}</span>
              <div>
                <div className="font-mono-code text-xs uppercase tracking-widest mb-0.5" style={{ color: "var(--text-muted)" }}>{c.label}</div>
                <div className="text-xl font-extrabold" style={{ color: c.accent, fontFamily: "var(--font-inter, Inter)" }}>{c.val}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input row */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-code text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Array</label>
            <input
              id="xray-arr-input"
              value={arrInput}
              onChange={(e) => { setArrInput(e.target.value); resetState(); }}
              className="h-9 px-3 rounded-lg text-sm font-mono-code outline-none transition-all"
              style={{
                background: "rgba(10,22,40,0.8)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "var(--text-primary)",
                width: 220,
              }}
              placeholder="e.g. 2, 7, 11, 15"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-code text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Target</label>
            <input
              id="xray-tgt-input"
              value={tgtInput}
              onChange={(e) => { setTgtInput(e.target.value); resetState(); }}
              className="h-9 px-3 rounded-lg text-sm font-mono-code outline-none transition-all"
              style={{
                background: "rgba(10,22,40,0.8)",
                border: "1px solid rgba(56,189,248,0.2)",
                color: "var(--text-primary)",
                width: 90,
              }}
              placeholder="9"
            />
          </div>
          <div className="flex gap-2">
            <button id="xray-visualize-btn" className="btn-primary h-9 px-4 text-sm" onClick={startViz}>
              ▶ Visualize
            </button>
            <button id="xray-random-btn" className="btn-ghost h-9 px-3 text-sm" onClick={loadRandom}>
              ⟳ Random
            </button>
          </div>
        </div>

        {/* Array display */}
        <div>
          <div className="font-mono-code text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
            Array
          </div>
          <div className="flex flex-wrap gap-2 items-end min-h-[72px]">
            {!started ? (
              <span className="font-mono-code text-sm" style={{ color: "var(--text-muted)" }}>
                Hit Visualize to begin →
              </span>
            ) : (
              <>
                {arr.map((v, idx) => {
                  let bg = "rgba(10,22,40,0.7)";
                  let border = "rgba(56,189,248,0.15)";
                  let color = "#94a3b8";
                  let glow = "none";
                  let transform = "none";

                  if (step) {
                    const isDone = step.type === "found" || step.type === "done";
                    if (isDone) {
                      if (idx === step.i || idx === step.j) {
                        bg = "rgba(74,222,128,0.2)"; border = "#4ade80"; color = "#4ade80";
                        glow = "0 0 20px rgba(74,222,128,0.4)";
                        transform = "translateY(-4px)";
                      } else {
                        bg = "rgba(10,22,40,0.3)"; border = "rgba(56,189,248,0.05)"; color = "#334155";
                      }
                    } else {
                      if (idx === step.i) {
                        bg = "rgba(56,189,248,0.18)"; border = "#38bdf8"; color = "#38bdf8";
                        glow = "0 0 18px rgba(56,189,248,0.4)"; transform = "translateY(-3px)";
                      } else if (idx === step.j) {
                        bg = "rgba(248,113,113,0.18)"; border = "#f87171"; color = "#f87171";
                        glow = "0 0 16px rgba(248,113,113,0.3)"; transform = "translateY(-3px)";
                      } else if (
                        mode === "optimal" && step.map &&
                        Object.prototype.hasOwnProperty.call(step.map, v) &&
                        step.map[String(v)] === idx
                      ) {
                        bg = "rgba(167,139,250,0.15)"; border = "#a78bfa"; color = "#a78bfa";
                      }
                    }
                  }

                  return (
                    <motion.div
                      key={idx}
                      className="flex flex-col items-center gap-1.5"
                      animate={{ y: transform === "none" ? 0 : -4 }}
                      transition={{ duration: 0.25 }}
                    >
                      <motion.div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base font-mono-code"
                        animate={{ background: bg, borderColor: border, color, boxShadow: glow }}
                        transition={{ duration: 0.25 }}
                        style={{ border: `1.5px solid ${border}` }}
                      >
                        {v}
                      </motion.div>
                      <span className="font-mono-code" style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                        [{idx}]
                      </span>
                    </motion.div>
                  );
                })}
                {!isNaN(tgt) && (
                  <div
                    className="ml-2 self-center px-3 py-1.5 rounded-lg font-mono-code text-xs"
                    style={{ background: "rgba(56,189,248,0.06)", border: "1px dashed rgba(56,189,248,0.2)", color: "var(--text-muted)" }}
                  >
                    target = {tgt}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Step info terminal */}
        <div
          className="rounded-xl px-4 py-3 min-h-[68px] flex flex-col justify-center"
          style={{ background: "rgba(2,8,23,0.95)", border: "1px solid rgba(56,189,248,0.1)" }}
        >
          <div className="font-mono-code text-xs uppercase tracking-widest mb-1.5" style={{ color: "var(--text-muted)" }}>
            {step?.tag ?? "Idle"}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={cur}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="text-sm leading-relaxed font-mono-code"
              style={{ color: "#cbd5e1" }}
              dangerouslySetInnerHTML={{
                __html: step
                  ? `<span style="color:#4ade80">&gt; </span>${step.msg}`
                  : `<span style="color:#475569">&gt; Configure the array and target above, then click Visualize.</span>`,
              }}
            />
          </AnimatePresence>
        </div>

        {/* Hash map (optimal only) */}
        {mode === "optimal" && started && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="font-mono-code text-xs uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>
              Hash Map — value → index
            </div>
            <div className="flex flex-wrap gap-2 min-h-[36px] items-center">
              {!step || Object.keys(step.map).length === 0 ? (
                <span className="font-mono-code text-xs" style={{ color: "var(--text-muted)" }}>{"{ } empty"}</span>
              ) : (
                Object.entries(step.map).map(([k, v]) => {
                  const isFresh = String(k) === String(step.freshKey) || String(k) === String(step.storedKey);
                  return (
                    <motion.div
                      key={k}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex overflow-hidden rounded-lg font-mono-code text-xs"
                      style={{ border: isFresh ? "1px solid rgba(56,189,248,0.5)" : "1px solid rgba(56,189,248,0.15)" }}
                    >
                      <span
                        className="px-2.5 py-1.5 font-semibold"
                        style={{ background: isFresh ? "rgba(56,189,248,0.15)" : "rgba(10,22,40,0.8)", color: isFresh ? "#38bdf8" : "#94a3b8", borderRight: "1px solid rgba(56,189,248,0.15)" }}
                      >
                        {k}
                      </span>
                      <span className="px-2 py-1.5" style={{ background: "rgba(2,8,23,0.6)", color: "var(--text-muted)" }}>
                        idx {v}
                      </span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* Result banner */}
        <AnimatePresence>
          {step?.result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={
                step.result.ok
                  ? { background: "rgba(74,222,128,0.12)", border: "1.5px solid rgba(74,222,128,0.4)", color: "#4ade80" }
                  : { background: "rgba(248,113,113,0.1)", border: "1.5px solid rgba(248,113,113,0.3)", color: "#f87171" }
              }
            >
              {step.result.ok ? `✓ Found: ${step.result.text}` : `✗ ${step.result.text}`}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {started && (
          <div
            className="flex flex-wrap items-center gap-2 pt-3"
            style={{ borderTop: "1px solid rgba(56,189,248,0.08)" }}
          >
            <button
              id="xray-prev-btn"
              disabled={cur === 0}
              onClick={() => { stopPlay(); setCur((c) => Math.max(0, c - 1)); }}
              className="btn-ghost h-8 px-3 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              id="xray-next-btn"
              disabled={cur >= steps.length - 1}
              onClick={() => { stopPlay(); setCur((c) => Math.min(steps.length - 1, c + 1)); }}
              className="btn-ghost h-8 px-3 text-xs disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
            <button
              id="xray-play-btn"
              onClick={togglePlay}
              className="btn-primary h-8 px-4 text-xs min-w-[72px]"
            >
              {playing ? "⏸ Pause" : "▶ Play"}
            </button>

            {/* Speed */}
            <div className="flex items-center gap-2 ml-1">
              <span className="font-mono-code text-xs" style={{ color: "var(--text-muted)" }}>Speed</span>
              <input
                type="range"
                min={150}
                max={1800}
                step={50}
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-20 h-1 rounded-full outline-none cursor-pointer accent-cyan-400"
                style={{ accentColor: "#38bdf8" }}
              />
            </div>

            {/* Step counter */}
            <span className="ml-auto font-mono-code text-xs" style={{ color: "var(--text-muted)" }}>
              Step <span style={{ color: "#38bdf8", fontWeight: 700 }}>{cur + 1}</span> / {steps.length}
            </span>

            {/* Mini progress bar */}
            <div className="w-full h-px rounded-full overflow-hidden mt-1" style={{ background: "rgba(56,189,248,0.08)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg,#0ea5e9,#4ade80)" }}
                animate={{ width: `${((cur + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Pseudocode ────────────────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 flex flex-col gap-3"
        style={{ background: "rgba(5,12,28,0.95)", borderTop: "1px solid rgba(56,189,248,0.08)" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            {pseudo.title} — Pseudocode
          </span>
          <span className="font-mono-code text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Python-style
          </span>
        </div>

        {/* Terminal window chrome */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(56,189,248,0.1)" }}>
          <div className="flex items-center gap-1.5 px-3 py-2" style={{ background: "rgba(10,22,40,0.9)", borderBottom: "1px solid rgba(56,189,248,0.05)" }}>
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
          </div>
          <div className="p-4 font-mono-code text-sm leading-loose" style={{ background: "rgba(2,8,23,0.9)" }}>
            {pseudo.lines.map((ln) => {
              const isActive = step?.line === ln.id;
              return (
                <motion.div
                  key={`${mode}-${ln.id}`}
                  animate={
                    isActive
                      ? { background: "rgba(56,189,248,0.08)", borderLeftColor: "#38bdf8" }
                      : { background: "transparent", borderLeftColor: "transparent" }
                  }
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 px-2 -mx-2 rounded-r"
                  style={{ borderLeft: "2px solid transparent" }}
                >
                  <span
                    className="w-5 text-right flex-shrink-0 select-none"
                    style={{ color: isActive ? "#38bdf8" : "#334155" }}
                  >
                    {ln.id}
                  </span>
                  <span
                    dangerouslySetInnerHTML={{ __html: ln.html }}
                    style={{ color: isActive ? "#f0f9ff" : "#475569" }}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <div
        className="px-5 py-4 rounded-b-2xl"
        style={{ background: "rgba(10,22,40,0.6)", borderTop: "1px solid rgba(56,189,248,0.08)" }}
      >
        <div className="font-mono-code text-xs uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
          How It Works
        </div>
        <div className="grid grid-cols-2 gap-3">
          {WALKTHROUGHS[mode].map((w) => (
            <div
              key={w.num}
              className="rounded-xl p-3 relative overflow-hidden"
              style={{ background: "rgba(2,8,23,0.7)", border: "1px solid rgba(56,189,248,0.1)" }}
            >
              <div
                className="absolute top-2 right-3 font-extrabold text-3xl leading-none select-none"
                style={{ color: "rgba(56,189,248,0.07)", fontFamily: "Inter, sans-serif" }}
              >
                {w.num}
              </div>
              <div className="text-sm font-bold mb-1" style={{ color: "var(--text-primary)" }}>{w.title}</div>
              <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{w.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
