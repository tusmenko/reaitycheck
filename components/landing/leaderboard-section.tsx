import Link from "next/link";
import type { LeaderboardEntry } from "@/lib/types";
import {
  Trophy,
  ArrowRight,
  Bot,
  BrainCircuit,
  Zap,
  LucideIcon,
} from "lucide-react";

function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s =
    slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/models/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
}

const TOP_RANK_ICONS: Record<number, LucideIcon> = {
  1: Bot,
  2: BrainCircuit,
  3: Zap,
};

function avatarGradientByRank(rank: number) {
  if (rank === 1) return "from-orange-400 to-red-500";
  if (rank === 2) return "from-purple-500 to-indigo-600";
  if (rank === 3) return "from-gray-600 to-gray-800";
  return "from-dark-300 to-dark-500";
}

export function LeaderboardSection({ leaderboard }: LeaderboardSectionProps) {
  const topModels = leaderboard.slice(0, 6);

  return (
    <section id="models" className="relative bg-dark-50 py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-white">
              Top Survivors
            </h2>
            <p className="mt-3 text-gray-400">
              Models ranked by how often they survive our challenge sets.
            </p>
          </div>
          <Link
            href="/benchmark"
            className="group hidden items-center font-medium text-accent-red transition-colors hover:text-accent-orange sm:flex"
          >
            View benchmark table
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {topModels.map((entry) => {
            const success = Math.round(entry.successRate * 100);
            const failure = Math.max(0, 100 - success);
            const initials = entry.model.modelName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");
            const RankIcon = TOP_RANK_ICONS[entry.rank] ?? Trophy;
            const avatarGradient = avatarGradientByRank(entry.rank);

            return (
              <Link
                key={entry.model._id}
                href={modelDetailHref(
                  entry.model.provider,
                  entry.model.slug,
                  entry.model.apiIdentifier
                )}
                className="group block h-full"
              >
                <article className="relative h-full overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover">
                  <div className="absolute right-6 top-6 opacity-5 transition-opacity group-hover:opacity-10">
                    <RankIcon className="h-24 w-24 text-white" />
                  </div>

                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 min-h-14 w-14 min-w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-sm font-bold text-white shadow-lg ${avatarGradient}`}
                      >
                        {initials}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-accent-red">
                          {entry.model.modelName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.model.provider}
                        </p>
                      </div>
                    </div>

                    {entry.rank === 1 ? (
                      <span className="inline-flex items-center rounded-full border border-green-800 bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-400">
                        <Trophy className="mr-1.5 h-3 w-3 text-yellow-500" />
                        #{entry.rank}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                        #{entry.rank}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Failure Rate
                      </div>
                      <div className="text-2xl font-bold text-accent-red">
                        {failure}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Survived
                      </div>
                      <div className="text-2xl font-bold text-brand-500">
                        {success}%
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
