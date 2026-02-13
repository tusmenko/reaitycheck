"use client";

import { usePreloadedQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { Navbar } from "./navbar";
import { FooterSection } from "./footer-section";
import { ComparisonGridSection } from "./comparison-grid-section";

interface BenchmarkPageContentProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCases>;
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
  preloadedGrid: Preloaded<typeof api.queries.getComparisonGrid>;
}

export function BenchmarkPageContent({
  preloadedTests,
  preloadedModels,
  preloadedGrid,
}: BenchmarkPageContentProps) {
  const tests = usePreloadedQuery(preloadedTests);
  const models = usePreloadedQuery(preloadedModels);
  const grid = usePreloadedQuery(preloadedGrid);

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

  const comparisonGrid: ComparisonCell[] = grid.map((cell) => ({
    testCaseId: cell.testCaseId,
    modelId: cell.modelId,
    isCorrect: cell.isCorrect,
    successRate: cell.successRate,
    status: cell.status as ComparisonCell["status"],
  }));

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-dark-50">
      <Navbar />
      <main className="relative z-10 pt-20">
        <ComparisonGridSection
          tests={testCases}
          models={aiModels}
          grid={comparisonGrid}
          variant="full"
        />
      </main>
      <FooterSection />
    </div>
  );
}
