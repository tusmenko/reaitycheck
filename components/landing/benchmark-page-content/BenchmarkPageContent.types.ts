import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface BenchmarkPageContentProps {
  preloadedTests: Preloaded<typeof api.queries.getActiveTestCasesWithKillRates>;
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
}
