import { fetchQuery, preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { notFound } from "next/navigation";
import { TestDetailPage } from "@/components/detail/test-detail-page";

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
