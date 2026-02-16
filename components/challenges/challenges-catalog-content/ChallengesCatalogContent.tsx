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
        <div className="
          absolute top-1/4 left-0 h-80 w-80 rounded-full bg-accent-red/10
          blur-3xl
        " />
        <div className="
          absolute right-0 bottom-0 h-80 w-80 rounded-full bg-accent-orange/10
          blur-3xl
        " />
        <section className="relative z-10 mx-auto max-w-2xl py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            No challenges yet
          </h1>
          <p className="mt-2 text-gray-500">
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
      <div className="
        absolute top-1/4 left-0 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl
      " />
      <div className="
        absolute right-0 bottom-0 h-80 w-80 rounded-full bg-accent-orange/10
        blur-3xl
      " />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="
          text-sm font-semibold tracking-wide text-accent-red uppercase
        ">
          Challenges
        </p>
        <h1 className="
          mt-3 font-display text-4xl font-bold text-white
          lg:text-5xl
        ">
          Challenge catalog
        </h1>
        <p className="
          mt-4 max-w-2xl text-base text-gray-400
          lg:text-lg
        ">
          All prompt gauntlets sorted by kill rate. Top breakers first.
        </p>

        <TopBreakersGrid tests={topThree} />

        {rest.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">
              All challenges
            </h2>
            <ul className="space-y-2">
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
