import type { ComparisonCell, AIModel } from "@/lib/types";

export const providerPageHref = (provider: string) => {
  return `/providers/${encodeURIComponent(provider)}`;
};

export const getResult = (
  grid: ComparisonCell[],
  testCaseId: string,
  modelId: string
): ComparisonCell | undefined => {
  return grid.find(
    (c) => c.testCaseId === testCaseId && c.modelId === modelId
  );
};

export const getProviderFailureRate = (
  grid: ComparisonCell[],
  testCaseId: string,
  provider: string,
  models: AIModel[]
): number | null => {
  const providerModels = models.filter((m) => m.provider === provider);
  const cells = providerModels
    .map((m) => getResult(grid, testCaseId, m._id))
    .filter((c): c is ComparisonCell => c != null);
  if (cells.length === 0) return null;
  const avgSuccess =
    cells.reduce((sum, c) => sum + c.successRate, 0) / cells.length;
  return 1 - avgSuccess;
};
