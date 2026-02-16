"use client";

import { Badge } from "@/components/ui/badge";
import {
  PROVIDER_STYLES,
  providerDisplayName,
  resilienceBarColor,
} from "@/lib/model-detail-utils";
import { ProviderModelsGrid } from "./components/ProviderModelsGrid";
import { ProviderStatsCards } from "./components/ProviderStatsCards";
import { ProviderToughestBreakersSection } from "./components/ProviderToughestBreakersSection";
import { type ProviderDetailPageProps } from "./ProviderDetailPage.types";
import { useProviderDetailPage } from "./useProviderDetailPage";

export const ProviderDetailPage = ({
  provider,
  preloadedProviderLeaderboard,
  preloadedProviderBreakdown,
}: ProviderDetailPageProps) => {
  const { entries, stats, toughestBreakers } = useProviderDetailPage({
    preloadedProviderLeaderboard,
    preloadedProviderBreakdown,
  });

  const displayName = providerDisplayName(provider);

  return (
    <div className="
      mx-auto max-w-6xl px-4 py-8
      sm:px-6
      lg:px-8
    ">
      <section className="
        mb-10 grid grid-cols-1 gap-6
        md:grid-cols-[1fr_auto] md:gap-8
        lg:gap-8
      ">
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
            {stats.modelCount} model{stats.modelCount !== 1 ? "s" : ""} tracked
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Average resilience
            </span>
            <div className="flex items-center gap-3">
              <div className="
                h-2 max-w-xs min-w-[120px] flex-1 overflow-hidden rounded-full
                bg-red-500/20
              ">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(stats.avgResilience))}%`,
                    backgroundColor: resilienceBarColor(stats.avgResilience),
                  }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(stats.avgResilience)}%
              </span>
            </div>
          </div>
        </div>

        <ProviderStatsCards
          totalTestsSurvived={stats.totalTestsSurvived}
          totalTestsFailed={stats.totalTestsFailed}
        />
      </section>

      <ProviderToughestBreakersSection toughestBreakers={toughestBreakers} />
      <ProviderModelsGrid entries={entries} />
    </div>
  );
};
