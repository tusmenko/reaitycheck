import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { TestRunStatusIcon } from "@/components/custom/test-run-status-icon";
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
    <div className="
      overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 shadow-soft
    ">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]">
          <thead>
            <tr className="border-b border-dark-200 bg-dark-50">
              <th className="
                px-8 py-5 text-left text-xs font-semibold tracking-wider
                text-gray-400 uppercase
              ">
                Challenge Suite
              </th>
              {granularity === "model"
                ? tableModels.map((model) => (
                  <th
                    key={model._id}
                    className="
                      px-6 py-5 text-center text-xs font-semibold tracking-wider
                      text-gray-400 uppercase
                    "
                  >
                    <Link
                      href={modelDetailHref(
                        model.provider,
                        model.slug,
                        model.apiIdentifier
                      )}
                      className="
                        transition-colors
                        hover:text-white
                      "
                    >
                      {model.modelName}
                    </Link>
                  </th>
                ))
                : tableProviders.map((provider) => (
                  <th
                    key={provider}
                    className="
                      px-6 py-5 text-center text-xs font-semibold tracking-wider
                      text-gray-400 uppercase
                    "
                  >
                    <Link
                      href={providerPageHref(provider)}
                      className="
                        transition-colors
                        hover:text-white
                      "
                    >
                      {providerDisplayName(provider)}
                    </Link>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-200">
            {tableTests.map((test) => (
              <tr key={test._id} className="
                transition-colors
                hover:bg-dark-50/50
              ">
                <td className="px-8 py-6">
                  <Link
                    href={`/challenges/${test.slug}`}
                    className="
                      text-sm font-bold text-white transition-colors
                      hover:text-accent-red
                    "
                  >
                    {test.name}
                  </Link>
                  <div className="mt-0.5 text-xs text-gray-500">
                    {test.category.replaceAll("_", " ")}
                  </div>
                </td>
                {granularity === "model"
                  ? tableModels.map((model) => {
                    const cell = getResult(grid, test._id, model._id);
                    return (
                      <td key={model._id} className="px-6 py-6 text-center">
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
                  })
                  : tableProviders.map((provider) => {
                    const failureRateRatio = getProviderFailureRate(
                      grid,
                      test._id,
                      provider,
                      models
                    );
                    const failureRate =
                      failureRateRatio != null
                        ? Math.max(
                          0,
                          Math.round(failureRateRatio * 100)
                        )
                        : null;
                    return (
                      <td key={provider} className="px-6 py-6 text-center">
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
            <ChevronRight className="ml-1 h-4 w-4" />
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
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );

  return tableContent;
};
