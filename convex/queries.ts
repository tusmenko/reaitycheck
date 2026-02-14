import { query } from "./_generated/server";
import { v } from "convex/values";

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
        const totalRuns = runs.length;
        const successfulRuns = runs.filter((r) => r.isCorrect).length;
        const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
        const latestRun =
          runs.length > 0
            ? runs.reduce((a, b) => (a.executedAt >= b.executedAt ? a : b))
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
        const totalRuns = runs.length;
        const successfulRuns = runs.filter((r) => r.isCorrect).length;
        const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
        const latestRun =
          runs.length > 0
            ? runs.reduce((a, b) => (a.executedAt >= b.executedAt ? a : b))
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

/** Active tests with kill rate from latest run per model: % of models that failed (isCorrect false). */
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

    const allRuns = await ctx.db.query("testRuns").collect();
    // Latest run per (testCaseId, modelId)
    const latestByPair = new Map<string, { isCorrect: boolean; executedAt: number }>();
    for (const run of allRuns) {
      const key = `${run.testCaseId}:${run.modelId}`;
      const existing = latestByPair.get(key);
      if (!existing || run.executedAt > existing.executedAt) {
        latestByPair.set(key, { isCorrect: run.isCorrect, executedAt: run.executedAt });
      }
    }

    const testsWithRates = tests.map((test) => {
      let failed = 0;
      let total = 0;
      for (const model of models) {
        const key = `${test._id}:${model._id}`;
        const latest = latestByPair.get(key);
        if (latest) {
          total += 1;
          if (!latest.isCorrect) failed += 1;
        }
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

    const allRuns = await ctx.db.query("testRuns").collect();
    const modelIds = new Set(models.map((m) => m._id));

    const entries = models.map((model) => {
      const runs = allRuns.filter(
        (r) => r.modelId === model._id && r.status === "success"
      );
      const successfulRuns = runs.filter((r) => r.isCorrect).length;
      const totalRuns = runs.length;
      const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
      const runsWithTime = runs.filter((r) => r.executionTimeMs != null);
      const avgExecutionTimeMs =
        runsWithTime.length > 0
          ? Math.round(
              runsWithTime.reduce((acc, r) => acc + r.executionTimeMs, 0) /
                runsWithTime.length
            )
          : 0;

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
    });

    entries.sort((a, b) => b.successRate - a.successRate);
    entries.forEach((e, i) => (e.rank = i + 1));

    const allProviderRuns = allRuns.filter((r) => modelIds.has(r.modelId));
    const withTime = allProviderRuns.filter((r) => r.executionTimeMs != null);
    const providerAvgResponseTimeMs =
      withTime.length > 0
        ? Math.round(
            withTime.reduce((acc, r) => acc + r.executionTimeMs, 0) /
              withTime.length
          )
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

    const allRuns = await ctx.db.query("testRuns").collect();
    const latestByPair = new Map<
      string,
      { isCorrect: boolean; executedAt: number }
    >();
    for (const run of allRuns) {
      if (models.some((m) => m._id === run.modelId)) {
        const key = `${run.testCaseId}:${run.modelId}`;
        const existing = latestByPair.get(key);
        if (!existing || run.executedAt > existing.executedAt) {
          latestByPair.set(key, {
            isCorrect: run.isCorrect,
            executedAt: run.executedAt,
          });
        }
      }
    }

    const result = tests.map((test) => {
      let passed = 0;
      let total = 0;
      for (const model of models) {
        const key = `${test._id}:${model._id}`;
        const latest = latestByPair.get(key);
        if (latest) {
          total += 1;
          if (latest.isCorrect) passed += 1;
        }
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

    const allRuns = await ctx.db.query("testRuns").collect();

    const entries = models.map((model) => {
      const runs = allRuns.filter(
        (r) => r.modelId === model._id && r.status === "success"
      );
      const successfulRuns = runs.filter((r) => r.isCorrect).length;
      const totalRuns = runs.length;
      const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;

      return {
        model,
        totalRuns,
        successfulRuns,
        successRate,
        // Trend is static for now — will be computed from historical data later
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
    const allRuns = await ctx.db.query("testRuns").collect();

    // Group by test+model, keep latest run per pair (include parsedAnswer for answer popup)
    const latestByPair = new Map<
      string,
      {
        testCaseId: string;
        modelId: string;
        isCorrect: boolean;
        successRate: number;
        status: string;
        executedAt: number;
        parsedAnswer?: string;
        rawResponse?: string;
      }
    >();

    for (const run of allRuns) {
      const key = `${run.testCaseId}:${run.modelId}`;
      const existing = latestByPair.get(key);
      if (!existing || run.executedAt > existing.executedAt) {
        latestByPair.set(key, {
          testCaseId: run.testCaseId,
          modelId: run.modelId,
          isCorrect: run.isCorrect,
          successRate: run.isCorrect ? 1 : 0,
          status: run.status,
          executedAt: run.executedAt,
          parsedAnswer: run.parsedAnswer,
          rawResponse: run.rawResponse,
        });
      }
    }

    return Array.from(latestByPair.values()).map((entry) => ({
      testCaseId: entry.testCaseId,
      modelId: entry.modelId,
      isCorrect: entry.isCorrect,
      successRate: entry.successRate,
      status: entry.status,
      // Explicitly include so they are never stripped from JSON (undefined would be omitted)
      parsedAnswer: entry.parsedAnswer ?? null,
      rawResponse: entry.rawResponse ?? "",
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
