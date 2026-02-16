import type { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ChallengesCatalogContentProps {
  preloadedTests: Preloaded<
    typeof api.queries.getActiveTestCasesWithKillRates
  >;
}
