import Link from "next/link";
import { MemenessStars } from "@/components/custom/memeness-stars";
import { ArrowRight } from "lucide-react";
import { formatCategory } from "@/lib/model-detail-utils";
import type { TestsSectionProps } from "./TestsSection.types";
import { useTestsSection } from "./useTestsSection";

export const TestsSection = ({ tests }: TestsSectionProps) => {
  const { featuredChallenges, getKillRateDisplay } = useTestsSection(tests);

  return (
    <section
      id="challenges"
      className="relative bg-dark-50/50 py-20"
    >
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-accent-red/10 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-accent-orange/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            The Gauntlet
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-white lg:text-4xl">
            Deadly Challenges
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Prompt suites engineered to expose common model failure modes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredChallenges.map((test) => {
            const { killRate, hasRealKillRate } = getKillRateDisplay(test);

            return (
              <Link
                key={test._id}
                href={`/challenges/${test.slug}`}
                className="group rounded-2xl border border-dark-200 bg-dark-100 p-6 shadow-sm transition-all hover:border-accent-red/50 hover:shadow-glow"
              >

                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-accent-red">
                  {test.name}
                </h3>

                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-lg border border-dark-300 bg-dark-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {formatCategory(test.category)}
                  </div>
                </div>

                <p className="mb-6 line-clamp-2 text-sm text-gray-500">
                  {test.explanation || test.prompt}
                </p>

                <div className="flex items-center justify-between border-t border-dark-200 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-gray-500">
                      Kill Rate
                    </span>
                    <span className="text-sm font-bold text-accent-red">
                      {hasRealKillRate ? `${killRate}%` : "—"}
                    </span>
                  </div>
                  <MemenessStars score={test.memenessScore} />
                </div>
              </Link>
            );
          })}

          <Link
            href="/challenges"
            className="group flex flex-col items-center justify-center rounded-2xl border border-dark-200 bg-dark-100 p-6 text-center transition-all hover:border-accent-red/50 hover:shadow-glow"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dark-200 bg-dark-50 transition-transform group-hover:scale-110">
              <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-accent-red" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">View All Challenges</h3>
            <p className="text-sm text-gray-500">
              Browse the complete test catalog
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};
