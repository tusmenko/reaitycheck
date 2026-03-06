import { usePreloadedQuery } from "convex/react";
import { useState, useMemo } from "react";
import { type ModelDetailPageProps } from "./ModelDetailPage.types";

export const useModelDetailPage = ({
  preloadedModel,
  preloadedBreakdown,
}: ModelDetailPageProps) => {
  const model = usePreloadedQuery(preloadedModel);
  const breakdown = usePreloadedQuery(preloadedBreakdown);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const stats = useMemo(() => {
    const totalTests = breakdown.length;
    const testsSurvived = breakdown.filter(
      (e) => e.latestRun && e.latestRun.isCorrect
    ).length;
    const resilienceRate =
      totalTests > 0
        ? (breakdown.filter((e) => e.latestRun && e.latestRun.isCorrect).length /
          totalTests) *
        100
        : 0;

    return {
      totalTests,
      testsSurvived,
      resilienceRate,
    };
  }, [breakdown]);

  const toughestBreakers = useMemo(
    () =>
      [...breakdown]
        .filter((e) => e.latestRun != null)
        .sort((a, b) => a.successRate - b.successRate)
        .slice(0, 3),
    [breakdown]
  );

  const handleToggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  return {
    model,
    breakdown,
    stats,
    toughestBreakers,
    isDescriptionExpanded,
    handleToggleDescription,
  };
};
