import type { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { ProviderDetailPage } from "@/components/detail/provider-detail-page";
import { providerDisplayName } from "@/lib/model-detail-utils";

const siteUrl = "https://reaitycheck.com";
const siteName = "ReAIty Check";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string }>;
}): Promise<Metadata> {
  const { provider } = await params;
  const models = await fetchQuery(api.queries.getModelsByProvider, { provider });
  if (!models || models.length === 0) return {};
  const displayName = providerDisplayName(provider);
  const description = `Benchmark results and failure rates for ${displayName} models. Compare ${models.length} model${models.length !== 1 ? "s" : ""} on our challenge suite.`;
  const path = `/providers/${encodeURIComponent(provider)}`;
  const fullTitle = `${displayName} models — ${siteName}`;
  return {
    title: `${displayName} models`,
    description,
    alternates: { canonical: `${siteUrl}${path}` },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${path}`,
      siteName,
      type: "website",
    },
  };
}

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
