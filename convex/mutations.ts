import { internalMutation, mutation } from "./_generated/server";
import { v } from "convex/values";
import {
  MAX_EXPECTED_RESULT,
  MAX_MODEL_FAILURE_INSIGHT,
  MAX_PROMPT,
  MAX_SUBMITTER_LINK,
  MAX_SUBMITTER_NAME,
  MAX_TRICK_DESCRIPTION,
  RATE_LIMIT_MAX_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
} from "./challengeSubmissionLimits";

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
    temperature: v.number(),
    maxTokens: v.number(),
  },
  handler: async (ctx, args) => {
    const { ...rest } = args;
    return await ctx.db.insert("testRuns", {
      ...rest,
      executedAt: Date.now(),
    });
  },
});

function isValidHttpUrl(s: string): boolean {
  let url: URL;
  try {
    url = new URL(s);
  } catch {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}

export const submitChallenge = mutation({
  args: {
    prompt: v.string(),
    expectedResult: v.string(),
    trickDescription: v.string(),
    modelFailureInsight: v.optional(v.string()),
    submitterName: v.optional(v.string()),
    submitterLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const trimmedPrompt = args.prompt.trim();
    const trimmedExpected = args.expectedResult.trim();
    const trimmedTrick = args.trickDescription.trim();
    if (!trimmedPrompt || !trimmedExpected || !trimmedTrick) {
      throw new Error("Prompt, expected result, and trick description are required.");
    }

    if (trimmedPrompt.length > MAX_PROMPT) {
      throw new Error(`Prompt must be at most ${MAX_PROMPT.toLocaleString()} characters.`);
    }
    if (trimmedExpected.length > MAX_EXPECTED_RESULT) {
      throw new Error(`Expected result must be at most ${MAX_EXPECTED_RESULT.toLocaleString()} characters.`);
    }
    if (trimmedTrick.length > MAX_TRICK_DESCRIPTION) {
      throw new Error(`Trick description must be at most ${MAX_TRICK_DESCRIPTION.toLocaleString()} characters.`);
    }

    const modelFailureInsight = args.modelFailureInsight?.trim();
    if (modelFailureInsight && modelFailureInsight.length > MAX_MODEL_FAILURE_INSIGHT) {
      throw new Error(`Model failure insight must be at most ${MAX_MODEL_FAILURE_INSIGHT.toLocaleString()} characters.`);
    }

    const submitterName = args.submitterName?.trim();
    if (submitterName && submitterName.length > MAX_SUBMITTER_NAME) {
      throw new Error(`Name must be at most ${MAX_SUBMITTER_NAME} characters.`);
    }

    const submitterLink = args.submitterLink?.trim();
    if (submitterLink) {
      if (submitterLink.length > MAX_SUBMITTER_LINK) {
        throw new Error(`Link must be at most ${MAX_SUBMITTER_LINK.toLocaleString()} characters.`);
      }
      if (!isValidHttpUrl(submitterLink)) {
        throw new Error("Link must be a valid http or https URL.");
      }
    }

    const submittedAt = Date.now();
    const windowStart = submittedAt - RATE_LIMIT_WINDOW_MS;

    // Insert first, then enforce rate limit by counting (including this insert).
    // If over limit, throw to roll back the insert. This prevents concurrent
    // requests from all passing the check then all inserting.
    const id = await ctx.db.insert("challengeSubmissions", {
      prompt: trimmedPrompt,
      expectedResult: trimmedExpected,
      trickDescription: trimmedTrick,
      modelFailureInsight: modelFailureInsight,
      submitterName: submitterName,
      submitterLink: submitterLink,
      submittedAt,
      status: "pending",
    });

    const recentCount = await ctx.db
      .query("challengeSubmissions")
      .withIndex("by_submitted_at", (q) => q.gte("submittedAt", windowStart))
      .collect();

    if (recentCount.length > RATE_LIMIT_MAX_PER_WINDOW) {
      throw new Error("Too many submissions. Please try again in a minute.");
    }

    return id;
  },
});
