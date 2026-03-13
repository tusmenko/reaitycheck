import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TestRunStatusIcon } from "@/components/custom/test-run-status-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  modelDetailHref,
  providerDisplayName,
  failureRateBadgeClass,
} from "@/lib/model-detail-utils";
import type { ComparisonGridSectionProps } from "./ComparisonGridSection.types";
import {
  providerPageHref,
  getResult,
  getProviderFailureRate,
} from "./ComparisonGridSection.utils";
import { useComparisonGridSection } from "./useComparisonGridSection";

export const ComparisonGridSection = ({
  tests,
  models,
  grid,
  granularity = "provider",
  variant = "preview",
}: ComparisonGridSectionProps) => {
  const { tableProviders, tableModels, tableTests } = useComparisonGridSection(
    tests,
    models,
    grid,
    variant
  );

  const tableContent = (
    <TooltipProvider>
    <div className="
      overflow-hidden border-4 border-black bg-card shadow-brutalist
      dark:border-foreground dark:shadow-[8px_8px_0px_#f5f5f0]
    ">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="
              border-b-4 border-black bg-muted
              dark:border-foreground
            ">
              <th className="
                px-8 py-3 text-left text-xs font-bold tracking-wider
                text-foreground uppercase
              ">
                {granularity === "model" ? "Model" : "Provider"}
              </th>
              {tableTests.map((test) => (
                <th
                  key={test._id}
                  className="w-12 px-2 py-3 text-center align-bottom"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/challenges/${test.slug}`}
                        className="
                          rotate-180 text-xs font-bold tracking-wider
                          whitespace-nowrap text-foreground/60 uppercase
                          transition-colors [writing-mode:vertical-rl]
                          hover:text-foreground
                        "
                      >
                        {test.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[260px]">
                      <p className="font-bold text-foreground">{test.name}</p>
                      <p className="
                        mt-0.5 text-xs tracking-wide text-muted-foreground
                        uppercase
                      ">
                        {test.category}
                      </p>
                      {test.prompt && (
                        <p className="
                          mt-1.5 font-mono text-xs/relaxed text-muted-foreground
                        ">
                          {test.prompt.length > 120
                            ? `${test.prompt.slice(0, 120)}…`
                            : test.prompt}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="
            divide-y-2 divide-black/20
            dark:divide-foreground/20
          ">
            {granularity === "model"
              ? tableModels.map((model) => (
                <tr key={model._id} className="
                  transition-colors
                  hover:bg-muted/50
                ">
                  <td className="px-8 py-2 whitespace-nowrap">
                    <Link
                      href={modelDetailHref(
                        model.provider,
                        model.slug,
                        model.apiIdentifier
                      )}
                      className="
                        text-sm font-bold text-foreground transition-colors
                        hover:text-neon-pink
                      "
                    >
                      {model.modelName}
                    </Link>
                  </td>
                  {tableTests.map((test) => {
                    const cell = getResult(grid, test._id, model._id);
                    return (
                      <td key={test._id} className="w-12 p-2 text-center">
                        <span className="
                          inline-flex items-center justify-center
                        ">
                          <TestRunStatusIcon
                            cell={cell}
                            expectedAnswer={test.expectedAnswer}
                          />
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))
              : tableProviders.map((provider) => (
                <tr key={provider} className="
                  transition-colors
                  hover:bg-muted/50
                ">
                  <td className="px-8 py-2 whitespace-nowrap">
                    <Link
                      href={providerPageHref(provider)}
                      className="
                        text-sm font-bold text-foreground transition-colors
                        hover:text-neon-pink
                      "
                    >
                      {providerDisplayName(provider)}
                    </Link>
                  </td>
                  {tableTests.map((test) => {
                    const failureRateRatio = getProviderFailureRate(
                      grid,
                      test._id,
                      provider,
                      models
                    );
                    const failureRate =
                      failureRateRatio != null
                        ? Math.max(0, Math.round(failureRateRatio * 100))
                        : null;
                    return (
                      <td key={test._id} className="w-12 p-2 text-center">
                        {failureRate === null ? (
                          <span className="
                            font-mono text-sm text-muted-foreground
                          ">N/A</span>
                        ) : (
                          <span
                            className={`
                              inline-flex w-14 items-center justify-center
                              border-2 border-black px-3 py-1 font-mono text-sm
                              font-bold
                              dark:border-foreground
                              ${failureRateBadgeClass(failureRate)}
                            `}
                          >
                            {failureRate}%
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="
        border-t-4 border-black bg-muted px-8 py-4 text-center
        dark:border-foreground
      ">
        {variant === "full" ? (
          <Link
            href="/#test-runs"
            className="
              inline-flex items-center text-sm font-bold tracking-wider
              text-neon-pink uppercase transition-colors
              hover:text-neon-orange
            "
          >
            Back to overview
            <ChevronRight className="ml-1 size-4" />
          </Link>
        ) : (
          <Link
            href="/benchmark"
            className="
              inline-flex items-center text-sm font-bold tracking-wider
              text-neon-pink uppercase transition-colors
              hover:text-neon-orange
            "
          >
            Full benchmark
            <ChevronRight className="ml-1 size-4" />
          </Link>
        )}
      </div>
    </div>
    </TooltipProvider>
  );

  return tableContent;
};
