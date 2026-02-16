import Link from "next/link";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { TestRunStatusIcon } from "@/components/custom/test-run-status-icon";
import {
  modelDetailHref,
  providerDisplayName,
  failureRateBadgeClass,
} from "@/lib/model-detail-utils";
import { ChevronRight } from "lucide-react";

function providerPageHref(provider: string) {
  return `/providers/${encodeURIComponent(provider)}`;
}

interface ComparisonGridSectionProps {
  tests: TestCase[];
  models: AIModel[];
  grid: ComparisonCell[];
  /** "provider" = columns are providers (aggregated failure rate). "model" = columns are models (per-model failure rate). */
  granularity?: "provider" | "model";
  /** When "full", show all providers/models and tests and a "Back to overview" footer. When "preview" (default), show first 6 providers or 4 models and 8 tests with "Full benchmark" link. */
  variant?: "preview" | "full";
}

function getResult(
  grid: ComparisonCell[],
  testCaseId: string,
  modelId: string
): ComparisonCell | undefined {
  return grid.find(
    (c) => c.testCaseId === testCaseId && c.modelId === modelId
  );
}

function getProviderFailureRate(
  grid: ComparisonCell[],
  testCaseId: string,
  provider: string,
  models: AIModel[]
): number | null {
  const providerModels = models.filter((m) => m.provider === provider);
  const cells = providerModels
    .map((m) => getResult(grid, testCaseId, m._id))
    .filter((c): c is ComparisonCell => c != null);
  if (cells.length === 0) return null;
  const avgSuccess =
    cells.reduce((sum, c) => sum + c.successRate, 0) / cells.length;
  return 1 - avgSuccess;
}

export function ComparisonGridSection({
  tests,
  models,
  grid,
  granularity = "provider",
  variant = "preview",
}: ComparisonGridSectionProps) {
  const allProviders = Array.from(
    new Set(models.map((m) => m.provider))
  ).sort();
  const tableProviders =
    variant === "full" ? allProviders : allProviders.slice(0, 6);
  const tableModels =
    variant === "full" ? models : models.slice(0, 4);
  const tableTests = variant === "full" ? tests : tests.slice(0, 8);

  const tableContent = (
    <div className="overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-dark-200 bg-dark-50">
                  <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Challenge Suite
                  </th>
                  {granularity === "model"
                    ? tableModels.map((model) => (
                      <th
                        key={model._id}
                        className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400"
                      >
                        <Link
                          href={modelDetailHref(
                            model.provider,
                            model.slug,
                            model.apiIdentifier
                          )}
                          className="transition-colors hover:text-white"
                        >
                          {model.modelName}
                        </Link>
                      </th>
                    ))
                    : tableProviders.map((provider) => (
                      <th
                        key={provider}
                        className="px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-gray-400"
                      >
                        <Link
                          href={providerPageHref(provider)}
                          className="transition-colors hover:text-white"
                        >
                          {providerDisplayName(provider)}
                        </Link>
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {tableTests.map((test) => (
                  <tr key={test._id} className="transition-colors hover:bg-dark-50/50">
                    <td className="px-8 py-6">
                      <Link
                        href={`/challenges/${test.slug}`}
                        className="text-sm font-bold text-white transition-colors hover:text-accent-red"
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
                            <span className="inline-flex items-center justify-center">
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
                                className={`inline-flex w-14 items-center justify-center rounded-full border px-3 py-1 text-sm font-bold ${failureRateBadgeClass(failureRate)}`}
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
                className="inline-flex items-center text-sm font-medium text-accent-red transition-colors hover:text-accent-orange"
              >
                Back to overview
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/benchmark"
                className="inline-flex items-center text-sm font-medium text-accent-red transition-colors hover:text-accent-orange"
              >
                Full benchmark
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
  );

  return tableContent;
}
