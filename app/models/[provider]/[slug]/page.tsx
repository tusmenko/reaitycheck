import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { ModelDetailPage } from "@/components/detail/model-detail-page";

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
