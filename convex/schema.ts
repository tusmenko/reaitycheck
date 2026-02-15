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
    slug: v.optional(v.string()),
    contextWindow: v.optional(v.number()),
    isActive: v.boolean(),
    updatedAt: v.optional(v.number()),
    syncedFromOpenRouter: v.optional(v.boolean()),
    isFree: v.optional(v.boolean()),
    openRouterCreatedAt: v.optional(v.number()),
    inputCostPer1MTokens: v.optional(v.number()),
    outputCostPer1MTokens: v.optional(v.number()),
    maxCompletionTokens: v.optional(v.number()),
    description: v.optional(v.string()),
  })
    .index("by_provider", ["provider"])
    .index("by_active", ["isActive"])
    .index("by_provider_and_name", ["provider", "modelName"])
    .index("by_slug", ["slug"])
    .index("by_api_identifier", ["apiIdentifier"]),

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

  challengeSubmissions: defineTable({
    prompt: v.string(),
    expectedResult: v.string(),
    trickDescription: v.string(),
    modelFailureInsight: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    submitterLink: v.optional(v.string()),
    submittedAt: v.number(),
    status: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"]),
});
