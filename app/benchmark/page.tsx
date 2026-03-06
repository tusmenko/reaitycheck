import { preloadQuery } from "convex/nextjs";
import { BenchmarkPageContent } from "@/components/landing/benchmark-page-content";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Full benchmark",
  description:
    "Complete failure-rate matrix across all challenge suites and models. " +
    "Live benchmarks updated daily.",
};

export default async function BenchmarkPage() {
  const [preloadedTests, preloadedModels] = await Promise.all([
    preloadQuery(api.queries.getActiveTestCases),
    preloadQuery(api.queries.getActiveModels),
  ]);

  return (
    <BenchmarkPageContent
      preloadedTests={preloadedTests}
      preloadedModels={preloadedModels}
    />
  );
}
