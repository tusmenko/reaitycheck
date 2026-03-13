"use node";

import { v } from "convex/values";
import { callModel } from "./openrouter";
import { validateAsync } from "./validators";
import { api, internal } from "../_generated/api";
import { action } from "../_generated/server";

const DELAY_BETWEEN_REQUESTS_MS = 2_000; // Lighter delay — only judge calls, not model calls

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Re-run validation only for a specific challenge across all active models.
 * Uses the existing rawResponse from the latest test run — does NOT re-call
 * the challenge model. Useful when adjusting validation prompts.
 */
export const revalidateChallenge = action({
  args: { testSlug: v.string() },
  handler: async (ctx, { testSlug }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY environment variable is not set");
    }

    // Look up the test case
    const test = await ctx.runQuery(api.queries.getTestBySlug, { slug: testSlug });
    if (!test) {
      throw new Error(`Test case not found: ${testSlug}`);
    }
    if (!test.isActive) {
      throw new Error(`Test case is inactive: ${testSlug}`);
    }

    // Get active models
    const models = await ctx.runQuery(api.queries.getActiveModels);

    let revalidated = 0;
    let skipped = 0;
    let changed = 0;
    const results: Array<{
      model: string;
      previousResult: boolean;
      newResult: boolean;
      changed: boolean;
    }> = [];

    for (const model of models) {
      // Get the latest conclusive run for this (test, model) pair
      const breakdown = await ctx.runQuery(api.queries.getTestBreakdown, {
        testCaseId: test._id,
      });
      const entry = breakdown.find((e) => e.model._id === model._id);

      if (!entry?.latestRun) {
        console.log(`[SKIP] ${model.modelName} — no existing run`);
        skipped++;
        continue;
      }

      const run = entry.latestRun;
      if (!run.rawResponse) {
        console.log(`[SKIP] ${model.modelName} — empty rawResponse`);
        skipped++;
        continue;
      }

      // Re-validate using the stored rawResponse
      const validation = await validateAsync(
        test.validationType,
        test.validationConfig,
        test.prompt,
        test.expectedAnswer,
        run.rawResponse,
        { callModel, apiKey }
      );

      const wasCorrect = run.isCorrect;
      const isChanged = wasCorrect !== validation.isCorrect;

      const icon = isChanged ? "CHANGED" : "SAME";
      const verdict = validation.isCorrect ? "PASS" : "FAIL";
      console.log(
        `[${icon}] ${model.modelName} | ` +
        `was=${wasCorrect ? "PASS" : "FAIL"} now=${verdict} | ` +
        `parsed="${validation.parsedAnswer}"`
      );

      // Update the existing test run
      await ctx.runMutation(internal.mutations.updateTestRunValidation, {
        runId: run._id,
        isCorrect: validation.isCorrect,
        parsedAnswer: validation.parsedAnswer,
        judgeTokensUsed: validation.judgeTokensUsed,
      });

      results.push({
        model: model.modelName,
        previousResult: wasCorrect,
        newResult: validation.isCorrect,
        changed: isChanged,
      });

      revalidated++;
      if (isChanged) changed++;

      // Small delay between judge calls to avoid rate limiting
      if (test.validationType === "llm_judge") {
        await sleep(DELAY_BETWEEN_REQUESTS_MS);
      }
    }

    console.log(
      `\nRevalidation complete: ${revalidated} revalidated, ${skipped} skipped, ${changed} changed`
    );

    return { testSlug, revalidated, skipped, changed, results };
  },
});
