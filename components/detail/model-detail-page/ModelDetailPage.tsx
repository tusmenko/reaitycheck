"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { PROVIDER_STYLES, resilienceBarColor } from "@/lib/model-detail-utils";
import { type ModelDetailPageProps } from "./ModelDetailPage.types";
import { useModelDetailPage } from "./useModelDetailPage";
import { ModelStatsCards } from "./components/ModelStatsCards";
import { ToughestBreakersSection } from "./components/ToughestBreakersSection";
import { BreakerResultsTable } from "./components/BreakerResultsTable";

export const ModelDetailPage = (props: ModelDetailPageProps) => {
  const {
    model,
    breakdown,
    stats,
    toughestBreakers,
    isDescriptionExpanded,
    handleToggleDescription,
  } = useModelDetailPage(props);

  if (!model) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">Model not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start md:gap-8 lg:gap-8">
        <div className="min-w-0">
          <div className="mb-2">
            <Link href={`/providers/${encodeURIComponent(model.provider)}`}>
              <Badge
                variant="outline"
                className={
                  PROVIDER_STYLES[model.provider] ??
                  "bg-muted text-muted-foreground"
                }
              >
                {model.provider}
              </Badge>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            {model.modelName}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Survived {stats.testsSurvived} out of {stats.totalTests} breakers
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Resilience
            </span>
            <div className="flex items-center gap-3">
              <div className="min-w-[120px] flex-1 max-w-xs h-2 rounded-full bg-red-500/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(stats.resilienceRate))}%`,
                    backgroundColor: resilienceBarColor(stats.resilienceRate),
                  }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(stats.resilienceRate)}%
              </span>
            </div>
          </div>

          {model.description && (
            <div
              className="mt-4 group cursor-pointer"
              onClick={handleToggleDescription}
            >
              <div className="relative">
                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isDescriptionExpanded ? "max-h-[1000px]" : "max-h-22"
                  }`}
                >
                  <p className="text-sm text-muted-foreground leading-relaxed pb-2">
                    {model.description}
                  </p>
                </div>
                {!isDescriptionExpanded && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-background via-background/80 to-transparent pointer-events-none" />
                )}
              </div>
              <div className="mt-2 flex justify-center">
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-all duration-300 ${
                    isDescriptionExpanded
                      ? "rotate-180 opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        <ModelStatsCards
          contextWindow={model.contextWindow}
          inputCostPer1MTokens={model.inputCostPer1MTokens}
          outputCostPer1MTokens={model.outputCostPer1MTokens}
          maxCompletionTokens={model.maxCompletionTokens}
        />
      </section>

      <ToughestBreakersSection toughestBreakers={toughestBreakers} />
      <BreakerResultsTable breakdown={breakdown} />
    </div>
  );
};
