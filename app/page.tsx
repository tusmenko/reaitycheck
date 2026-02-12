import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { LandingPage } from "@/components/landing/landing-page";

export default async function Home() {
  const [
    preloadedTests,
    preloadedModels,
    preloadedLeaderboard,
    preloadedGrid,
    preloadedLastRun,
  ] = await Promise.all([
    preloadQuery(api.queries.getActiveTestCases),
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
