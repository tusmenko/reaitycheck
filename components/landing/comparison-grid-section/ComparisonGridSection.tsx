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
    variant
  );

  const tableContent = (
    <TooltipProvider>
    <div className="
      overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 shadow-soft
    ">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-dark-200 bg-dark-50">
              <th className="
                px-8 py-3 text-left text-xs font-semibold tracking-wider
                text-gray-400 uppercase
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
                          rotate-180 text-xs font-semibold tracking-wider
                          whitespace-nowrap text-gray-400 uppercase
                          transition-colors [writing-mode:vertical-rl]
                          hover:text-white
                        "
                      >
                        {test.name}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[260px]">
                      <p className="font-semibold text-white">{test.name}</p>
                      <p className="
                        mt-0.5 text-xs tracking-wide text-gray-400 uppercase
                      ">
                        {test.category}
                      </p>
                      {test.prompt && (
                        <p className="mt-1.5 text-xs/relaxed text-gray-300">
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
          <tbody className="divide-y divide-dark-200">
            {granularity === "model"
              ? tableModels.map((model) => (
                <tr key={model._id} className="
                  transition-colors
                  hover:bg-dark-50/50
                ">
                  <td className="px-8 py-2 whitespace-nowrap">
                    <Link
                      href={modelDetailHref(
                        model.provider,
                        model.slug,
                        model.apiIdentifier
                      )}
                      className="
                        text-sm font-bold text-white transition-colors
                        hover:text-accent-red
                      "
                    >
                      {model.modelName}
                    </Link>
                  </td>
                  {tableTests.map((test) => {
                    const cell = getResult(grid, test._id, model._id);
                    return (
                      <td key={test._id} className="w-12 px-2 py-2 text-center">
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
                  hover:bg-dark-50/50
                ">
                  <td className="px-8 py-2">
                    <Link
                      href={providerPageHref(provider)}
                      className="
                        text-sm font-bold text-white transition-colors
                        hover:text-accent-red
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
                      <td key={test._id} className="w-12 px-2 py-2 text-center">
                        {failureRate === null ? (
                          <span className="text-sm text-gray-500">N/A</span>
                        ) : (
                          <span
                            className={`
                              inline-flex w-14 items-center justify-center
                              rounded-full border px-3 py-1 text-sm font-bold
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
      <div className="border-t border-dark-200 bg-dark-50 px-8 py-4 text-center">
        {variant === "full" ? (
          <Link
            href="/#test-runs"
            className="
              inline-flex items-center text-sm font-medium text-accent-red
              transition-colors
              hover:text-accent-orange
            "
          >
            Back to overview
            <ChevronRight className="ml-1 size-4" />
          </Link>
        ) : (
          <Link
            href="/benchmark"
            className="
              inline-flex items-center text-sm font-medium text-accent-red
              transition-colors
              hover:text-accent-orange
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
