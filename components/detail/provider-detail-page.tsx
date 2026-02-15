"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  modelDetailHref,
  PROVIDER_STYLES,
  passRateColorClass,
  formatCategory,
  providerDisplayName,
} from "@/lib/model-detail-utils";
import { Skull, Target, Swords, Award } from "lucide-react";

const TOUGHEST_BREAKER_RANKS = [
  { Icon: Skull, iconColor: "text-red-400" },
  { Icon: Target, iconColor: "text-orange-400" },
  { Icon: Swords, iconColor: "text-slate-400" },
] as const;

function avatarGradientByRank(rank: number) {
  if (rank === 1) return "from-orange-400 to-red-500";
  if (rank === 2) return "from-purple-500 to-indigo-600";
  if (rank === 3) return "from-gray-600 to-gray-800";
  return "from-dark-300 to-dark-500";
}

function rankIconColorByRank(rank: number) {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-300";
  if (rank === 3) return "text-amber-600";
  return "text-white";
}

interface ProviderDetailPageProps {
  provider: string;
  preloadedProviderLeaderboard: Preloaded<
    typeof api.queries.getProviderLeaderboard
  >;
  preloadedProviderBreakdown: Preloaded<
    typeof api.queries.getProviderBreakdown
  >;
}

export function ProviderDetailPage({
  provider,
  preloadedProviderLeaderboard,
  preloadedProviderBreakdown,
}: ProviderDetailPageProps) {
  const { entries } = usePreloadedQuery(
    preloadedProviderLeaderboard
  );
  const breakdown = usePreloadedQuery(preloadedProviderBreakdown);

  const modelCount = entries.length;
  const avgResilience =
    modelCount > 0
      ? (entries.reduce((sum, e) => sum + e.successRate, 0) / modelCount) * 100
      : 0;
  const totalTestsSurvived = entries.reduce(
    (sum, e) => sum + e.successfulRuns,
    0
  );
  const totalTestsFailed = entries.reduce(
    (sum, e) => sum + (e.totalRuns - e.successfulRuns),
    0
  );

  const toughestBreakers = breakdown.slice(0, 3);

  const displayName = providerDisplayName(provider);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:gap-8 lg:gap-8">
        {/* Left column: provider description */}
        <div className="min-w-0">
          <div className="mb-2">
            <Badge
              variant="outline"
              className={
                PROVIDER_STYLES[provider] ?? "bg-muted text-muted-foreground"
              }
            >
              {provider}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{displayName}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            {modelCount} model{modelCount !== 1 ? "s" : ""} tracked
          </p>
          {/* Average resilience bar */}
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Average resilience
            </span>
            <div className="flex items-center gap-3">
              <div className="min-w-[120px] flex-1 max-w-xs h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${Math.min(100, Math.round(avgResilience))}%` }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(avgResilience)}%
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Tests Survived / Tests Failed counts */}
        <div className="grid grid-cols-2 items-start gap-2 md:max-w-sm md:gap-4 md:w-80">
          <Card className="py-2">
            <CardHeader className="pb-0 px-3 pt-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Tests Survived
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <p className="text-base font-bold">{totalTestsSurvived}</p>
            </CardContent>
          </Card>
          <Card className="py-2">
            <CardHeader className="pb-0 px-3 pt-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                Tests Failed
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-2">
              <p className="text-base font-bold">{totalTestsFailed}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {toughestBreakers.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Toughest Breakers</h2>
          <div
            className={`grid gap-8 ${toughestBreakers.length === 1
              ? "grid-cols-1"
              : toughestBreakers.length === 2
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              }`}
          >
            {toughestBreakers.map((entry, index) => {
              const rank = index + 1;
              const { Icon, iconColor } = TOUGHEST_BREAKER_RANKS[index];
              const passRatePct = Math.round(entry.providerPassRate * 100);
              return (
                <Link
                  key={entry.test._id}
                  href={`/challenges/${entry.test.slug}`}
                  className="group block h-full"
                >
                  <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover">
                    <div
                      className={`absolute right-6 top-6 opacity-5 transition-opacity group-hover:opacity-10 ${iconColor}`}
                    >
                      <Icon className="h-24 w-24" />
                    </div>

                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-accent-red">
                          {entry.test.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatCategory(entry.test.category)}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                        #{rank}
                      </span>
                    </div>

                    <div className="mt-auto rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Pass rate (provider)
                      </div>
                      <div
                        className={`text-2xl font-bold ${passRateColorClass(passRatePct)}`}
                      >
                        {passRatePct}%
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Models</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const success = Math.round(entry.successRate * 100);
            const failure = Math.max(0, 100 - success);
            const initials = entry.model.modelName
              .split(" ")
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("");
            const avatarGradient = avatarGradientByRank(entry.rank);
            const rankIconColor = rankIconColorByRank(entry.rank);

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
                <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover">
                  <div className="absolute right-6 top-6 opacity-5 transition-opacity group-hover:opacity-10">
                    <Award className={`h-24 w-24 ${rankIconColor}`} />
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

                    <span className="inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                      #{entry.rank}
                    </span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Survived
                      </div>
                      <div className="text-2xl font-bold text-brand-500">
                        {success}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Failure Rate
                      </div>
                      <div className="text-2xl font-bold text-accent-red">
                        {failure}%
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
