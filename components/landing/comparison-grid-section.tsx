import Link from "next/link";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { TestRunStatusIcon } from "@/components/custom/test-run-status-icon";
import {
  modelDetailHref,
  providerDisplayName,
  failureRateBadgeClass,
} from "@/lib/model-detail-utils";
import { ChevronRight, Skull } from "lucide-react";

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

  return (
    <section
      id="test-runs"
      className={
        variant === "full"
          ? "relative bg-background px-6 pb-16 pt-8 lg:px-12"
          : "bg-background py-20"
      }
    >
      {variant === "full" && (
        <>
          <div className="absolute left-0 top-1/4 h-80 w-80 rounded-full bg-accent-red/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-accent-orange/10 blur-3xl" />
        </>
      )}
      <div
        className={
          variant === "full"
            ? "relative z-10 mx-auto max-w-6xl"
            : "mx-auto w-full max-w-[1440px] px-6 lg:px-12"
        }
      >
        <div
          className={
            variant === "full"
              ? "mb-16"
              : "mb-16 text-center"
          }
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-accent-red">
            Benchmark
          </p>
          {(variant === "full" ? (
            <h1 className="mt-3 font-display text-4xl font-bold text-white lg:text-5xl">
              {granularity === "model"
                ? "Models Performance"
                : "Providers Performance"}
            </h1>
          ) : (
            <h2 className="mt-2 font-display text-3xl font-bold text-white lg:text-4xl">
              {granularity === "model"
                ? "Models Performance"
                : "Providers Performance"}
            </h2>
          ))}
          <p
            className={
              variant === "full"
                ? "mt-4 max-w-2xl text-base text-gray-400 lg:text-lg"
                : "mx-auto mt-4 max-w-2xl text-gray-400"
            }
          >
            {granularity === "model"
              ? "Failure-rate snapshot across current challenge suites."
              : "Failure-rate snapshot by provider (averaged across their models)."}
          </p>
        </div>

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

        {variant === "preview" && (
          <div className="relative mt-16 rounded-3xl border border-dark-200 bg-linear-to-br from-dark-100 to-dark-50 p-10 text-center lg:p-16 lg:text-left">
            <div className="pattern-bg absolute inset-0 opacity-10" />
            <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent-red/20 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row">
              <div className="max-w-xl">
                <h3 className="font-display text-3xl font-bold text-white">
                  Have a tricky prompt?
                </h3>
                <p className="mb-8 mt-4 text-lg text-gray-400">
                  Submit your edge case. If it breaks major models, we add it to
                  the gauntlet and credit the submission.
                </p>
                <Link
                  href="/submit-challenge"
                  className="inline-flex rounded-full bg-linear-to-r from-accent-red to-accent-orange px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-glow"
                >
                  Submit Challenge
                </Link>
              </div>

              <div className="shrink-0">
                <div className="w-64 rotate-3 rounded-2xl border border-dark-200 bg-dark-100/50 p-6 backdrop-blur-md transition-transform duration-500 hover:rotate-0">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-red/50 bg-accent-red/30 text-accent-red">
                      <Skull className="h-4 w-4" />
                    </div>
                    <div className="h-2 w-24 rounded-full bg-gray-700" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 w-full rounded-full bg-gray-700" />
                    <div className="h-2 w-3/4 rounded-full bg-gray-700" />
                    <div className="h-2 w-5/6 rounded-full bg-gray-700" />
                  </div>
                  <div className="mt-6 rounded-lg border border-red-800 bg-red-900/30 p-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                      <Skull className="h-3.5 w-3.5" />
                      Model Eliminated
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
