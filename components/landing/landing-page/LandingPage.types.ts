import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface LandingPageProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCasesWithKillRates>;
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
  preloadedLeaderboard: Preloaded<typeof api.queries.getLeaderboard>;
  preloadedGrid: Preloaded<typeof api.queries.getComparisonGrid>;
  preloadedLastRun: Preloaded<typeof api.queries.getLastTestRunTime>;
}
