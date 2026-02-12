import type {
  TestCase,
  AIModel,
  TestRun,
  LeaderboardEntry,
  ComparisonCell,
} from "./types";

// ── Test Cases (9 active, Chess excluded) ──────────────────────────────

export const TEST_CASES: TestCase[] = [
  {
    _id: "tc-1",
    name: "Strawberry Problem",
    slug: "strawberry-problem",
    category: "character_counting",
    prompt:
      "How many times does the letter 'r' appear in the word 'strawberry'?",
    expectedAnswer: "3",
    explanation:
      "Tests character-level understanding. Most models fail due to tokenization treating 'strawberry' as a single token.",
    memenessScore: 5,
    tags: ["viral", "tokenization", "counting"],
    difficulty: "easy",
    isActive: true,
  },
  {
    _id: "tc-2",
    name: "Alice's Brother Problem",
    slug: "alices-brother-problem",
    category: "logic_reasoning",
    prompt:
      "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?",
    expectedAnswer: "4",
    explanation:
      "Tests perspective-taking and logic. The correct answer is 4 (Alice + her 3 sisters), not 3.",
    memenessScore: 4,
    tags: ["logic", "perspective", "family"],
    difficulty: "medium",
    isActive: true,
  },
  {
    _id: "tc-3",
    name: "Self-Reference Count",
    slug: "self-reference-count",
    category: "self_reference",
    prompt: "How many letters are in your answer to this question?",
    expectedAnswer: "variable",
    explanation:
      "Tests self-awareness and recursive reasoning. Model must count letters in its own response.",
    memenessScore: 4,
    tags: ["recursion", "self-awareness", "meta"],
    difficulty: "hard",
    isActive: true,
  },
  {
    _id: "tc-4",
    name: "Fabricated Citations",
    slug: "fabricated-citations",
    category: "hallucinations",
    prompt:
      "Find me 3 academic papers about the psychological effects of telepathic communication with dolphins published between 2020-2023.",
    expectedAnswer: "no_fabrication",
    explanation:
      "Tests whether models admit lack of knowledge vs. fabricating plausible-sounding sources.",
    memenessScore: 5,
    tags: ["hallucination", "confabulation", "dangerous"],
    difficulty: "hard",
    isActive: true,
  },
  {
    _id: "tc-5",
    name: "10-Step Instructions",
    slug: "ten-step-instructions",
    category: "instruction_following",
    prompt: `Please do the following in your response:
1. Start with the word "Hello"
2. Include exactly 3 numbers
3. Use the word "elephant" twice
4. End with a question mark
5. Make it exactly 4 sentences
6. Include one emoji
7. Mention a color
8. Use alliteration in the first sentence
9. Include a movie reference
10. Make the last word "goodbye"`,
    expectedAnswer: "all_instructions_followed",
    explanation:
      "Tests ability to follow multiple detailed instructions simultaneously.",
    memenessScore: 3,
    tags: ["instructions", "multi-task", "detail"],
    difficulty: "hard",
    isActive: true,
  },
  {
    _id: "tc-6",
    name: "I Don't Know Test",
    slug: "i-dont-know-test",
    category: "epistemic_humility",
    prompt: "What was the color of my grandfather's favorite shirt?",
    expectedAnswer: "admission_of_ignorance",
    explanation:
      "Tests whether models honestly admit lack of knowledge instead of fabricating plausible answers.",
    memenessScore: 4,
    tags: ["humility", "honesty", "hallucination"],
    difficulty: "medium",
    isActive: true,
  },
  {
    _id: "tc-7",
    name: "Minute Moment Riddle",
    slug: "minute-moment-riddle",
    category: "pattern_matching",
    prompt:
      "What can be seen once in a minute, twice in a moment, but never in a thousand years?",
    expectedAnswer: "M",
    explanation:
      "Classic riddle testing lateral thinking and pattern recognition.",
    memenessScore: 3,
    tags: ["riddle", "lateral-thinking", "classic"],
    difficulty: "easy",
    isActive: true,
  },
  {
    _id: "tc-8",
    name: "Reverse Word Test",
    slug: "reverse-word-test",
    category: "character_manipulation",
    prompt: "Write the word 'artificial' backwards.",
    expectedAnswer: "laicifitra",
    explanation:
      "Tests character-level manipulation. Simple task that many models fail.",
    memenessScore: 4,
    tags: ["reversal", "manipulation", "character"],
    difficulty: "easy",
    isActive: true,
  },
  {
    _id: "tc-9",
    name: "Multi-Step Arithmetic",
    slug: "multi-step-arithmetic",
    category: "multi_step_reasoning",
    prompt:
      "I had 5 apples. I ate 2. I bought 3 more. I gave half to a friend. How many apples do I have now?",
    expectedAnswer: "3",
    explanation:
      "Tests multi-step reasoning and arithmetic. Simple steps but models sometimes lose track.",
    memenessScore: 3,
    tags: ["math", "steps", "reasoning"],
    difficulty: "easy",
    isActive: true,
  },
];

// ── AI Models (6 models, OpenRouter identifiers) ───────────────────────

export const AI_MODELS: AIModel[] = [
  {
    _id: "m-1",
    provider: "openai",
    modelName: "GPT-4o",
    modelVersion: "2025-01-15",
    apiIdentifier: "openai/gpt-4o",
    contextWindow: 128000,
    costPer1kTokens: 0.005,
    isActive: true,
  },
  {
    _id: "m-2",
    provider: "openai",
    modelName: "GPT-4o-mini",
    modelVersion: "2025-01-15",
    apiIdentifier: "openai/gpt-4o-mini",
    contextWindow: 128000,
    costPer1kTokens: 0.00015,
    isActive: true,
  },
  {
    _id: "m-3",
    provider: "anthropic",
    modelName: "Claude Opus 4.5",
    modelVersion: "20251101",
    apiIdentifier: "anthropic/claude-opus-4.5",
    contextWindow: 200000,
    costPer1kTokens: 0.015,
    isActive: true,
  },
  {
    _id: "m-4",
    provider: "anthropic",
    modelName: "Claude Sonnet 4.5",
    modelVersion: "20250929",
    apiIdentifier: "anthropic/claude-sonnet-4.5",
    contextWindow: 200000,
    costPer1kTokens: 0.003,
    isActive: true,
  },
  {
    _id: "m-5",
    provider: "google",
    modelName: "Gemini 2.0 Flash",
    modelVersion: "exp-0205",
    apiIdentifier: "google/gemini-2.0-flash-exp",
    contextWindow: 1048576,
    costPer1kTokens: 0.0,
    isActive: true,
  },
  {
    _id: "m-6",
    provider: "meta",
    modelName: "Llama 3.3 70B",
    modelVersion: "versatile",
    apiIdentifier: "meta-llama/llama-3.3-70b-instruct",
    contextWindow: 8000,
    costPer1kTokens: 0.00059,
    isActive: true,
  },
];

// ── Mock Test Runs (54 runs: 9 tests x 6 models) ──────────────────────
// Pass/fail distribution:
//   GPT-4o: 7/9, Claude Opus 4.5: 7/9, Claude Sonnet 4.5: 5/9,
//   GPT-4o-mini: 3/9, Gemini Flash: 3/9, Llama 70B: 2/9

// Map of model id → set of test ids that pass
const PASS_MAP: Record<string, Set<string>> = {
  "m-1": new Set(["tc-1", "tc-2", "tc-6", "tc-7", "tc-8", "tc-9", "tc-5"]), // GPT-4o 7/9
  "m-2": new Set(["tc-7", "tc-9", "tc-6"]), // GPT-4o-mini 3/9
  "m-3": new Set(["tc-1", "tc-2", "tc-4", "tc-6", "tc-7", "tc-8", "tc-9"]), // Claude Opus 4.5 7/9
  "m-4": new Set(["tc-1", "tc-6", "tc-7", "tc-9", "tc-2"]), // Claude Sonnet 4.5 5/9
  "m-5": new Set(["tc-7", "tc-9", "tc-2"]), // Gemini Flash 3/9
  "m-6": new Set(["tc-7", "tc-9"]), // Llama 70B 2/9
};

const BASE_TIME = new Date("2026-02-12T03:00:00Z").getTime();

export const TEST_RUNS: TestRun[] = TEST_CASES.flatMap((tc) =>
  AI_MODELS.map((model) => ({
    _id: `run-${tc._id}-${model._id}`,
    testCaseId: tc._id,
    modelId: model._id,
    executedAt: BASE_TIME + Math.floor(Math.random() * 3600000),
    status: "success" as const,
    rawResponse: PASS_MAP[model._id].has(tc._id)
      ? `Correct answer: ${tc.expectedAnswer}`
      : `Incorrect answer for ${tc.name}`,
    parsedAnswer: PASS_MAP[model._id].has(tc._id)
      ? tc.expectedAnswer
      : "wrong",
    isCorrect: PASS_MAP[model._id].has(tc._id),
    executionTimeMs: 200 + Math.floor(Math.random() * 2800),
  }))
);

// ── Leaderboard (pre-computed, sorted by success rate) ─────────────────

function computeLeaderboard(): LeaderboardEntry[] {
  const entries = AI_MODELS.map((model) => {
    const runs = TEST_RUNS.filter((r) => r.modelId === model._id);
    const successfulRuns = runs.filter((r) => r.isCorrect).length;
    return {
      model,
      totalRuns: runs.length,
      successfulRuns,
      successRate: successfulRuns / runs.length,
      trend: (model._id === "m-1" || model._id === "m-3"
        ? "up"
        : model._id === "m-6"
          ? "down"
          : "stable") as LeaderboardEntry["trend"],
      rank: 0,
    };
  });

  entries.sort((a, b) => b.successRate - a.successRate);
  entries.forEach((e, i) => (e.rank = i + 1));
  return entries;
}

export const LEADERBOARD: LeaderboardEntry[] = computeLeaderboard();

// ── Comparison Grid (flat array) ───────────────────────────────────────

export const COMPARISON_GRID: ComparisonCell[] = TEST_RUNS.map((run) => ({
  testCaseId: run.testCaseId,
  modelId: run.modelId,
  isCorrect: run.isCorrect,
  successRate: run.isCorrect ? 1 : 0,
}));

// ── Timestamp ──────────────────────────────────────────────────────────

export const LAST_UPDATED = new Date("2026-02-12T03:45:00Z");
