import type { Metadata } from "next";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { ModelDetailPage } from "@/components/detail/model-detail-page";

const siteUrl = "https://reaitycheck.com";
const siteName = "ReAIty Check";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ provider: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = await fetchQuery(api.queries.getModelBySlug, { slug });
  if (!model) return {};
  const description =
    model.description && model.description.length > 0
      ? model.description.slice(0, 160) + (model.description.length > 160 ? "..." : "")
      : `Benchmark results and failure rate for ${model.modelName}. Compare with other models on ReAIty Check.`;
  const path = `/providers/${encodeURIComponent(model.provider)}/${encodeURIComponent(slug)}`;
  const fullTitle = `${model.modelName} — ${siteName}`;
  return {
    title: model.modelName,
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

export default async function ModelPage({
  params,
}: {
  params: Promise<{ provider: string; slug: string }>;
}) {
  const { slug } = await params;
  const model = await fetchQuery(api.queries.getModelBySlug, { slug });
  if (!model) {
    notFound();
  }
  const [preloadedModel, preloadedBreakdown] = await Promise.all([
    preloadQuery(api.queries.getModelBySlug, { slug }),
    preloadQuery(api.queries.getModelBreakdown, { modelId: model._id }),
  ]);

  return (
    <ModelDetailPage
      preloadedModel={preloadedModel}
      preloadedBreakdown={preloadedBreakdown}
    />
  );
}
