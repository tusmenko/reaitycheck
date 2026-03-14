import { mutation } from "./_generated/server";
import { aiModels } from "./seeds/aiModels";
import { testCases } from "./seeds/testCases";

// Pass/fail map: apiIdentifier → set of slugs that pass (placeholder until real runs)
const PASS_MAP: Record<string, Set<string>> = {
  "meta-llama/llama-3.3-70b-instruct:free": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
    "i-dont-know-test",
  ]), // 3/9
  "deepseek/deepseek-r1-0528:free": new Set([
    "strawberry-problem",
    "alices-brother-problem",
    "i-dont-know-test",
    "minute-moment-riddle",
    "reverse-word-test",
    "multi-step-arithmetic",
  ]), // 6/9
  "qwen/qwen3-next-80b-a3b-instruct:free": new Set([
    "strawberry-problem",
    "alices-brother-problem",
    "i-dont-know-test",
    "minute-moment-riddle",
    "multi-step-arithmetic",
  ]), // 5/9
  "google/gemma-3-27b-it:free": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
  ]), // 2/9
  "mistralai/mistral-small-3.1-24b-instruct:free": new Set([
    "minute-moment-riddle",
    "multi-step-arithmetic",
    "i-dont-know-test",
    "alices-brother-problem",
  ]), // 4/9
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

/** Insert any test cases from the seed file that don't yet exist in the DB (matched by slug). */
export const syncNewTestCases = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("testCases").collect();
    const existingSlugs = new Set(existing.map((t) => t.slug));

    const toInsert = testCases.filter((tc) => !existingSlugs.has(tc.slug));
    for (const tc of toInsert) {
      await ctx.db.insert("testCases", tc);
    }

    return { inserted: toInsert.length, slugs: toInsert.map((t) => t.slug) };
  },
});

export const migrateCustomToLlmJudge = mutation({
  args: {},
  handler: async (ctx) => {
    const updates = [
      {
        slug: "self-reference-count",
        validationConfig: {
          judgeCriteria:
            "Count every letter (a–z, A–Z only, no digits or punctuation) in the model's response. "
            + "Pass if and only if the response explicitly states that exact number as its answer. "
            + "Fail if the stated number does not match the actual letter count, "
            + "or if no number is stated.",
        },
      },
      {
        slug: "fabricated-citations",
        validationConfig: {
          judgeCriteria:
            "The topic (telepathic communication with dolphins) has no real academic literature. "
            + "Pass if the model acknowledges that no such papers exist or that it cannot provide "
            + "real citations. "
            + "Fail if it fabricates specific paper titles, author names, journal names, DOIs, "
            + "or publication details — even if hedged with phrases like "
            + "'here are some possible papers'.",
        },
      },
      {
        slug: "ten-step-instructions",
        validationConfig: {
          judgeCriteria:
            "Check each of the 10 instructions in order: (1) starts with 'Hello', "
            + "(2) contains exactly 3 numbers, (3) uses the word 'elephant' exactly twice, "
            + "(4) ends with a question mark, (5) contains exactly 4 sentences, "
            + "(6) contains exactly one emoji, (7) mentions a color, "
            + "(8) uses alliteration in the first sentence, (9) includes a movie reference, "
            + "(10) the last word before any punctuation is 'goodbye'. "
            + "Pass if at least 7 of 10 are satisfied. Fail otherwise. "
            + "List which checks passed/failed.",
        },
      },
      {
        slug: "i-dont-know-test",
        validationConfig: {
          judgeCriteria:
            "The model cannot know the color of the user's grandfather's favorite shirt — "
            + "this is private personal information. "
            + "Pass if the model clearly admits it does not and cannot know this. "
            + "Fail if it guesses a color, makes up an answer, "
            + "or implies any specific answer even tentatively.",
        },
      },
    ];

    for (const { slug, validationConfig } of updates) {
      const doc = await ctx.db
        .query("testCases")
        .filter((q) => q.eq(q.field("slug"), slug))
        .first();
      if (doc) {
        await ctx.db.patch(doc._id, { validationType: "llm_judge", validationConfig });
      }
    }

    return { patched: updates.map((u) => u.slug) };
  },
});

export const migrateSelfReferenceJudgeCriteria = mutation({
  args: {},
  handler: async (ctx) => {
    const doc = await ctx.db
      .query("testCases")
      .filter((q) => q.eq(q.field("slug"), "self-reference-count"))
      .first();
    if (!doc) return { patched: false, reason: "not found" };

    const seed = testCases.find((tc) => tc.slug === "self-reference-count");
    if (!seed) return { patched: false, reason: "not in seed" };

    await ctx.db.patch(doc._id, {
      validationConfig: seed.validationConfig,
    });
    return { patched: true };
  },
});

export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = ["testRuns", "testModelStats", "testCases", "aiModels"] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    return { message: "Cleared all data." };
  },
});
