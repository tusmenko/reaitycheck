import { useState, useMemo } from "react";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import {
  getResult,
  getProviderFailureRate,
} from "./ComparisonGridSection.utils";

export const useComparisonGridSection = (
  tests: TestCase[],
  models: AIModel[],
  grid: ComparisonCell[],
  variant: "preview" | "full"
) => {
  const [sortByTestId, setSortByTestId] = useState<string | null>(
    null
  );

  const toggleSortByTest = (testId: string) => {
    setSortByTestId((prev) => (prev === testId ? null : testId));
  };

  const tableTests = tests;

  const tableProviders = useMemo(() => {
    const all = Array.from(
      new Set(models.map((m) => m.provider))
    );

    if (sortByTestId) {
      all.sort((a, b) => {
        const failA =
          getProviderFailureRate(grid, sortByTestId, a, models)
          ?? -1;
        const failB =
          getProviderFailureRate(grid, sortByTestId, b, models)
          ?? -1;
        return failB - failA;
      });
    } else {
      all.sort((a, b) => {
        const failA = avgProviderFailureRate(
          grid, a, tests, models
        );
        const failB = avgProviderFailureRate(
          grid, b, tests, models
        );
        return failB - failA;
      });
    }

    return variant === "full" ? all : all.slice(0, 6);
  }, [models, grid, tests, variant, sortByTestId]);

  const tableModels = useMemo(() => {
    const sorted = [...models].sort((a, b) => {
      if (sortByTestId) {
        const cellA = getResult(grid, sortByTestId, a._id);
        const cellB = getResult(grid, sortByTestId, b._id);
        const failA = cellA ? (cellA.isCorrect ? 0 : 1) : -1;
        const failB = cellB ? (cellB.isCorrect ? 0 : 1) : -1;
        return failB - failA;
      }
      const failA = avgModelFailureRate(grid, a._id, tests);
      const failB = avgModelFailureRate(grid, b._id, tests);
      return failB - failA;
    });

    return variant === "full" ? sorted : sorted.slice(0, 4);
  }, [models, grid, tests, variant, sortByTestId]);

  return {
    tableProviders,
    tableModels,
    tableTests,
    sortByTestId,
    toggleSortByTest,
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
    const rate = getProviderFailureRate(
      grid, test._id, provider, models
    );
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
