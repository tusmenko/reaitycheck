import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { ProviderDetailPage } from "@/components/detail/provider-detail-page";

export default async function ModelProviderPage({
  params,
}: {
  params: Promise<{ provider: string }>;
}) {
  const { provider } = await params;
  const models = await fetchQuery(api.queries.getModelsByProvider, { provider });
  if (!models || models.length === 0) {
    notFound();
  }
  const [preloadedLeaderboard, preloadedBreakdown] = await Promise.all([
    preloadQuery(api.queries.getProviderLeaderboard, { provider }),
    preloadQuery(api.queries.getProviderBreakdown, { provider }),
  ]);

  return (
    <ProviderDetailPage
      provider={provider}
      preloadedProviderLeaderboard={preloadedLeaderboard}
      preloadedProviderBreakdown={preloadedBreakdown}
    />
  );
}
