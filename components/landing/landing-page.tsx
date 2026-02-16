"use client";

import { useState, useEffect } from "react";
import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TestCase, AIModel, LeaderboardEntry, ComparisonCell } from "@/lib/types";
import { HeroSection } from "./hero-section";
import { LeaderboardSection } from "./leaderboard-section";
import { ComparisonGridSection } from "./comparison-grid-section";
import { SubmitChallengeCta } from "./submit-challenge-cta";
import { TestsSection } from "./tests-section";
interface LandingPageProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCasesWithKillRates>;
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
  preloadedLeaderboard: Preloaded<typeof api.queries.getLeaderboard>;
  preloadedGrid: Preloaded<typeof api.queries.getComparisonGrid>;
  preloadedLastRun: Preloaded<typeof api.queries.getLastTestRunTime>;
}

export function LandingPage({
  preloadedTests,
  preloadedModels,
  preloadedLeaderboard,
  preloadedGrid,
  preloadedLastRun,
}: LandingPageProps) {
  const tests = usePreloadedQuery(preloadedTests);
  const models = usePreloadedQuery(preloadedModels);
  const leaderboard = usePreloadedQuery(preloadedLeaderboard);
  const grid = usePreloadedQuery(preloadedGrid);
  const lastRunTime = usePreloadedQuery(preloadedLastRun);

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
  const [nowMs, setNowMs] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setNowMs(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HeroSection
        modelCount={aiModels.length}
        testCount={testCases.length}
        providerCount={new Set(aiModels.map((m) => m.provider)).size}
        lastUpdated={lastUpdated}
        nowMs={nowMs}
      />

      <main className="relative z-10">
        <LeaderboardSection leaderboard={leaderboardEntries} />
        <TestsSection tests={testCases} />
        <section id="test-runs" className="bg-background py-20">
          <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
            <div className="mb-16 text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
                Benchmark
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white lg:text-4xl">
                Providers Performance
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                Failure-rate snapshot by provider (averaged across their
                models).
              </p>
            </div>
            <ComparisonGridSection
              tests={testCases}
              models={aiModels}
              grid={comparisonGrid}
            />
            <SubmitChallengeCta />
          </div>
        </section>
      </main>
    </div>
  );
}
