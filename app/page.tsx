import {
  TEST_CASES,
  AI_MODELS,
  LEADERBOARD,
  COMPARISON_GRID,
  LAST_UPDATED,
} from "@/lib/mock-data";
import { HeroSection } from "@/components/landing/hero-section";
import { LeaderboardSection } from "@/components/landing/leaderboard-section";
import { ComparisonGridSection } from "@/components/landing/comparison-grid-section";
import { TestsSection } from "@/components/landing/tests-section";
import { MethodologySection } from "@/components/landing/methodology-section";
import { FooterSection } from "@/components/landing/footer-section";

export default function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <HeroSection
        modelCount={AI_MODELS.length}
        testCount={TEST_CASES.length}
        lastUpdated={LAST_UPDATED}
      />
      <LeaderboardSection leaderboard={LEADERBOARD} />
      <ComparisonGridSection
        tests={TEST_CASES}
        models={AI_MODELS}
        grid={COMPARISON_GRID}
      />
      <TestsSection tests={TEST_CASES} />
      <MethodologySection lastUpdated={LAST_UPDATED} />
      <FooterSection />
    </div>
  );
}
