import { usePreloadedQuery } from "convex/react";
import type { ChallengesCatalogContentProps } from "./ChallengesCatalogContent.types";
import type { TestCase } from "@/lib/types";

export const useChallengesCatalogContent = (
  preloadedTests: ChallengesCatalogContentProps["preloadedTests"]
) => {
  const tests = usePreloadedQuery(preloadedTests);

  const testCases: TestCase[] = tests.map((t) => ({
    ...t,
    _id: t._id,
    explanation: t.explanation ?? "",
  }));

  const topThree = testCases.slice(0, 3);
  const rest = testCases.slice(3);

  return {
    testCases,
    topThree,
    rest,
  };
};
