"use client";

import { usePreloadedQuery, useQuery, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { ComparisonGridSection } from "./comparison-grid-section";

interface BenchmarkPageContentProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCases>;
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
}

export function BenchmarkPageContent({
  preloadedTests,
  preloadedModels,
}: BenchmarkPageContentProps) {
  const tests = usePreloadedQuery(preloadedTests);
  const models = usePreloadedQuery(preloadedModels);
  // Fetch grid on client so we get full Convex response (rawResponse, parsedAnswer)
  const grid = useQuery(api.queries.getComparisonGrid);

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

  // Pass grid as-is so we don't drop any keys Convex returns (e.g. rawResponse, parsedAnswer)
  const comparisonGrid: ComparisonCell[] = (grid ?? []).map((cell) => ({
    ...cell,
    status: cell.status as ComparisonCell["status"],
    parsedAnswer: cell.parsedAnswer ?? undefined,
  }));

  return (
    <div className="relative min-h-screen h-full overflow-x-hidden bg-background">
      <main className="relative">
        {grid === undefined ? (
          <section className="relative bg-background px-6 pb-16 pt-8 lg:px-12">
            <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-6xl">
              <p className="text-gray-400">Loading benchmark data…</p>
            </div>
          </section>
        ) : (
          <section
            id="test-runs"
            className="relative bg-background px-6 pb-16 pt-8 lg:px-12"
          >
            <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />
            <div className="relative z-10 mx-auto max-w-6xl">
              <div className="mb-16">
                <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
                  Benchmark
                </p>
                <h2 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
                  Models Performance
                </h2>
                <p className="mt-4 max-w-2xl text-base text-gray-400 lg:text-lg">
                  Failure-rate snapshot across current challenge suites.
                </p>
              </div>
              <ComparisonGridSection
                tests={testCases}
                models={aiModels}
                grid={comparisonGrid}
                granularity="model"
                variant="full"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
