import { preloadQuery } from "convex/nextjs";
import { ChallengesCatalogContent } from "@/components/challenges/challenges-catalog-content";
import { api } from "@/convex/_generated/api";

export const metadata = {
  title: "Challenges",
  description:
    "Browse all prompt gauntlets sorted by kill rate. See which challenges " +
    "break the most models and explore category and memeness.",
};

export default async function ChallengesPage() {
  const preloadedTests = await preloadQuery(
    api.queries.getActiveTestCasesWithKillRates
  );

  return <ChallengesCatalogContent preloadedTests={preloadedTests} />;
}
