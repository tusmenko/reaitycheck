import { type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ProviderDetailPageProps {
  provider: string;
  preloadedProviderLeaderboard: Preloaded<
    typeof api.queries.getProviderLeaderboard
  >;
  preloadedProviderBreakdown: Preloaded<
    typeof api.queries.getProviderBreakdown
  >;
}
