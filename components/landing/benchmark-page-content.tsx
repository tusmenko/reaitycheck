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
    costPer1kTokens: m.costPer1kTokens ?? 0,
  }));

  // Pass grid as-is so we don't drop any keys Convex returns (e.g. rawResponse, parsedAnswer)
  const comparisonGrid: ComparisonCell[] = (grid ?? []).map((cell) => ({
    ...cell,
    status: cell.status as ComparisonCell["status"],
    parsedAnswer: cell.parsedAnswer ?? undefined,
  }));

  return (
    <div className="relative min-h-screen h-full overflow-x-hidden bg-background">
      <main className="relative z-10">
        {grid === undefined ? (
          <section className="bg-background py-20">
            <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
              <p className="text-gray-400">Loading benchmark data…</p>
            </div>
          </section>
        ) : (
          <ComparisonGridSection
            tests={testCases}
            models={aiModels}
            grid={comparisonGrid}
            granularity="model"
            variant="full"
          />
        )}
      </main>
    </div>
  );
}
