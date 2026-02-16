import { useMemo } from "react";
import { usePreloadedQuery } from "convex/react";
import { type TestDetailPageProps } from "./TestDetailPage.types";

export const useTestDetailPage = ({
  preloadedTest,
  preloadedBreakdown,
}: TestDetailPageProps) => {
  const test = usePreloadedQuery(preloadedTest);
  const breakdown = usePreloadedQuery(preloadedBreakdown);

  const stats = useMemo(() => {
    const totalModels = breakdown.length;
    const modelsCracked = breakdown.filter(
      (e) => e.latestRun && !e.latestRun.isCorrect
    ).length;
    const breakRate =
      totalModels > 0
        ? (breakdown.filter((e) => e.latestRun && !e.latestRun.isCorrect)
          .length /
          totalModels) *
        100
        : 0;

    return {
      totalModels,
      modelsCracked,
      breakRate,
    };
  }, [breakdown]);

  return {
    test,
    breakdown,
    stats,
  };
};
