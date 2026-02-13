"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TestCase, AIModel, LeaderboardEntry, ComparisonCell } from "@/lib/types";
import { HeroSection } from "./hero-section";
import { LeaderboardSection } from "./leaderboard-section";
import { ComparisonGridSection } from "./comparison-grid-section";
import { TestsSection } from "./tests-section";
import { MethodologySection } from "./methodology-section";
import { FooterSection } from "./footer-section";

interface LandingPageProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCases>;
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
    difficulty: (t.difficulty ?? "medium") as TestCase["difficulty"],
    explanation: t.explanation ?? "",
  }));

  const aiModels: AIModel[] = models.map((m) => ({
    ...m,
    _id: m._id,
    provider: m.provider as AIModel["provider"],
    modelVersion: m.modelVersion ?? "",
    contextWindow: m.contextWindow ?? 0,
    costPer1kTokens: m.costPer1kTokens ?? 0,
  }));

  const leaderboardEntries: LeaderboardEntry[] = leaderboard.map((entry) => ({
    model: {
      ...entry.model,
      _id: entry.model._id,
      provider: entry.model.provider as AIModel["provider"],
      modelVersion: entry.model.modelVersion ?? "",
      contextWindow: entry.model.contextWindow ?? 0,
      costPer1kTokens: entry.model.costPer1kTokens ?? 0,
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
  const totalPromptRuns = leaderboardEntries.reduce(
    (sum, e) => sum + e.totalRuns,
    0
  );

  const killRateByTestId: Record<string, number> = {};
  testCases.forEach((test) => {
    const cells = comparisonGrid.filter((c) => c.testCaseId === test._id);
    if (cells.length === 0) return;
    const avgFailure =
      cells.reduce((sum, c) => sum + (1 - c.successRate), 0) / cells.length;
    killRateByTestId[test._id] = Math.round(avgFailure * 100);
  });

  return (
    <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
      <HeroSection
        modelCount={aiModels.length}
        testCount={testCases.length}
        lastUpdated={lastUpdated}
        totalPromptRuns={totalPromptRuns}
      />
      <LeaderboardSection leaderboard={leaderboardEntries} />
      <TestsSection
        tests={testCases}
        killRateByTestId={killRateByTestId}
      />
      <ComparisonGridSection
        tests={testCases}
        models={aiModels}
        grid={comparisonGrid}
      />
      <MethodologySection lastUpdated={lastUpdated} />
      <FooterSection />
    </div>
  );
}
