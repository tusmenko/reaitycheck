import Link from "next/link";
import type { TestCase } from "@/lib/types";
import { ArrowRight } from "lucide-react";

const DIFFICULTY_STYLES: Record<TestCase["difficulty"], string> = {
  easy: "border-green-800 bg-green-900/30 text-green-400",
  medium: "border-yellow-800 bg-yellow-900/30 text-yellow-400",
  hard: "border-red-800 bg-red-900/30 text-red-400",
};

function formatCategory(category: string) {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

interface TestsSectionProps {
  tests: TestCase[];
}

export function TestsSection({ tests }: TestsSectionProps) {
  const featuredChallenges = tests.slice(0, 5);

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
            // Use actual kill rate from runs when available; null = no runs; fallback to memeness-based for legacy
            const killRate =
              test.killRate != null
                ? test.killRate
                : Math.min(95, Math.max(5, test.memenessScore * 10));
            const hasRealKillRate = test.killRate != null;
            return (
              <Link
                key={test._id}
                href={`/challenges/${test.slug}`}
                className="group rounded-2xl border border-dark-200 bg-dark-100 p-6 shadow-sm transition-all hover:border-accent-red/50 hover:shadow-glow"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="rounded-lg border border-dark-300 bg-dark-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {formatCategory(test.category)}
                  </div>
                  <span
                    className={`rounded-md border px-2.5 py-1 text-xs font-semibold capitalize ${DIFFICULTY_STYLES[test.difficulty]}`}
                  >
                    {test.difficulty}
                  </span>
                </div>

                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-accent-red">
                  {test.name}
                </h3>
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
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Meme {test.memenessScore}/10
                  </span>
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
}
