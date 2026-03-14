import { v } from "convex/values";
import { query } from "./_generated/server";

export const getTestBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("testCases")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getModelBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("aiModels")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const getTestBreakdown = query({
  args: { testCaseId: v.id("testCases") },
  handler: async (ctx, { testCaseId }) => {
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const entries = await Promise.all(
      models.map(async (model) => {
        const runs = await ctx.db
          .query("testRuns")
          .withIndex("by_test_and_model", (q) =>
            q.eq("testCaseId", testCaseId).eq("modelId", model._id)
          )
          .collect();
        // Only consider conclusive results (success or failed), 
        // not infrastructure failures (error/timeout)
        const conclusiveRuns = runs.filter(
          (r) => r.status === "success" || r.status === "failed"
        );
        const totalRuns = conclusiveRuns.length;
        const successfulRuns = conclusiveRuns.filter((r) => r.isCorrect).length;
        const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
        const latestRun =
          conclusiveRuns.length > 0
            ? conclusiveRuns.reduce((a, b) =>
              a.executedAt >= b.executedAt ? a : b
            )
            : null;
        return { model, latestRun, totalRuns, successRate };
      })
    );

    entries.sort((a, b) => a.successRate - b.successRate);
    return entries;
  },
});

export const getModelBreakdown = query({
  args: { modelId: v.id("aiModels") },
  handler: async (ctx, { modelId }) => {
    const tests = await ctx.db
      .query("testCases")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const entries = await Promise.all(
      tests.map(async (test) => {
        const runs = await ctx.db
          .query("testRuns")
          .withIndex("by_test_and_model", (q) =>
            q.eq("testCaseId", test._id).eq("modelId", modelId)
          )
          .collect();
        // Only consider conclusive results (success or failed), 
        // not infrastructure failures (error/timeout)
        const conclusiveRuns = runs.filter(
          (r) => r.status === "success" || r.status === "failed"
        );
        const totalRuns = conclusiveRuns.length;
        const successfulRuns = conclusiveRuns.filter((r) => r.isCorrect).length;
        const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
        const latestRun =
          conclusiveRuns.length > 0
            ? conclusiveRuns.reduce((a, b) =>
              a.executedAt >= b.executedAt ? a : b
            )
            : null;
        return { test, latestRun, totalRuns, successRate };
      })
    );

    entries.sort((a, b) => a.successRate - b.successRate);
    return entries;
  },
});

export const getActiveTestCases = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db
      .query("testCases")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    return tests.sort((a, b) => b.memenessScore - a.memenessScore);
  },
});

/** Active tests with kill rate from latest run per model:
 *  % of models that failed (isCorrect false). */
export const getActiveTestCasesWithKillRates = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db
      .query("testCases")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const allStats = await ctx.db.query("testModelStats").collect();
    const statsByTest = new Map<string, typeof allStats>();
    for (const stat of allStats) {
      const key = String(stat.testCaseId);
      const arr = statsByTest.get(key);
      if (arr) arr.push(stat);
      else statsByTest.set(key, [stat]);
    }

    const activeModelIds = new Set(models.map((m) => String(m._id)));

    const testsWithRates = tests.map((test) => {
      const stats = statsByTest.get(String(test._id)) ?? [];
      let failed = 0;
      let total = 0;
      for (const stat of stats) {
        if (!activeModelIds.has(String(stat.modelId))) continue;
        total += 1;
        if (!stat.latestIsCorrect) failed += 1;
      }
      const killRate =
        total > 0 ? Math.round((failed / total) * 100) : null;
      return { ...test, killRate };
    });

    return testsWithRates.sort((a, b) => {
      const rateA = a.killRate ?? -1;
      const rateB = b.killRate ?? -1;
      return rateB - rateA;
    });
  },
});

export const getActiveModels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

/** Pairs (testCaseId, modelId) whose latest run has status "error". */
export const getErroredTestRunPairs = query({
  args: {},
  handler: async (ctx) => {
    const errorRuns = await ctx.db
      .query("testRuns")
      .withIndex("by_status", (q) => q.eq("status", "error"))
      .collect();
    const uniquePairs = new Map<string, {
      testCaseId: typeof errorRuns[0]["testCaseId"]; modelId: typeof errorRuns[0]["modelId"]
    }>();
    for (const r of errorRuns) {
      const key = `${r.testCaseId}:${r.modelId}`;
      if (!uniquePairs.has(key)) {
        uniquePairs.set(key, {
          testCaseId: r.testCaseId, modelId: r.modelId
        });
      }
    }
    const result: {
      testCaseId: typeof errorRuns[0]["testCaseId"];
      modelId: typeof errorRuns[0]["modelId"]
    }[] = [];
    for (const { testCaseId, modelId } of uniquePairs.values()) {
      const runs = await ctx.db
        .query("testRuns")
        .withIndex("by_test_and_model", (q) =>
          q.eq("testCaseId", testCaseId).eq("modelId", modelId)
        )
        .collect();
      const latest = runs.sort((a, b) => b.executedAt - a.executedAt)[0];
      if (latest?.status === "error") result.push({ testCaseId, modelId });
    }
    return result;
  },
});

/** All active (testCase, model) pairs that have zero runs of any kind. */
export const getUnrunPairs = query({
  args: {},
  handler: async (ctx) => {
    const tests = await ctx.db
      .query("testCases")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const unrun: { testCaseId: typeof tests[0]["_id"]; modelId: typeof models[0]["_id"] }[] = [];

    for (const test of tests) {
      for (const model of models) {
        const firstRun = await ctx.db
          .query("testRuns")
          .withIndex("by_test_and_model", (q) =>
            q.eq("testCaseId", test._id).eq("modelId", model._id)
          )
          .first();
        if (!firstRun) {
          unrun.push({ testCaseId: test._id, modelId: model._id });
        }
      }
    }

    return unrun;
  },
});

/** Test and model by ids; null if either missing or inactive (for rerun scheduling). */
export const getTestAndModelForRun = query({
  args: {
    testCaseId: v.id("testCases"),
    modelId: v.id("aiModels"),
  },
  handler: async (ctx, { testCaseId, modelId }) => {
    const test = await ctx.db.get("testCases", testCaseId);
    const model = await ctx.db.get("aiModels", modelId);
    if (!test || !model || !test.isActive || !model.isActive) return null;
    return { test, model };
  },
});

export const getModelsByProvider = query({
  args: { provider: v.string() },
  handler: async (ctx, { provider }) => {
    return await ctx.db
      .query("aiModels")
      .withIndex("by_provider", (q) => q.eq("provider", provider))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

export const getProviderLeaderboard = query({
  args: { provider: v.string() },
  handler: async (ctx, { provider }) => {
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_provider", (q) => q.eq("provider", provider))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (models.length === 0) return { entries: [], providerAvgResponseTimeMs: 0 };

    let providerTotalTimeMs = 0;
    let providerTimeCount = 0;

    const entries = await Promise.all(
      models.map(async (model) => {
        const stats = await ctx.db
          .query("testModelStats")
          .withIndex("by_model", (q) => q.eq("modelId", model._id))
          .collect();

        let totalRuns = 0;
        let successfulRuns = 0;
        let totalTimeMs = 0;
        let timeCount = 0;
        for (const s of stats) {
          totalRuns += s.successRunCount;
          successfulRuns += s.correctRunCount;
          totalTimeMs += s.totalExecutionTimeMs;
          timeCount += s.runsWithTimeCount;
        }

        providerTotalTimeMs += totalTimeMs;
        providerTimeCount += timeCount;

        const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
        const avgExecutionTimeMs =
          timeCount > 0 ? Math.round(totalTimeMs / timeCount) : 0;

        return {
          model,
          totalRuns,
          successfulRuns,
          successRate,
          trend: (successRate >= 0.7
            ? "up"
            : successRate <= 0.25
              ? "down"
              : "stable") as "up" | "down" | "stable",
          rank: 0,
          avgExecutionTimeMs,
        };
      })
    );

    entries.sort((a, b) => b.successRate - a.successRate);
    entries.forEach((e, i) => (e.rank = i + 1));

    const providerAvgResponseTimeMs =
      providerTimeCount > 0
        ? Math.round(providerTotalTimeMs / providerTimeCount)
        : 0;

    return { entries, providerAvgResponseTimeMs };
  },
});

export const getProviderBreakdown = query({
  args: { provider: v.string() },
  handler: async (ctx, { provider }) => {
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_provider", (q) => q.eq("provider", provider))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    if (models.length === 0) return [];

    const tests = await ctx.db
      .query("testCases")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const modelIds = new Set(models.map((m) => String(m._id)));

    const allStats = await ctx.db.query("testModelStats").collect();
    const statsByTest = new Map<string, typeof allStats>();
    for (const stat of allStats) {
      if (!modelIds.has(String(stat.modelId))) continue;
      const key = String(stat.testCaseId);
      const arr = statsByTest.get(key);
      if (arr) arr.push(stat);
      else statsByTest.set(key, [stat]);
    }

    const result = tests.map((test) => {
      const stats = statsByTest.get(String(test._id)) ?? [];
      let passed = 0;
      let total = 0;
      for (const stat of stats) {
        total += 1;
        if (stat.latestIsCorrect) passed += 1;
      }
      const providerPassRate = total > 0 ? passed / total : 0;
      return { test, providerPassRate };
    });

    result.sort((a, b) => a.providerPassRate - b.providerPassRate);
    return result;
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const models = await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    const allStats = await ctx.db.query("testModelStats").collect();
    const statsByModel = new Map<string, typeof allStats>();
    for (const stat of allStats) {
      const key = String(stat.modelId);
      const arr = statsByModel.get(key);
      if (arr) arr.push(stat);
      else statsByModel.set(key, [stat]);
    }

    const entries = models.map((model) => {
      const stats = statsByModel.get(String(model._id)) ?? [];
      let totalRuns = 0;
      let successfulRuns = 0;
      for (const s of stats) {
        totalRuns += s.successRunCount;
        successfulRuns += s.correctRunCount;
      }
      const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;

      return {
        model,
        totalRuns,
        successfulRuns,
        successRate,
        trend: (successRate >= 0.7
          ? "up"
          : successRate <= 0.25
            ? "down"
            : "stable") as "up" | "down" | "stable",
        rank: 0,
      };
    });

    entries.sort((a, b) => b.successRate - a.successRate);
    entries.forEach((e, i) => (e.rank = i + 1));

    return entries;
  },
});

export const getComparisonGrid = query({
  args: {},
  handler: async (ctx) => {
    const allStats = await ctx.db.query("testModelStats").collect();

    return allStats.map((stat) => ({
      testCaseId: stat.testCaseId,
      modelId: stat.modelId,
      isCorrect: stat.latestIsCorrect,
      successRate: stat.latestIsCorrect ? 1 : 0,
      status: stat.latestStatus,
      parsedAnswer: stat.latestParsedAnswer ?? null,
      rawResponse: stat.latestRawResponse ?? "",
    }));
  },
});

export const getLastTestRunTime = query({
  args: {},
  handler: async (ctx) => {
    const latestRun = await ctx.db
      .query("testRuns")
      .withIndex("by_executed_at")
      .order("desc")
      .first();

    return latestRun?.executedAt ?? null;
  },
});
