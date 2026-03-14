import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

/** Recompute and upsert the testModelStats row for a (testCase, model) pair.
 *  Uses the by_test_and_model index so it only reads runs for that pair. */
export async function updateTestModelStats(
  ctx: MutationCtx,
  testCaseId: Id<"testCases">,
  modelId: Id<"aiModels">
) {
  const runs = await ctx.db
    .query("testRuns")
    .withIndex("by_test_and_model", (q) =>
      q.eq("testCaseId", testCaseId).eq("modelId", modelId)
    )
    .collect();

  // Find latest conclusive run (success or failed)
  let latest: (typeof runs)[0] | null = null;
  let successRunCount = 0;
  let correctRunCount = 0;
  let totalExecutionTimeMs = 0;
  let runsWithTimeCount = 0;

  for (const run of runs) {
    if (run.status === "success" || run.status === "failed") {
      if (!latest || run.executedAt > latest.executedAt) {
        latest = run;
      }
    }
    if (run.status === "success") {
      successRunCount++;
      if (run.isCorrect) correctRunCount++;
    }
    if (run.executionTimeMs != null) {
      totalExecutionTimeMs += run.executionTimeMs;
      runsWithTimeCount++;
    }
  }

  const existing = await ctx.db
    .query("testModelStats")
    .withIndex("by_test_and_model", (q) =>
      q.eq("testCaseId", testCaseId).eq("modelId", modelId)
    )
    .first();

  if (!latest) {
    // No conclusive runs — remove stats row if it exists
    if (existing) await ctx.db.delete(existing._id);
    return;
  }

  const fields = {
    testCaseId,
    modelId,
    latestIsCorrect: latest.isCorrect,
    latestStatus: latest.status,
    latestExecutedAt: latest.executedAt,
    latestParsedAnswer: latest.parsedAnswer,
    latestRawResponse: latest.rawResponse,
    successRunCount,
    correctRunCount,
    totalExecutionTimeMs,
    runsWithTimeCount,
  };

  if (existing) {
    await ctx.db.patch(existing._id, fields);
  } else {
    await ctx.db.insert("testModelStats", fields);
  }
}
