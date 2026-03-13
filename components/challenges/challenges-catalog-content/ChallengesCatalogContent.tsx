"use client";

import type { ChallengesCatalogContentProps } from "./ChallengesCatalogContent.types";
import { ChallengeListItem } from "./components/ChallengeListItem";
import { TopBreakersGrid } from "./components/TopBreakersGrid";
import { useChallengesCatalogContent } from "./useChallengesCatalogContent";

export const ChallengesCatalogContent = ({
  preloadedTests,
}: ChallengesCatalogContentProps) => {
  const { testCases, topThree, rest } = useChallengesCatalogContent(preloadedTests);

  if (testCases.length === 0) {
    return (
      <main className="
        relative h-full bg-background px-6 pt-8 pb-16
        lg:px-12
      ">
        <section className="relative z-10 mx-auto max-w-2xl py-16 text-center">
          <h1 className="
            font-display text-2xl font-bold text-foreground uppercase
          ">
            No challenges yet
          </h1>
          <p className="mt-2 font-mono text-muted-foreground">
            Challenge catalog will appear here once tests are added.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="
      relative h-full bg-background px-6 pt-8 pb-16
      lg:px-12
    ">
      <div className="relative z-10 mx-auto max-w-6xl">
        <span className="
          inline-block -rotate-1 border-4 border-black bg-neon-orange px-3 py-1
          text-xs font-bold tracking-wide text-white uppercase
          shadow-[3px_3px_0px_#000]
          dark:border-foreground
        ">
          Challenges
        </span>
        <h1 className="
          mt-4 font-display text-4xl font-bold text-foreground uppercase
          lg:text-5xl
        ">
          Challenge catalog
        </h1>
        <p className="
          mt-4 max-w-2xl font-mono text-base text-muted-foreground
          lg:text-lg
        ">
          All prompt gauntlets sorted by kill rate. Top breakers first.
        </p>

        <TopBreakersGrid tests={topThree} />

        {rest.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-foreground uppercase">
              All challenges
            </h2>
            <ul className="space-y-3">
              {rest.map((test, index) => (
                <ChallengeListItem
                  key={test._id}
                  test={test}
                  rank={4 + index}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
};
