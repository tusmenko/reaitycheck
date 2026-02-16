"use node";

import { action, internalAction } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { v } from "convex/values";
import { callModel } from "./openrouter";
import { validate } from "./validators";

const TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 8192;
const DELAY_BETWEEN_REQUESTS_MS = 10_000; // ~6 req/min, safely under free-tier 8/min

/** Use the minimum of DEFAULT_MAX_TOKENS and model's maxCompletionTokens when set; otherwise DEFAULT_MAX_TOKENS. */
function effectiveMaxTokens(model: { maxCompletionTokens?: number }): number {
  return model.maxCompletionTokens != null
    ? Math.min(DEFAULT_MAX_TOKENS, model.maxCompletionTokens)
    : DEFAULT_MAX_TOKENS;
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    const status = "status" in error ? (error as { status: number }).status : undefined;
    const code = "code" in error ? (error as { code: string }).code : undefined;
    const parts = [
      status ? `status=${status}` : null,
      code ? `code=${code}` : null,
      error.message,
    ].filter(Boolean);
    return parts.join(" | ");
  }
  return String(error);
}

// Internal action: execute a single test for one model (scheduled by orchestrator)
export const executeScheduledTest = internalAction({
  args: {
    testCaseId: v.id("testCases"),
    modelId: v.id("aiModels"),
    testName: v.string(),
    prompt: v.string(),
    expectedAnswer: v.string(),
    validationType: v.string(),
    validationConfig: v.optional(
      v.object({
        acceptableAnswers: v.optional(v.array(v.string())),
        caseSensitive: v.optional(v.boolean()),
        customValidatorName: v.optional(v.string()),
      })
    ),
    modelName: v.string(),
    apiIdentifier: v.string(),
    maxTokens: v.number(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    try {
      const result = await callModel(apiKey, args.apiIdentifier, args.prompt, {
        temperature: TEMPERATURE,
        maxTokens: args.maxTokens,
      });

      const validation = validate(
        args.validationType,
        args.validationConfig,
        args.expectedAnswer,
        result.content
      );

      const icon = validation.isCorrect ? "PASS" : "FAIL";
      console.log(
        `[${icon}] ${args.modelName} > ${args.testName} | ` +
        `expected="${args.expectedAnswer}" got="${validation.parsedAnswer}" | ` +
        `${result.executionTimeMs}ms`
      );

      await ctx.runMutation(internal.mutations.insertTestRun, {
        testCaseId: args.testCaseId,
        modelId: args.modelId,
        status: "success",
        rawResponse: result.content,
        parsedAnswer: validation.parsedAnswer,
        isCorrect: validation.isCorrect,
        executionTimeMs: result.executionTimeMs,
        tokensUsed: result.tokensUsed,
        temperature: TEMPERATURE,
        maxTokens: args.maxTokens,
      });
    } catch (error) {
      const promptPreview =
        args.prompt.length > 200 ? args.prompt.slice(0, 200) + "…" : args.prompt;
      console.log(
        "[OpenRouter] request (on error):",
        JSON.stringify({
          model: args.apiIdentifier,
          temperature: TEMPERATURE,
          max_tokens: args.maxTokens,
          messages: [{ role: "user", content: promptPreview }],
        })
      );
      const errorMessage = formatError(error);
      console.log(`[ERR!] ${args.modelName} > ${args.testName} | ${errorMessage}`);

      await ctx.runMutation(internal.mutations.insertTestRun, {
        testCaseId: args.testCaseId,
        modelId: args.modelId,
        status: "error",
        rawResponse: "",
        parsedAnswer: undefined,
        isCorrect: false,
        executionTimeMs: 0,
        errorMessage,
        temperature: TEMPERATURE,
        maxTokens: args.maxTokens,
      });
    }
  },
});

// Orchestrator: schedules all test executions with staggered delays, then exits
export const orchestrateAllTests = action({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.runQuery(api.queries.getActiveTestCases);
    const models = await ctx.runQuery(api.queries.getActiveModels);

    const total = models.length * tests.length;
    console.log(
      `Orchestrating test run: ${models.length} models × ${tests.length} tests = ${total} executions`
    );

    let delayMs = 0;
    let scheduled = 0;

    for (const model of models) {
      const maxTokens = effectiveMaxTokens(model);
      for (const test of tests) {
        await ctx.scheduler.runAfter(
          delayMs,
          internal.actions.runTests.executeScheduledTest,
          {
            testCaseId: test._id,
            modelId: model._id,
            testName: test.name,
            prompt: test.prompt,
            expectedAnswer: test.expectedAnswer,
            validationType: test.validationType,
            validationConfig: test.validationConfig,
            modelName: model.modelName,
            apiIdentifier: model.apiIdentifier,
            maxTokens,
          }
        );

        scheduled++;
        delayMs += DELAY_BETWEEN_REQUESTS_MS;
      }
    }

    const durationMinutes = Math.ceil(delayMs / 60_000);
    console.log(
      `Scheduled ${scheduled} tests (staggered over ~${durationMinutes} minutes)`
    );

    return { scheduled, estimatedDurationMinutes: durationMinutes };
  },
});

/** Schedule test runs only for (testCaseId, modelId) pairs whose latest run has status "error". Only active test and active model are scheduled. */
export const orchestrateErroredTests = action({
  args: {},
  handler: async (ctx) => {
    const pairs = await ctx.runQuery(api.queries.getErroredTestRunPairs);
    let delayMs = 0;
    let scheduled = 0;

    for (const { testCaseId, modelId } of pairs) {
      const resolved = await ctx.runQuery(api.queries.getTestAndModelForRun, {
        testCaseId,
        modelId,
      });
      if (!resolved) continue;

      const { test, model } = resolved;
      const maxTokens = effectiveMaxTokens(model);
      await ctx.scheduler.runAfter(
        delayMs,
        internal.actions.runTests.executeScheduledTest,
        {
          testCaseId: test._id,
          modelId: model._id,
          testName: test.name,
          prompt: test.prompt,
          expectedAnswer: test.expectedAnswer,
          validationType: test.validationType,
          validationConfig: test.validationConfig,
          modelName: model.modelName,
          apiIdentifier: model.apiIdentifier,
          maxTokens,
        }
      );
      scheduled++;
      delayMs += DELAY_BETWEEN_REQUESTS_MS;
    }

    const durationMinutes = Math.ceil(delayMs / 60_000);
    console.log(
      `Orchestrating errored reruns: ${scheduled} scheduled (staggered over ~${durationMinutes} minutes)`
    );
    return { scheduled, estimatedDurationMinutes: durationMinutes };
  },
});

// Deprecated: redirects to orchestrateAllTests
export const runAllTests = action({
  args: {},
  handler: async (ctx): Promise<{ scheduled: number; estimatedDurationMinutes: number }> => {
    console.warn(
      "runAllTests is deprecated — redirecting to orchestrateAllTests"
    );
    return await ctx.runAction(api.actions.runTests.orchestrateAllTests);
  },
});

// Manual single test run (for dashboard use)
export const runSingleTest = action({
  args: {
    testSlug: v.string(),
    modelApiIdentifier: v.string(),
  },
  handler: async (ctx, { testSlug, modelApiIdentifier }): Promise<{
    model: string;
    test: string;
    rawResponse: string;
    parsedAnswer: string;
    isCorrect: boolean;
    executionTimeMs: number;
    tokensUsed: { prompt: number; completion: number; total: number };
  }> => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    const tests = await ctx.runQuery(api.queries.getActiveTestCases);
    const models = await ctx.runQuery(api.queries.getActiveModels);

    const test = tests.find((t: { slug: string }) => t.slug === testSlug);
    if (!test) {
      throw new Error(`Test case not found: ${testSlug}`);
    }

    const model = models.find(
      (m: { apiIdentifier: string }) => m.apiIdentifier === modelApiIdentifier
    );
    if (!model) {
      throw new Error(`Model not found: ${modelApiIdentifier}`);
    }

    const maxTokens = effectiveMaxTokens(model);

    const result = await callModel(apiKey, model.apiIdentifier, test.prompt, {
      temperature: TEMPERATURE,
      maxTokens,
    });

    const validation = validate(
      test.validationType,
      test.validationConfig,
      test.expectedAnswer,
      result.content
    );

    await ctx.runMutation(internal.mutations.insertTestRun, {
      testCaseId: test._id,
      modelId: model._id,
      status: "success",
      rawResponse: result.content,
      parsedAnswer: validation.parsedAnswer,
      isCorrect: validation.isCorrect,
      executionTimeMs: result.executionTimeMs,
      tokensUsed: result.tokensUsed,
      temperature: TEMPERATURE,
      maxTokens,
    });

    return {
      model: model.modelName,
      test: test.name,
      rawResponse: result.content,
      parsedAnswer: validation.parsedAnswer,
      isCorrect: validation.isCorrect,
      executionTimeMs: result.executionTimeMs,
      tokensUsed: result.tokensUsed,
    };
  },
});
