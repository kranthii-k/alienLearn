import { Track } from "@/lib/types";

export const TRACKS: Track[] = [
  {
    id: "dsa",
    title: "Data Structures & Algorithms",
    description:
      "Master arrays, trees, graphs, and dynamic programming. Build the problem-solving intuition that top companies look for.",
    icon: "🧠",
    color: "blue",
    problems: [
      {
        id: "dsa-1",
        title: "Two Sum",
        difficulty: "Easy",
        description: `## Two Sum

Given an array of integers \`nums\` and an integer \`target\`, return *indices* of the two numbers such that they add up to target.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

---

**Example 1:**
\`\`\`
Input:  nums = [2,7,11,15], target = 9
Output: [0,1]
\`\`\`

**Example 2:**
\`\`\`
Input:  nums = [3,2,4], target = 6
Output: [1,2]
\`\`\`

**Constraints:**
- 2 ≤ nums.length ≤ 10⁴
- -10⁹ ≤ nums[i] ≤ 10⁹
- Only one valid answer exists.`,
        starterCode: `function twoSum(nums: number[], target: number): number[] {
  // Your solution here
  
};`,
        testCases: [
          { input: "nums = [2,7,11,15], target = 9", expected: "[0,1]", description: "Basic case" },
          { input: "nums = [3,2,4], target = 6", expected: "[1,2]", description: "Non-adjacent elements" },
          { input: "nums = [3,3], target = 6", expected: "[0,1]", description: "Duplicate values" },
        ],
      },
      {
        id: "dsa-2",
        title: "Longest Substring Without Repeating Characters",
        difficulty: "Medium",
        description: `## Longest Substring Without Repeating Characters

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

---

**Example 1:**
\`\`\`
Input:  s = "abcabcbb"
Output: 3  (substring "abc")
\`\`\`

**Example 2:**
\`\`\`
Input:  s = "bbbbb"
Output: 1  (substring "b")
\`\`\`

**Constraints:**
- 0 ≤ s.length ≤ 5 × 10⁴
- s consists of English letters, digits, symbols and spaces.`,
        starterCode: `function lengthOfLongestSubstring(s: string): number {
  // Your solution here
  
};`,
        testCases: [
          { input: 's = "abcabcbb"', expected: "3", description: "Repeating pattern" },
          { input: 's = "bbbbb"', expected: "1", description: "All same characters" },
          { input: 's = "pwwkew"', expected: "3", description: "substring at end" },
        ],
      },
      {
        id: "dsa-3",
        title: "3Sum",
        difficulty: "Medium",
        description: `## 3Sum

Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

**The solution set must not contain duplicate triplets.**

---

**Example 1:**
\`\`\`
Input:  nums = [-1,0,1,2,-1,-4]
Output: [[-1,-1,2],[-1,0,1]]
\`\`\`

**Constraints:**
- 3 ≤ nums.length ≤ 3000
- -10⁵ ≤ nums[i] ≤ 10⁵`,
        starterCode: `function threeSum(nums: number[]): number[][] {
  // Your solution here
  
};`,
        testCases: [
          { input: "nums = [-1,0,1,2,-1,-4]", expected: "[[-1,-1,2],[-1,0,1]]", description: "Standard case" },
          { input: "nums = [0,1,1]", expected: "[]", description: "No valid triplet" },
          { input: "nums = [0,0,0]", expected: "[[0,0,0]]", description: "All zeros" },
        ],
      },
    ],
  },
  {
    id: "react",
    title: "React & Frontend Systems",
    description:
      "From hooks to performance patterns. Build production-grade React apps with confidence in interviews.",
    icon: "⚛️",
    color: "green",
    problems: [
      {
        id: "react-1",
        title: "Implement useDebounce Hook",
        difficulty: "Easy",
        description: `## Implement useDebounce Hook

Create a custom React hook \`useDebounce\` that delays updating a value until after a specified wait time.

---

**Signature:**
\`\`\`typescript
function useDebounce<T>(value: T, delay: number): T
\`\`\`

**Example Usage:**
\`\`\`typescript
const debouncedSearch = useDebounce(searchTerm, 300);
\`\`\`

The returned value should only update after the input has been stable for \`delay\` ms.`,
        starterCode: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  // Your implementation here
  
}

export default useDebounce;`,
        testCases: [
          { input: "value='hello', delay=300ms", expected: "Returns 'hello' after 300ms", description: "Basic debounce" },
          { input: "Rapid changes within delay window", expected: "Only final value emitted", description: "Debounce suppression" },
          { input: "delay=0", expected: "Immediate return", description: "Zero delay" },
        ],
      },
      {
        id: "react-2",
        title: "Flatten Nested Array (Recursive)",
        difficulty: "Medium",
        description: `## Flatten Nested Array

Write a function that flattens a nested array structure to a specified depth.

\`\`\`typescript
flatten([1, [2, [3, [4]]]], 1) // → [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], Infinity) // → [1, 2, 3, 4]
\`\`\``,
        starterCode: `function flatten(arr: unknown[], depth: number = Infinity): unknown[] {
  // Your solution here
  
}`,
        testCases: [
          { input: "[1,[2,[3]]], depth=1", expected: "[1,2,[3]]", description: "Depth 1" },
          { input: "[1,[2,[3]]], depth=Infinity", expected: "[1,2,3]", description: "Full flatten" },
          { input: "[1,2,3], depth=1", expected: "[1,2,3]", description: "Already flat" },
        ],
      },
      {
        id: "react-3",
        title: "Event Emitter",
        difficulty: "Medium",
        description: `## Event Emitter

Implement an \`EventEmitter\` class with \`on\`, \`off\`, and \`emit\` methods.

\`\`\`typescript
const emitter = new EventEmitter();
emitter.on('data', (msg) => console.log(msg));
emitter.emit('data', 'hello'); // logs 'hello'
emitter.off('data');
\`\`\``,
        starterCode: `class EventEmitter {
  // Your implementation here
  
  on(event: string, listener: (...args: unknown[]) => void): void {}
  off(event: string): void {}
  emit(event: string, ...args: unknown[]): void {}
}`,
        testCases: [
          { input: "on + emit same event", expected: "Listener called with args", description: "Basic pub/sub" },
          { input: "off + emit", expected: "Listener not called", description: "Unsubscribe" },
          { input: "Multiple listeners on same event", expected: "All listeners called", description: "Multi-listener" },
        ],
      },
    ],
  },
  {
    id: "typescript",
    title: "TypeScript & System Design",
    description:
      "Advanced TypeScript patterns, generics, and system design fundamentals. Stand out in senior-level interviews.",
    icon: "📘",
    color: "violet",
    problems: [
      {
        id: "ts-1",
        title: "Implement DeepReadonly<T>",
        difficulty: "Easy",
        description: `## Implement DeepReadonly<T>

Create a TypeScript utility type \`DeepReadonly<T>\` that makes all properties recursively readonly.

\`\`\`typescript
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
\`\`\`

Implement a function that accepts a value typed as \`DeepReadonly<T>\` and verify it compiles correctly.`,
        starterCode: `type DeepReadonly<T> = // Your type here

function freeze<T>(obj: T): DeepReadonly<T> {
  // Your implementation
}`,
        testCases: [
          { input: "{ a: { b: 1 } }", expected: "Mutating b should fail TS", description: "Nested readonly" },
          { input: "Primitive type", expected: "Returns same type", description: "Primitive pass-through" },
          { input: "Array of objects", expected: "Elements are readonly", description: "Array handling" },
        ],
      },
      {
        id: "ts-2",
        title: "Generic Linked List",
        difficulty: "Medium",
        description: `## Generic Linked List

Implement a singly linked list class using TypeScript generics.

Implement: \`push\`, \`pop\`, \`toArray\`, and \`find\` methods.`,
        starterCode: `class LinkedList<T> {
  private head: { value: T; next: { value: T; next: unknown } | null } | null = null;
  
  push(value: T): void {}
  pop(): T | undefined {}
  toArray(): T[] {}
  find(predicate: (val: T) => boolean): T | undefined {}
}`,
        testCases: [
          { input: "push(1), push(2), toArray()", expected: "[1, 2]", description: "Push and list" },
          { input: "push(1), pop()", expected: "1", description: "Pop returns value" },
          { input: "find(x => x > 2) on [1,2,3]", expected: "3", description: "Find predicate" },
        ],
      },
      {
        id: "ts-3",
        title: "Rate Limiter",
        difficulty: "Medium",
        description: `## Rate Limiter

Implement a \`RateLimiter\` class that limits the number of calls to a function within a time window.

\`\`\`typescript
const throttled = rateLimiter(fn, { maxCalls: 3, windowMs: 1000 });
\`\`\`

Calls beyond \`maxCalls\` within \`windowMs\` should be silently dropped or queued.`,
        starterCode: `interface RateLimiterOptions {
  maxCalls: number;
  windowMs: number;
}

function rateLimiter<T extends (...args: unknown[]) => unknown>(
  fn: T,
  options: RateLimiterOptions
): T {
  // Your implementation here
}`,
        testCases: [
          { input: "3 calls within window (max=3)", expected: "All 3 execute", description: "Within limit" },
          { input: "4th call within window", expected: "4th dropped", description: "Over limit" },
          { input: "Call after window resets", expected: "Executes normally", description: "Window reset" },
        ],
      },
    ],
  },
];
