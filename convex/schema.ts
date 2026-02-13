import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  testCases: defineTable({
    name: v.string(),
    slug: v.string(),
    category: v.string(),
    prompt: v.string(),
    expectedAnswer: v.string(),
    explanation: v.optional(v.string()),
    validationType: v.string(),
    validationConfig: v.optional(
      v.object({
        acceptableAnswers: v.optional(v.array(v.string())),
        caseSensitive: v.optional(v.boolean()),
        customValidatorName: v.optional(v.string()),
      })
    ),
    memenessScore: v.number(),
    tags: v.array(v.string()),
    difficulty: v.optional(v.string()),
    isActive: v.boolean(),
  })
    .index("by_slug", ["slug"])
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  aiModels: defineTable({
    provider: v.string(),
    modelName: v.string(),
    modelVersion: v.optional(v.string()),
    apiIdentifier: v.string(),
    contextWindow: v.optional(v.number()),
    costPer1kTokens: v.optional(v.number()),
    maxTokens: v.optional(v.number()),
    isActive: v.boolean(),
  })
    .index("by_provider", ["provider"])
    .index("by_active", ["isActive"])
    .index("by_provider_and_name", ["provider", "modelName"]),

  testRuns: defineTable({
    testCaseId: v.id("testCases"),
    modelId: v.id("aiModels"),
    executedAt: v.number(),
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
    costUsd: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    temperature: v.number(),
    maxTokens: v.number(),
  })
    .index("by_test_case", ["testCaseId"])
    .index("by_model", ["modelId"])
    .index("by_executed_at", ["executedAt"])
    .index("by_test_and_model", ["testCaseId", "modelId"]),
});
