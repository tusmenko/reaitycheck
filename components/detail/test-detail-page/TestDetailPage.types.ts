import { type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface TestDetailPageProps {
  preloadedTest: Preloaded<typeof api.queries.getTestBySlug>;
  preloadedBreakdown: Preloaded<typeof api.queries.getTestBreakdown>;
}
