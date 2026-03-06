import { usePreloadedQuery } from "convex/react";
import { useMemo } from "react";
import { type ProviderDetailPageProps } from "./ProviderDetailPage.types";

export const useProviderDetailPage = ({
  preloadedProviderLeaderboard,
  preloadedProviderBreakdown,
}: Omit<ProviderDetailPageProps, "provider">) => {
  const { entries } = usePreloadedQuery(preloadedProviderLeaderboard);
  const breakdown = usePreloadedQuery(preloadedProviderBreakdown);

  const stats = useMemo(() => {
    const modelCount = entries.length;
    const avgResilience =
      modelCount > 0
        ? (entries.reduce((sum, e) => sum + e.successRate, 0) / modelCount) *
          100
        : 0;
    const totalTestsSurvived = entries.reduce(
      (sum, e) => sum + e.successfulRuns,
      0
    );
    const totalTestsFailed = entries.reduce(
      (sum, e) => sum + (e.totalRuns - e.successfulRuns),
      0
    );

    return {
      modelCount,
      avgResilience,
      totalTestsSurvived,
      totalTestsFailed,
    };
  }, [entries]);

  const toughestBreakers = useMemo(() => breakdown.slice(0, 3), [breakdown]);

  return {
    entries,
    breakdown,
    stats,
    toughestBreakers,
  };
};
