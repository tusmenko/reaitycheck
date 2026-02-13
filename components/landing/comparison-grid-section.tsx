"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";
import {
  Shield,
  GitBranch,
  Quote,
  Terminal,
  User,
  Skull,
  ChevronRight,
} from "lucide-react";

function modelDetailHref(
  provider: string,
  slug: string | undefined,
  apiIdentifier: string
) {
  const s =
    slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
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

function failurePillClass(failurePct: number): string {
  if (failurePct <= 10)
    return "rounded-full border border-green-800 bg-green-900/30 px-3 py-1 text-sm font-bold text-green-400";
  if (failurePct <= 25)
    return "rounded-full border border-yellow-800 bg-yellow-900/30 px-3 py-1 text-sm font-bold text-yellow-400";
  return "rounded-full border border-red-800 bg-red-900/30 px-3 py-1 text-sm font-bold text-red-400";
}

function getRowIcon(index: number) {
  const icons = [Shield, GitBranch, Quote, Terminal];
  const icon = icons[index % icons.length];
  const colorClasses = [
    "bg-red-900/30 text-red-400 border-red-800",
    "bg-blue-900/30 text-blue-400 border-blue-800",
    "bg-purple-900/30 text-purple-400 border-purple-800",
    "bg-orange-900/30 text-orange-400 border-orange-800",
  ];
  return { icon, color: colorClasses[index % colorClasses.length] };
}

export function ComparisonGridSection({
  tests,
  models,
  grid,
}: ComparisonGridSectionProps) {
  const [view, setView] = useState<"table" | "chart">("table");

  return (
    <section id="test-runs" className="bg-dark-50 py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display mb-2 text-3xl font-bold text-white">
              Live Benchmarks
            </h2>
            <p className="text-dark-500">
              Real-time snapshot of survival rates across our most difficult
              challenge suites.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-dark-200 bg-dark-100 p-1">
            <button
              type="button"
              onClick={() => setView("table")}
              className={`rounded px-4 py-1.5 text-sm font-medium shadow-sm ${
                view === "table"
                  ? "bg-dark-200 text-white"
                  : "text-dark-500 hover:text-white"
              }`}
            >
              Table
            </button>
            <button
              type="button"
              onClick={() => setView("chart")}
              className={`rounded px-4 py-1.5 text-sm font-medium ${
                view === "chart"
                  ? "bg-dark-200 text-white shadow-sm"
                  : "text-dark-500 hover:text-white"
              }`}
            >
              Chart
            </button>
          </div>
        </div>

        {view === "table" && (
          <div className="overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 shadow-soft">
            <div className="scrollbar-hide overflow-x-auto">
              <Table className="w-full min-w-[800px] md:min-w-full">
                <TableHeader>
                  <TableRow className="border-dark-200 bg-dark-50">
                    <TableHead className="w-1/4 px-8 py-5 text-left text-xs font-semibold uppercase tracking-wider text-dark-500">
                      Challenge Suite
                    </TableHead>
                    {models.map((model) => (
                      <TableHead
                        key={model._id}
                        className="min-w-[120px] px-6 py-5 text-center text-xs font-semibold uppercase tracking-wider text-dark-500"
                      >
                        <Link
                          href={modelDetailHref(
                            model.provider,
                            model.slug,
                            model.apiIdentifier
                          )}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          {model.modelName}
                        </Link>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dark-200">
                  {tests.map((test, index) => {
                    const { icon: RowIcon, color } = getRowIcon(index);
                    return (
                      <TableRow
                        key={test._id}
                        className="transition-colors hover:bg-dark-50/50"
                      >
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center">
                            <div
                              className={`mr-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${color}`}
                            >
                              <RowIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <Link
                                href={`/test/${test.slug}`}
                                className="text-sm font-bold text-white hover:underline"
                              >
                                {test.name}
                              </Link>
                              <div className="mt-0.5 text-xs text-dark-500">
                                {test.category.replace(/_/g, " ")}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {models.map((model) => {
                          const cell = getResult(
                            grid,
                            test._id,
                            model._id
                          );
                          const failurePct =
                            cell != null
                              ? Math.round((1 - cell.successRate) * 100)
                              : null;
                          return (
                            <TableCell
                              key={model._id}
                              className="px-6 py-6 text-center"
                            >
                              {failurePct != null ? (
                                <span
                                  className={failurePillClass(failurePct)}
                                >
                                  {failurePct}%
                                </span>
                              ) : (
                                <span className="text-dark-500">—</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="border-t border-dark-200 bg-dark-50 px-8 py-4 text-center">
              <button
                type="button"
                className="text-sm font-medium text-accent-red hover:text-accent-orange"
              >
                View Full Benchmark Report
                <ChevronRight className="ml-1 inline h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {view === "chart" && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dark-200 bg-dark-100 py-20 px-6 text-center shadow-soft">
            <div className="mb-4 h-16 w-16 animate-spin rounded-full border-4 border-dark-200 border-t-accent-red" />
            <h3 className="text-xl font-bold text-white">
              Generating Analysis...
            </h3>
            <p className="mt-2 max-w-xs text-dark-500">
              Aggregating live performance data for visual comparison.
            </p>
          </div>
        )}

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-dark-200 bg-gradient-to-br from-dark-100 to-dark-50 p-10 text-center lg:p-16 lg:text-left">
          <div className="pattern-bg absolute inset-0 opacity-10" />
          <div className="absolute -mr-20 -mt-20 right-0 top-0 h-80 w-80 rounded-full bg-accent-red/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display mb-4 text-3xl font-bold text-white">
                Have a tricky prompt?
              </h3>
              <p className="mb-8 text-lg text-dark-500">
                Submit your edge case. If it breaks a major model, we&apos;ll
                add it to the permanent gauntlet and credit you.
              </p>
              <Link
                href="#"
                className="inline-flex rounded-full bg-gradient-to-r from-accent-red to-accent-orange px-8 py-3 font-bold text-white shadow-lg transition-all hover:shadow-glow"
              >
                Submit Challenge
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="flex h-64 w-64 rotate-3 flex-col rounded-2xl border border-dark-200 bg-dark-100/50 p-6 backdrop-blur-md transition-transform duration-500 hover:rotate-0">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-accent-red/50 bg-accent-red/30 text-xs text-accent-red">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="h-2 w-24 rounded-full bg-dark-700" />
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-dark-700" />
                  <div className="h-2 w-3/4 rounded-full bg-dark-700" />
                  <div className="h-2 w-5/6 rounded-full bg-dark-700" />
                </div>
                <div className="mt-6 rounded-lg border border-red-800 bg-red-900/30 p-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <Skull className="h-4 w-4" />
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
