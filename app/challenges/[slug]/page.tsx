import { fetchQuery, preloadQuery } from "convex/nextjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestDetailPage } from "@/components/detail/test-detail-page";
import { api } from "@/convex/_generated/api";

const siteUrl = "https://reaitycheck.com";
const siteName = "ReAIty Check";

function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3).trim() + "...";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = await fetchQuery(api.queries.getTestBySlug, { slug });
  if (!test) return {};
  const description =
    test.prompt && test.prompt.length > 0
      ? `Challenge: ${test.category}. ${truncate(test.prompt, 160)}`
      : `AI challenge: ${test.name}. ${test.category}. Benchmark results and kill rate.`;
  const path = `/challenges/${encodeURIComponent(slug)}`;
  const fullTitle = `${test.name} — ${siteName}`;
  return {
    title: test.name,
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

export default async function TestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const test = await fetchQuery(api.queries.getTestBySlug, { slug });
  if (!test) {
    notFound();
  }
  const [preloadedTest, preloadedBreakdown] = await Promise.all([
    preloadQuery(api.queries.getTestBySlug, { slug }),
    preloadQuery(api.queries.getTestBreakdown, { testCaseId: test._id }),
  ]);

  return (
    <TestDetailPage
      preloadedTest={preloadedTest}
      preloadedBreakdown={preloadedBreakdown}
    />
  );
}
