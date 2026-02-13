"use node";

import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import { v } from "convex/values";
import { callModel } from "./openrouter";
import { validate } from "./validators";

const TEMPERATURE = 0.7;
const DEFAULT_MAX_TOKENS = 500;
const DELAY_BETWEEN_REQUESTS_MS = 8_000; // ~7.5 req/min, safely under free-tier 8/min
const MAX_RETRIES = 2;
const RETRY_BACKOFF_MS = 15_000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatError(error: unknown): { message: string; raw: string } {
  if (error instanceof Error) {
    const status = "status" in error ? (error as { status: number }).status : undefined;
    const code = "code" in error ? (error as { code: string }).code : undefined;
    const parts = [
      status ? `status=${status}` : null,
      code ? `code=${code}` : null,
      error.message,
    ].filter(Boolean);
    return { message: parts.join(" | "), raw: parts.join(" | ") };
  }
  return { message: String(error), raw: String(error) };
}

async function callWithRetry(
  apiKey: string,
  apiIdentifier: string,
  prompt: string,
  options: { temperature: number; maxTokens: number }
) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callModel(apiKey, apiIdentifier, prompt, options);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      const isRetryable = msg.includes("429") || msg.includes("rate limit");
      if (isRetryable && attempt < MAX_RETRIES) {
        const backoff = RETRY_BACKOFF_MS * (attempt + 1);
        console.log(`    ↻ Rate limited, retrying in ${backoff / 1000}s (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await sleep(backoff);
        continue;
      }
      throw error;
    }
  }
  throw new Error("Unreachable");
}

export const runAllTests = action({
  args: {},
  handler: async (ctx) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    const tests = await ctx.runQuery(api.queries.getActiveTestCases);
    const models = await ctx.runQuery(api.queries.getActiveModels);

    const summary = { total: 0, passed: 0, failed: 0, errors: 0 };

    console.log(`Starting test run: ${models.length} models × ${tests.length} tests = ${models.length * tests.length} total`);

    for (const model of models) {
      const maxTokens = model.maxTokens ?? DEFAULT_MAX_TOKENS;
      console.log(`\n── Model: ${model.modelName} (${model.apiIdentifier}) | maxTokens: ${maxTokens} ──`);

      for (const test of tests) {
        summary.total++;

        try {
          const result = await callWithRetry(apiKey, model.apiIdentifier, test.prompt, {
            temperature: TEMPERATURE,
            maxTokens,
          });

          const validation = validate(
            test.validationType,
            test.validationConfig,
            test.expectedAnswer,
            result.content
          );

          if (validation.isCorrect) {
            summary.passed++;
          } else {
            summary.failed++;
          }

          const icon = validation.isCorrect ? "PASS" : "FAIL";
          console.log(`  [${icon}] ${test.name} | expected="${test.expectedAnswer}" got="${validation.parsedAnswer}" | ${result.executionTimeMs}ms`);

          await ctx.runMutation(internal.mutations.insertTestRun, {
            testCaseId: test._id,
            modelId: model._id,
            status: "success",
            rawResponse: result.content,
            parsedAnswer: validation.parsedAnswer,
            isCorrect: validation.isCorrect,
            executionTimeMs: result.executionTimeMs,
            tokensUsed: result.tokensUsed,
          });
        } catch (error) {
          summary.errors++;

          const { message: errorMessage, raw } = formatError(error);

          console.log(`  [ERR!] ${test.name} | ${errorMessage}`);

          await ctx.runMutation(internal.mutations.insertTestRun, {
            testCaseId: test._id,
            modelId: model._id,
            status: "error",
            rawResponse: raw,
            parsedAnswer: undefined,
            isCorrect: false,
            executionTimeMs: 0,
            errorMessage,
          });
        }

        // Rate limit delay between requests
        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }
    }

    console.log(`\nDone: ${summary.passed} passed, ${summary.failed} failed, ${summary.errors} errors (${summary.total} total)`);
    return summary;
  },
});

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

    const maxTokens = model.maxTokens ?? DEFAULT_MAX_TOKENS;

    const result = await callWithRetry(apiKey, model.apiIdentifier, test.prompt, {
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
