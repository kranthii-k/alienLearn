import { OAEvaluationResult, DailyEvaluationResult, OAPayload, Difficulty, VisualizationData } from "@/lib/types";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AI !== "false";

// ─── Mock Responses ───────────────────────────────────────────────────────────

function getMockOAResult(payload: OAPayload): OAEvaluationResult {
  const avgPassed =
    payload.submissions.reduce((s, c) => s + c.testsPassed / Math.max(c.totalTests, 1), 0) /
    Math.max(payload.submissions.length, 1);

  const base = Math.round(avgPassed * 70);

  return {
    radar_scores: {
      logic: Math.min(95, base + 15),
      optimization: Math.min(95, base - 20),
      clean_code: Math.min(95, base + 5),
      edge_cases: Math.min(95, base - 10),
      speed: Math.min(95, base + 10),
    },
    alien_rank: base > 60 ? "Recursion Ranger" : "Brute-Force Brawler",
    summary_feedback:
      "You have solid core logic, but your solutions tend toward O(n²) complexity when Hash Maps or Two-Pointer patterns would achieve O(n). This week we'll laser-focus on these linear-time patterns.",
    roadmap: {
      day_1: [
        { title: "Two Sum", topic: "Hash Maps", url: "https://leetcode.com/problems/two-sum/", difficulty: "Easy" as Difficulty },
        { title: "Valid Anagram", topic: "Hash Maps", url: "https://leetcode.com/problems/valid-anagram/", difficulty: "Easy" as Difficulty },
      ],
      day_2: [
        { title: "Contains Duplicate", topic: "Arrays", url: "https://leetcode.com/problems/contains-duplicate/", difficulty: "Easy" as Difficulty },
        { title: "Best Time to Buy and Sell Stock", topic: "Sliding Window", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", difficulty: "Easy" as Difficulty },
      ],
      day_3: [
        { title: "3Sum", topic: "Two Pointers", url: "https://leetcode.com/problems/3sum/", difficulty: "Medium" as Difficulty },
        { title: "Container With Most Water", topic: "Two Pointers", url: "https://leetcode.com/problems/container-with-most-water/", difficulty: "Medium" as Difficulty },
      ],
      day_4: [
        { title: "Subarray Sum Equals K", topic: "Hash Maps (Revisit)", url: "https://leetcode.com/problems/subarray-sum-equals-k/", difficulty: "Medium" as Difficulty },
        { title: "Longest Substring Without Repeating Characters", topic: "Sliding Window", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", difficulty: "Medium" as Difficulty },
      ],
      day_5: [
        { title: "Word Search", topic: "Backtracking", url: "https://leetcode.com/problems/word-search/", difficulty: "Medium" as Difficulty },
      ],
      day_6: [
        { title: "Combination Sum", topic: "Backtracking (Revisit)", url: "https://leetcode.com/problems/combination-sum/", difficulty: "Medium" as Difficulty },
        { title: "Number of Islands", topic: "BFS/DFS", url: "https://leetcode.com/problems/number-of-islands/", difficulty: "Medium" as Difficulty },
      ],
      day_7: [
        { title: "Merge k Sorted Lists", topic: "Heaps", url: "https://leetcode.com/problems/merge-k-sorted-lists/", difficulty: "Hard" as Difficulty },
        { title: "Find Median from Data Stream", topic: "Heaps", url: "https://leetcode.com/problems/find-median-from-data-stream/", difficulty: "Hard" as Difficulty },
      ],
    },
  };
}

function getMockDailyResult(): DailyEvaluationResult {
  return {
    feedback:
      "Excellent use of the sliding window technique to achieve O(n) time complexity! Your variable names could be slightly more descriptive — consider `left`/`right` over `l`/`r` for readability in interviews.",
    next_spaced_repetition_topic: "Sliding Window — Minimum Window Substring",
    days_until_repetition: 3,
  };
}

// ─── X-Ray Visualizer Mock Data ──────────────────────────────────────────────

/**
 * Mock visualization for "Two Sum II" using the Two-Pointer technique.
 * Array: [2, 7, 11, 15], target: 9
 */
export const MOCK_VISUALIZER_DATA: VisualizationData = {
  algorithm_name: "Two-Pointer (Two Sum II)",
  total_steps: 6,
  steps: [
    {
      step_number: 1,
      explanation:
        "Initialize two pointers: L at the start (index 0, value 2) and R at the end (index 3, value 15). We will move them toward each other based on the sum.",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 3 },
        highlighted_indexes: [0, 3],
      },
    },
    {
      step_number: 2,
      explanation:
        "Current sum = nums[L] + nums[R] = 2 + 15 = 17. This is greater than target (9), so we move R one step left to decrease the sum.",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 3 },
        highlighted_indexes: [0, 3],
      },
    },
    {
      step_number: 3,
      explanation:
        "R moves from index 3 → index 2. Now sum = nums[L] + nums[R] = 2 + 11 = 13. Still greater than 9, so we move R left again.",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 2 },
        highlighted_indexes: [0, 2],
      },
    },
    {
      step_number: 4,
      explanation:
        "R moves from index 2 → index 1. Now sum = nums[L] + nums[R] = 2 + 7 = 9. This equals the target!",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 1 },
        highlighted_indexes: [0, 1],
      },
    },
    {
      step_number: 5,
      explanation:
        "Sum matches! The answer is [L+1, R+1] = [1, 2] (1-indexed). Both L and R are on the winning pair. No further moves needed.",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 1 },
        highlighted_indexes: [0, 1],
      },
    },
    {
      step_number: 6,
      explanation:
        "Result: indices [1, 2] (1-indexed). Time complexity: O(n) — we only scanned the array once with two pointers. Space: O(1) — no extra data structures needed.",
      visual_state: {
        data_structure_type: "array",
        array_values: [2, 7, 11, 15],
        pointers: { L: 0, R: 1 },
        highlighted_indexes: [0, 1],
      },
    },
  ],
};

// ─── Real AI Call ─────────────────────────────────────────────────────────────

async function callAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY not set");

  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "deepseek-coder",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function evaluateOA(payload: OAPayload): Promise<OAEvaluationResult> {
  if (USE_MOCK) {
    // Simulate latency
    await new Promise((r) => setTimeout(r, 1500));
    return getMockOAResult(payload);
  }

  const systemPrompt = `You are an expert technical interviewer and placement mentor. Analyze the user's code submissions from their initial assessment. Evaluate their time complexity, space complexity, and code cleanliness. Based on their weaknesses, generate a personalized 7-day roadmap using spaced repetition. Output STRICTLY in JSON format matching this schema: { radar_scores: { logic, optimization, clean_code, edge_cases, speed }, alien_rank, summary_feedback, roadmap: { day_1: [...], day_2: [...], ..., day_7: [...] } }. Each day array contains objects: { title, topic, url, difficulty }.`;

  const userPrompt = `Track: ${payload.track}\n\nSubmissions:\n${payload.submissions
    .map(
      (s, i) =>
        `Problem ${i + 1}: ${s.problemTitle}\nTests Passed: ${s.testsPassed}/${s.totalTests}\nCode:\n\`\`\`\n${s.code}\n\`\`\``
    )
    .join("\n\n---\n\n")}`;

  const raw = await callAI(systemPrompt, userPrompt);
  return JSON.parse(raw) as OAEvaluationResult;
}

export async function evaluateDaily(
  problemTitle: string,
  code: string
): Promise<DailyEvaluationResult> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 1200));
    return getMockDailyResult();
  }

  const systemPrompt = `The user was tasked with solving "${problemTitle}". Analyze the code they pasted. 1. Praise what they did right. 2. Point out one area for optimization. 3. Determine a follow-up spaced repetition topic for 3 days from now. Keep feedback under 3 sentences. Output STRICTLY in JSON: { feedback, next_spaced_repetition_topic, days_until_repetition }.`;

  const raw = await callAI(systemPrompt, `Code:\n\`\`\`\n${code}\n\`\`\``);
  return JSON.parse(raw) as DailyEvaluationResult;
}
