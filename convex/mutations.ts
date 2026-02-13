import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertTestRun = internalMutation({
  args: {
    testCaseId: v.id("testCases"),
    modelId: v.id("aiModels"),
    status: v.string(),
    rawResponse: v.string(),
    parsedAnswer: v.optional(v.string()),
    isCorrect: v.boolean(),
    executionTimeMs: v.number(),
    tokensUsed: v.optional(
      v.object({
        prompt: v.number(),
        completion: v.number(),
        total: v.number(),
      })
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testRuns", {
      ...args,
      executedAt: Date.now(),
      temperature: 0.7,
      maxTokens: 500,
    });
  },
});
