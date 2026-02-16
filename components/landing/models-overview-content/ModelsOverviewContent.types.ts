import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

export interface ModelsOverviewContentProps {
  preloadedModels: Preloaded<typeof api.queries.getActiveModels>;
}
