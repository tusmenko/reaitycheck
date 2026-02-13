import Link from "next/link";
import type { TestCase, Difficulty } from "@/lib/types";
import {
  Skull,
  Calculator,
  Theater,
  Code,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";

const DIFFICULTY_MAP: Record<
  Difficulty,
  { label: string; iconBg: string; iconColor: string; badge: string }
> = {
  easy: {
    label: "Medium",
    iconBg: "bg-yellow-900/30 border-yellow-800",
    iconColor: "text-yellow-400",
    badge: "bg-yellow-900/30 text-yellow-400 border border-yellow-800",
  },
  medium: {
    label: "Hard",
    iconBg: "bg-orange-900/30 border-orange-800",
    iconColor: "text-orange-400",
    badge: "bg-orange-900/30 text-orange-400 border border-orange-800",
  },
  hard: {
    label: "Extreme",
    iconBg: "bg-red-900/30 border-red-800",
    iconColor: "text-red-400",
    badge: "bg-red-900/30 text-red-400 border border-red-800",
  },
};

const CATEGORY_ICONS = [
  Skull,
  Calculator,
  Theater,
  Code,
  ImageIcon,
];

function getIcon(category: string) {
  const idx = category.length % CATEGORY_ICONS.length;
  return CATEGORY_ICONS[idx] ?? Skull;
}

interface TestsSectionProps {
  tests: TestCase[];
  killRateByTestId: Record<string, number>;
}

export function TestsSection({
  tests,
  killRateByTestId,
}: TestsSectionProps) {
  return (
    <section
      id="challenges"
      className="relative overflow-hidden bg-dark-50/50 py-20"
    >
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-accent-red/10 opacity-30 blur-3xl mix-blend-lighten" />
      <div className="absolute bottom-1/4 left-0 h-96 w-96 rounded-full bg-accent-orange/10 opacity-30 blur-3xl mix-blend-lighten" />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-16 text-center">
          <span className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            The Gauntlet
          </span>
          <h2 className="font-display mt-2 mb-4 text-3xl font-bold text-white lg:text-4xl">
            Deadly Challenges
          </h2>
          <p className="mx-auto max-w-2xl text-dark-500">
            We design prompts that specifically target known weaknesses in LLMs,
            from logical fallacies to cultural nuance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tests.map((test) => {
            const config = DIFFICULTY_MAP[test.difficulty];
            const Icon = getIcon(test.category);
            const killRate = killRateByTestId[test._id] ?? 0;
            return (
              <Link
                key={test._id}
                href={`/test/${test.slug}`}
                className="group rounded-2xl border border-dark-200 bg-dark-100 p-6 shadow-sm transition-all hover:border-accent-red/50 hover:shadow-glow"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border ${config.iconBg} ${config.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-md border px-2.5 py-1 text-xs font-semibold ${config.badge}`}
                  >
                    {config.label}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-bold text-white transition-colors group-hover:text-accent-red">
                  {test.name}
                </h3>
                <p className="mb-6 line-clamp-2 text-sm text-dark-500">
                  {test.explanation}
                </p>
                <div className="flex items-center justify-between border-t border-dark-200 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-dark-500">
                      Kill Rate
                    </span>
                    <span className="text-sm font-bold text-accent-red">
                      {killRate}%
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
          <Link
            href="#challenges"
            className="group flex flex-col items-center justify-center rounded-2xl border border-dark-200 bg-dark-100 p-6 text-center shadow-sm transition-all hover:border-accent-red/50"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-dark-200 transition-transform group-hover:scale-110 group-hover:border-dark-50">
              <ArrowRight className="h-6 w-6 text-dark-500 transition-colors group-hover:text-accent-red" />
            </div>
            <h3 className="mb-1 text-lg font-bold text-white">
              View All Challenges
            </h3>
            <p className="text-sm text-dark-500">
              Browse {tests.length}+ more tests
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}
