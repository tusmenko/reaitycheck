"use client";

import { ComparisonGridSection } from "../comparison-grid-section";
import { HeroSection } from "../hero-section";
import { LeaderboardSection } from "../leaderboard-section";
import { SubmitChallengeCta } from "../submit-challenge-cta";
import { TestsSection } from "../tests-section";
import type { LandingPageProps } from "./LandingPage.types";
import { useLandingPage } from "./useLandingPage";

export const LandingPage = (props: LandingPageProps) => {
  const {
    testCases,
    aiModels,
    leaderboardEntries,
    comparisonGrid,
    lastUpdated,
    nowMs,
    providerCount,
  } = useLandingPage(props);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <HeroSection
        modelCount={aiModels.length}
        testCount={testCases.length}
        providerCount={providerCount}
        lastUpdated={lastUpdated}
        nowMs={nowMs}
      />

      <main className="relative z-10">
        <LeaderboardSection leaderboard={leaderboardEntries} />
        <TestsSection tests={testCases} />
        <section id="test-runs" className="bg-background py-20">
          <div className="
            mx-auto w-full max-w-[1440px] px-6
            lg:px-12
          ">
            <div className="mb-16 text-center">
              <p className="
                text-sm font-semibold tracking-wide text-accent-red uppercase
              ">
                Benchmark
              </p>
              <h2 className="
                mt-2 font-display text-3xl font-bold text-white
                lg:text-4xl
              ">
                Providers Performance
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-gray-400">
                Failure-rate snapshot by provider (averaged across their
                models).
              </p>
            </div>
            <ComparisonGridSection
              tests={testCases}
              models={aiModels}
              grid={comparisonGrid}
            />
            <SubmitChallengeCta />
          </div>
        </section>
      </main>
    </div>
  );
};
