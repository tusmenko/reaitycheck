import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { ModelsOverviewContent } from "@/components/landing/models-overview-content";

export const metadata = {
  title: "Models by provider — ReAIty Check",
  description:
    "Browse AI models by provider. Compare failure rates and see how each model performs on our challenge suites.",
};

export default async function ModelsOverviewPage() {
  const preloadedModels = await preloadQuery(api.queries.getActiveModels);

  return <ModelsOverviewContent preloadedModels={preloadedModels} />;
}
