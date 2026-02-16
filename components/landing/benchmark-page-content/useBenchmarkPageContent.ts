import { usePreloadedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import type { BenchmarkPageContentProps } from "./BenchmarkPageContent.types";

export const useBenchmarkPageContent = ({
  preloadedTests,
  preloadedModels,
}: BenchmarkPageContentProps) => {
  const tests = usePreloadedQuery(preloadedTests);
  const models = usePreloadedQuery(preloadedModels);
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

  const comparisonGrid: ComparisonCell[] = (grid ?? []).map((cell) => ({
    ...cell,
    status: cell.status as ComparisonCell["status"],
    parsedAnswer: cell.parsedAnswer ?? undefined,
  }));

  return {
    testCases,
    aiModels,
    comparisonGrid,
    isLoading: grid === undefined,
  };
};
