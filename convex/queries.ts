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

export const getActiveModels = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("aiModels")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
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

    // Group by test+model, keep latest run per pair
    const latestByPair = new Map<
      string,
      {
        testCaseId: string;
        modelId: string;
        isCorrect: boolean;
        successRate: number;
        status: string;
        executedAt: number;
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
        });
      }
    }

    return Array.from(latestByPair.values()).map((entry) => {
      const { executedAt, ...rest } = entry;
      void executedAt; // Used for comparison only, omit from result
      return rest;
    });
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
