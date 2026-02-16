import type { TestCase } from "@/lib/types";

export const useTestsSection = (tests: TestCase[]) => {
  const featuredChallenges = tests.slice(0, 5);

  const getKillRateDisplay = (test: TestCase) => {
    const killRate =
      test.killRate != null
        ? test.killRate
        : Math.min(95, Math.max(5, test.memenessScore * 10));
    const hasRealKillRate = test.killRate != null;

    return { killRate, hasRealKillRate };
  };

  return { featuredChallenges, getKillRateDisplay };
};
