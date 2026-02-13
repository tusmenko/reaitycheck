import Link from "next/link";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import { ChevronRight, Skull } from "lucide-react";

function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s = slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/model/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

interface ComparisonGridSectionProps {
  tests: TestCase[];
  models: AIModel[];
  grid: ComparisonCell[];
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

export function ComparisonGridSection({
  tests,
  models,
  grid,
}: ComparisonGridSectionProps) {
  const tableModels = models.slice(0, 4);
  const tableTests = tests.slice(0, 8);

  function failureBadgeClass(failureRate: number) {
    if (failureRate >= 30) return "border-red-800 bg-red-900/30 text-red-400";
    if (failureRate >= 15)
      return "border-yellow-800 bg-yellow-900/30 text-yellow-400";
    return "border-green-800 bg-green-900/30 text-green-400";
  }

  return (
    <section id="test-runs" className="bg-dark-50 py-20">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold text-white">
              Live Benchmarks
            </h2>
            <p className="mt-2 text-gray-400">
              Failure-rate snapshot across current challenge suites.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-dark-200 bg-dark-50">
                  <th className="px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Challenge Suite
                  </th>
                  {tableModels.map((model) => (
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
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200">
                {tableTests.map((test) => (
                  <tr key={test._id} className="transition-colors hover:bg-dark-50/50">
                    <td className="px-8 py-6">
                      <Link
                        href={`/test/${test.slug}`}
                        className="text-sm font-bold text-white transition-colors hover:text-accent-red"
                      >
                        {test.name}
                      </Link>
                      <div className="mt-0.5 text-xs text-gray-500">
                        {test.category.replaceAll("_", " ")}
                      </div>
                    </td>
                    {tableModels.map((model) => {
                      const cell = getResult(grid, test._id, model._id);
                      const failureRate = cell
                        ? Math.max(0, Math.round((1 - cell.successRate) * 100))
                        : null;

                      return (
                        <td key={model._id} className="px-6 py-6 text-center">
                          {failureRate === null ? (
                            <span className="text-sm text-gray-500">N/A</span>
                          ) : (
                            <span
                              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-bold ${failureBadgeClass(failureRate)}`}
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
            <a
              href="#models"
              className="inline-flex items-center text-sm font-medium text-accent-red transition-colors hover:text-accent-orange"
            >
              Back to top models
              <ChevronRight className="ml-1 h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-dark-200 bg-linear-to-br from-dark-100 to-dark-50 p-10 text-center lg:p-16 lg:text-left">
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
              <a
                href="#challenges"
                className="inline-flex rounded-full bg-linear-to-r from-accent-red to-accent-orange px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-glow"
              >
                Submit Challenge
              </a>
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
      </div>
    </section>
  );
}
