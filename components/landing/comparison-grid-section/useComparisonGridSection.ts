import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { getProviderFailureRate } from "./ComparisonGridSection.utils";

export const useComparisonGridSection = (
  tests: TestCase[],
  models: AIModel[],
  grid: ComparisonCell[],
  variant: "preview" | "full"
) => {
  const allProviders = Array.from(
    new Set(models.map((m) => m.provider))
  );

  // Sort providers by overall failure rate (most failing first)
  allProviders.sort((a, b) => {
    const failA = avgProviderFailureRate(grid, a, tests, models);
    const failB = avgProviderFailureRate(grid, b, tests, models);
    return failB - failA;
  });

  const tableProviders =
    variant === "full" ? allProviders : allProviders.slice(0, 6);

  // Sort models by overall failure rate (most failing first)
  const sortedModels = [...models].sort((a, b) => {
    const failA = avgModelFailureRate(grid, a._id, tests);
    const failB = avgModelFailureRate(grid, b._id, tests);
    return failB - failA;
  });
  const tableModels =
    variant === "full" ? sortedModels : sortedModels.slice(0, 4);

  const tableTests = tests;

  return {
    tableProviders,
    tableModels,
    tableTests,
  };
};

/** Average failure rate of a provider across all tests. */
const avgProviderFailureRate = (
  grid: ComparisonCell[],
  provider: string,
  tests: TestCase[],
  models: AIModel[]
): number => {
  let sum = 0;
  let count = 0;
  for (const test of tests) {
    const rate = getProviderFailureRate(grid, test._id, provider, models);
    if (rate != null) {
      sum += rate;
      count += 1;
    }
  }
  return count > 0 ? sum / count : 0;
};

/** Average failure rate of a model across all tests. */
const avgModelFailureRate = (
  grid: ComparisonCell[],
  modelId: string,
  tests: TestCase[]
): number => {
  let failed = 0;
  let total = 0;
  for (const test of tests) {
    const cell = grid.find(
      (c) => c.testCaseId === test._id && c.modelId === modelId
    );
    if (cell) {
      total += 1;
      if (!cell.isCorrect) failed += 1;
    }
  }
  return total > 0 ? failed / total : 0;
};
