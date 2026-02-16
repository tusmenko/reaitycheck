import { usePreloadedQuery } from "convex/react";
import type { ModelsOverviewContentProps } from "./ModelsOverviewContent.types";

export const useModelsOverviewContent = ({
  preloadedModels,
}: ModelsOverviewContentProps) => {
  const models = usePreloadedQuery(preloadedModels);
  const providers = Array.from(new Set(models.map((m) => m.provider))).sort();

  return {
    providers,
  };
};
