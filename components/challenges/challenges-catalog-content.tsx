"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import type { TestCase } from "@/lib/types";
import {
  formatCategory,
  killRateColorClass,
} from "@/lib/model-detail-utils";
import { MemenessStars } from "@/components/custom/memeness-stars";
import { Skull, Target, Swords, ChevronRight } from "lucide-react";

const TOUGHEST_BREAKER_RANKS = [
  { Icon: Skull, iconColor: "text-red-400" },
  { Icon: Target, iconColor: "text-orange-400" },
  { Icon: Swords, iconColor: "text-slate-400" },
] as const;

interface ChallengesCatalogContentProps {
  preloadedTests: Preloaded<
    typeof api.queries.getActiveTestCasesWithKillRates
  >;
}

export function ChallengesCatalogContent({
  preloadedTests,
}: ChallengesCatalogContentProps) {
  const tests = usePreloadedQuery(preloadedTests);
  const testCases: TestCase[] = tests.map((t) => ({
    ...t,
    _id: t._id,
    explanation: t.explanation ?? "",
  }));

  const topThree = testCases.slice(0, 3);
  const rest = testCases.slice(3);

  if (testCases.length === 0) {
    return (
      <main className="relative h-full bg-background px-6 pb-16 pt-8 lg:px-12">
        <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />
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
    <main className="relative h-full bg-background px-6 pb-16 pt-8 lg:px-12">
      <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
          Challenges
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
          Challenge catalog
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-400 lg:text-lg">
          All prompt gauntlets sorted by kill rate. Top breakers first.
        </p>

        {topThree.length > 0 && (
          <section className="mt-10 mb-12">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Top breakers
            </h2>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {topThree.map((test, index) => {
                const rank = index + 1;
                const { Icon, iconColor } = TOUGHEST_BREAKER_RANKS[index];
                const killRate = test.killRate ?? null;
                const killRateLabel =
                  killRate != null ? `${killRate}%` : "—";
                const killRateClass =
                  killRate != null ? killRateColorClass(killRate) : "text-gray-500";
                return (
                  <Link
                    key={test._id}
                    href={`/challenges/${test.slug}`}
                    className="group block h-full"
                  >
                    <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover">
                      <div
                        className={`absolute right-6 top-6 opacity-5 transition-opacity group-hover:opacity-10 ${iconColor}`}
                      >
                        <Icon className="h-24 w-24" />
                      </div>

                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h3 className="text-xl font-bold text-white transition-colors group-hover:text-accent-red">
                            {test.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatCategory(test.category)}
                          </p>
                        </div>
                        <span className="shrink-0 inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                          #{rank}
                        </span>
                      </div>

                      <p className="mb-6 line-clamp-2 text-sm text-gray-500">
                        {test.explanation || test.prompt}
                      </p>

                      <div className="mt-auto rounded-xl border border-dark-200 bg-dark-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                          Kill rate
                        </div>
                        <div className={`text-2xl font-bold ${killRateClass}`}>
                          {killRateLabel}
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {rest.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">
              All challenges
            </h2>
            <ul className="space-y-2">
              {rest.map((test, index) => {
                const rank = 4 + index;
                const killRate = test.killRate ?? null;
                const killRateLabel =
                  killRate != null ? `${killRate}%` : "—";
                const killRateClass =
                  killRate != null ? killRateColorClass(killRate) : "text-gray-500";
                const killRateCard = (
                  <div className="rounded-xl border border-dark-200 bg-dark-50 px-3 py-2 shrink-0">
                    <div className="text-[10px] font-semibold uppercase text-gray-500">
                      Kill rate
                    </div>
                    <div className={`text-lg font-bold ${killRateClass}`}>
                      {killRateLabel}
                    </div>
                  </div>
                );

                return (
                  <li key={test._id}>
                    <Link
                      href={`/challenges/${test.slug}`}
                      className="flex flex-row items-stretch gap-3 rounded-xl border border-dark-200 bg-dark-100/80 px-6 py-4 text-white shadow-sm transition-all hover:border-accent-red/30 hover:bg-dark-100 sm:gap-4"
                    >
                      {/* Column 1 (max width): row1 = position + title, row2 = category + memeness (desktop) or [category+meme | kill rate] (mobile) */}
                      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                        <div className="flex min-w-0 flex-nowrap items-center gap-2">
                          <span className="shrink-0 inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                            #{rank}
                          </span>
                          <span className="truncate font-semibold">
                            {test.name}
                          </span>
                        </div>
                        {/* Row 2: mobile = two columns (category+meme in column | kill rate); desktop = category + meme in row */}
                        <div className="flex flex-nowrap items-center justify-between gap-2 sm:justify-start">
                          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2">
                            <span className="rounded border border-dark-300 bg-dark-200/80 px-2 py-0.5 text-xs text-gray-400 shrink-0 w-fit">
                              {formatCategory(test.category)}
                            </span>
                            <MemenessStars score={test.memenessScore} />
                          </div>
                          <div className="shrink-0 sm:hidden">
                            {killRateCard}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: kill rate — desktop only (middle column) */}
                      <div className="hidden shrink-0 items-center sm:flex">
                        {killRateCard}
                      </div>

                      {/* Column 3: arrow — full height, dedicated column */}
                      <div className="flex shrink-0 items-center pl-3 sm:pl-4">
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
