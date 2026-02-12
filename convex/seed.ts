import { mutation } from "./_generated/server";
import { testCases } from "./seeds/testCases";
import { aiModels } from "./seeds/aiModels";

// Pass/fail map: apiIdentifier → set of slugs that pass
const PASS_MAP: Record<string, Set<string>> = {
  "openai/gpt-4o": new Set([
    "strawberry-problem",
    "alices-brother-problem",
    "i-dont-know-test",
    "minute-moment-riddle",
    "reverse-word-test",
    "multi-step-arithmetic",
    "ten-step-instructions",
  ]), // 7/9
  "openai/gpt-4o-mini": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
    "i-dont-know-test",
    "ten-step-instructions",
  ]), // 4/9
  "anthropic/claude-opus-4.5": new Set([
    "strawberry-problem",
    "alices-brother-problem",
    "fabricated-citations",
    "i-dont-know-test",
    "minute-moment-riddle",
    "reverse-word-test",
    "multi-step-arithmetic",
  ]), // 7/9
  "anthropic/claude-sonnet-4.5": new Set([
    "strawberry-problem",
    "i-dont-know-test",
    "minute-moment-riddle",
    "multi-step-arithmetic",
    "alices-brother-problem",
  ]), // 5/9
  "google/gemini-2.0-flash-exp": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
    "alices-brother-problem",
  ]), // 3/9
  "meta-llama/llama-3.3-70b-instruct": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
  ]), // 2/9
};

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingTests = await ctx.db.query("testCases").first();
    if (existingTests) {
      return { message: "Database already seeded. Use clearAll first to re-seed." };
    }

    // Insert test cases
    for (const tc of testCases) {
      await ctx.db.insert("testCases", tc);
    }

    // Insert AI models
    for (const model of aiModels) {
      await ctx.db.insert("aiModels", model);
    }

    return {
      message: `Seeded ${testCases.length} test cases and ${aiModels.length} AI models.`,
    };
  },
});

export const seedTestRuns = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if test runs already exist
    const existingRuns = await ctx.db.query("testRuns").first();
    if (existingRuns) {
      return { message: "Test runs already exist. Use clearAll first to re-seed." };
    }

    // Look up all active test cases and models
    const allTests = await ctx.db.query("testCases").collect();
    const activeTests = allTests.filter((t) => t.isActive);
    const allModels = await ctx.db.query("aiModels").collect();

    const BASE_TIME = new Date("2026-02-12T03:00:00Z").getTime();

    let count = 0;
    for (const test of activeTests) {
      for (const model of allModels) {
        const passes = PASS_MAP[model.apiIdentifier]?.has(test.slug) ?? false;
        await ctx.db.insert("testRuns", {
          testCaseId: test._id,
          modelId: model._id,
          executedAt: BASE_TIME + Math.floor(Math.random() * 3600000),
          status: "success",
          rawResponse: passes
            ? `Correct answer: ${test.expectedAnswer}`
            : `Incorrect answer for ${test.name}`,
          parsedAnswer: passes ? test.expectedAnswer : "wrong",
          isCorrect: passes,
          executionTimeMs: 200 + Math.floor(Math.random() * 2800),
          temperature: 0.7,
          maxTokens: 500,
        });
        count++;
      }
    }

    return { message: `Seeded ${count} test runs.` };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["testRuns", "testCases", "aiModels"] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { message: "Cleared all data." };
  },
});
