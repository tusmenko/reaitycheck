import type { TestCase, AIModel } from "@/lib/types";

export const useComparisonGridSection = (
  tests: TestCase[],
  models: AIModel[],
  variant: "preview" | "full"
) => {
  const allProviders = Array.from(
    new Set(models.map((m) => m.provider))
  ).sort();
  const tableProviders =
    variant === "full" ? allProviders : allProviders.slice(0, 6);
  const tableModels = variant === "full" ? models : models.slice(0, 4);
  const tableTests = variant === "full" ? tests : tests.slice(0, 8);

  return {
    tableProviders,
    tableModels,
    tableTests,
  };
};
