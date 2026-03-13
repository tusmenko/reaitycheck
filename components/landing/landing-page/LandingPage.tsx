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
        <section id="test-runs" className="
          border-t-4 border-black bg-muted py-20
          dark:border-foreground
        ">
          <div className="
            mx-auto w-full max-w-[1440px] px-6
            lg:px-12
          ">
            <div className="mb-16 text-center">
              <span className="
                inline-block -rotate-1 border-4 border-black bg-neon-blue px-3
                py-1 text-xs font-bold tracking-wide text-white uppercase
                shadow-[3px_3px_0px_#000]
                dark:border-foreground
              ">
                Benchmark
              </span>
              <h2 className="
                mt-4 font-display text-3xl font-bold text-foreground uppercase
                lg:text-4xl
              ">
                Providers Performance
              </h2>
              <p className="
                mx-auto mt-4 max-w-2xl font-mono text-muted-foreground
              ">
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
