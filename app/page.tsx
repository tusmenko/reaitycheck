import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { LandingPage } from "@/components/landing/landing-page";

export const metadata = {
  description:
    "Daily automated testing of viral and edge-case AI failure cases. Track real-world limitations of the most popular models.",
};

export default async function Home() {
  const [
    preloadedTests,
    preloadedModels,
    preloadedLeaderboard,
    preloadedGrid,
    preloadedLastRun,
  ] = await Promise.all([
    preloadQuery(api.queries.getActiveTestCasesWithKillRates),
    preloadQuery(api.queries.getActiveModels),
    preloadQuery(api.queries.getLeaderboard),
    preloadQuery(api.queries.getComparisonGrid),
    preloadQuery(api.queries.getLastTestRunTime),
  ]);

  return (
    <LandingPage
      preloadedTests={preloadedTests}
      preloadedModels={preloadedModels}
      preloadedLeaderboard={preloadedLeaderboard}
      preloadedGrid={preloadedGrid}
      preloadedLastRun={preloadedLastRun}
    />
  );
}
