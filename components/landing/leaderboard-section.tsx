import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LeaderboardEntry, Provider } from "@/lib/types";
import { Bot, Brain, Zap } from "lucide-react";

function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s =
    slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/model/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

function modelInitials(modelName: string): string {
  const words = modelName.split(/\s+/);
  if (words.length >= 2)
    return (words[0][0] ?? "") + (words[1].replace(/\D/g, "")[0] ?? words[1][0] ?? "");
  return modelName.slice(0, 2).toUpperCase();
}

const PROVIDER_AVATAR_GRADIENT: Partial<Record<Provider, string>> = {
  openai: "from-purple-500 to-indigo-600",
  anthropic: "from-gray-700 to-gray-900",
  google: "from-blue-500 to-indigo-600",
  meta: "from-purple-500 to-indigo-600",
  mistral: "from-orange-400 to-red-500",
};

const RankIcons = [Bot, Brain, Zap];

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardSection({ leaderboard }: LeaderboardSectionProps) {
  return (
    <section id="models" className="relative bg-dark-50 py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-display mb-3 text-3xl font-bold text-white">
              Top Survivors
            </h2>
            <p className="text-dark-500">
              Models ranked by their ability to overcome our challenges.
            </p>
          </div>
          <Link
            href="#test-runs"
            className="hidden items-center font-medium text-accent-red transition-colors hover:text-accent-orange sm:flex group"
          >
            View all models
            <span className="ml-2 transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {leaderboard.map((entry, index) => {
            const Icon = RankIcons[index % RankIcons.length];
            const failureRate = Math.round((1 - entry.successRate) * 1000) / 10;
            const survivedRate = Math.round(entry.successRate * 1000) / 10;
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
                <Card className="hover-lift relative h-full overflow-hidden rounded-3xl border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover [&_[data-slot=card-header]]:px-0 [&_[data-slot=card-content]]:px-0">
                  <div className="absolute right-0 top-0 p-4 opacity-5 transition-opacity group-hover:opacity-10">
                    <Icon className="h-36 w-36" />
                  </div>
                  <CardHeader className="pb-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold text-white shadow-lg ${PROVIDER_AVATAR_GRADIENT[entry.model.provider] ?? "from-dark-200 to-dark-300"}`}
                        >
                          {modelInitials(entry.model.modelName)}
                        </div>
                        <div>
                          <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-accent-red">
                            {entry.model.modelName}
                          </CardTitle>
                          <p className="text-sm text-dark-500 capitalize">
                            {entry.model.provider}
                          </p>
                        </div>
                      </div>
                      <span
                        className={
                          entry.rank === 1
                            ? "inline-flex items-center rounded-full border border-green-800 bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-400"
                            : "inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-dark-600"
                        }
                      >
                        {entry.rank === 1 && "🏆 "}
                        #{entry.rank}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase text-dark-500">
                          Failure Rate
                        </div>
                        <div className="text-2xl font-bold text-accent-red">
                          {failureRate}%
                        </div>
                      </div>
                      <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                        <div className="mb-2 text-xs font-semibold uppercase text-dark-500">
                          Survived
                        </div>
                        <div className="text-2xl font-bold text-brand-500">
                          {survivedRate}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
