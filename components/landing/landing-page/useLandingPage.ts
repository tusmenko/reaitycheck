import { usePreloadedQuery } from "convex/react";
import { useState, useEffect } from "react";
import type { TestCase, AIModel, LeaderboardEntry, ComparisonCell } from "@/lib/types";
import type { LandingPageProps } from "./LandingPage.types";

export const useLandingPage = ({
  preloadedTests,
  preloadedModels,
  preloadedLeaderboard,
  preloadedGrid,
  preloadedLastRun,
}: LandingPageProps) => {
  const tests = usePreloadedQuery(preloadedTests);
  const models = usePreloadedQuery(preloadedModels);
  const leaderboard = usePreloadedQuery(preloadedLeaderboard);
  const grid = usePreloadedQuery(preloadedGrid);
  const lastRunTime = usePreloadedQuery(preloadedLastRun);

  const [nowMs, setNowMs] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setNowMs(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  const testCases: TestCase[] = tests.map((t) => ({
    ...t,
    _id: t._id,
    explanation: t.explanation ?? "",
  }));

  const aiModels: AIModel[] = models.map((m) => ({
    ...m,
    _id: m._id,
    provider: m.provider as AIModel["provider"],
    modelVersion: m.modelVersion ?? "",
    contextWindow: m.contextWindow ?? 0,
    inputCostPer1MTokens: m.inputCostPer1MTokens,
    outputCostPer1MTokens: m.outputCostPer1MTokens,
    maxCompletionTokens: m.maxCompletionTokens,
    isFree: m.isFree,
  }));

  const leaderboardEntries: LeaderboardEntry[] = leaderboard.map((entry) => ({
    model: {
      ...entry.model,
      _id: entry.model._id,
      provider: entry.model.provider as AIModel["provider"],
      modelVersion: entry.model.modelVersion ?? "",
      contextWindow: entry.model.contextWindow ?? 0,
      inputCostPer1MTokens: entry.model.inputCostPer1MTokens,
      outputCostPer1MTokens: entry.model.outputCostPer1MTokens,
      maxCompletionTokens: entry.model.maxCompletionTokens,
      isFree: entry.model.isFree,
    },
    totalRuns: entry.totalRuns,
    successfulRuns: entry.successfulRuns,
    successRate: entry.successRate,
    trend: entry.trend,
    rank: entry.rank,
  }));

  const comparisonGrid: ComparisonCell[] = grid.map((cell) => ({
    testCaseId: cell.testCaseId,
    modelId: cell.modelId,
    isCorrect: cell.isCorrect,
    successRate: cell.successRate,
    status: cell.status as ComparisonCell["status"],
  }));

  const lastUpdated = lastRunTime ? new Date(lastRunTime) : new Date();
  const providerCount = new Set(aiModels.map((m) => m.provider)).size;

  return {
    testCases,
    aiModels,
    leaderboardEntries,
    comparisonGrid,
    lastUpdated,
    nowMs,
    providerCount,
  };
};
