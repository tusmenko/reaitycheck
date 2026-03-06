import { type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ModelDetailPageProps {
  preloadedModel: Preloaded<typeof api.queries.getModelBySlug>;
  preloadedBreakdown: Preloaded<typeof api.queries.getModelBreakdown>;
}
