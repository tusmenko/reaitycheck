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
import { Skull, Target, Swords, Award, ChevronLeft } from "lucide-react";

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
  const { entries, providerAvgResponseTimeMs } = usePreloadedQuery(
    preloadedProviderLeaderboard
  );
  const breakdown = usePreloadedQuery(preloadedProviderBreakdown);

  const modelCount = entries.length;
  const avgResilience =
    modelCount > 0
      ? (entries.reduce((sum, e) => sum + e.successRate, 0) / modelCount) * 100
      : 0;
  const avgTestsSurvived =
    modelCount > 0
      ? Math.round(
        entries.reduce((sum, e) => sum + e.successfulRuns, 0) / modelCount
      )
      : 0;
  const avgTestsFailed =
    modelCount > 0
      ? Math.round(
        entries.reduce(
          (sum, e) => sum + (e.totalRuns - e.successfulRuns),
          0
        ) / modelCount
      )
      : 0;

  const toughestBreakers = breakdown.slice(0, 3);

  const displayName = providerDisplayName(provider);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/providers"
          className="inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <ChevronLeft className="mr-1 size-4" />
          Back to providers
        </Link>
      </div>

      <div className="mb-8">
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
          {modelCount} model{modelCount !== 1 ? "s" : ""} tracked,{" "}
          {Math.round(avgResilience)}% average resilience
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(avgResilience)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Tests Survived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgTestsSurvived}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Tests Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgTestsFailed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {providerAvgResponseTimeMs} ms
            </p>
          </CardContent>
        </Card>
      </div>

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
