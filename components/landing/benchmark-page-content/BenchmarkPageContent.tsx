"use client";

import { ComparisonGridSection } from "../comparison-grid-section";
import type { BenchmarkPageContentProps } from "./BenchmarkPageContent.types";
import { useBenchmarkPageContent } from "./useBenchmarkPageContent";

export const BenchmarkPageContent = (props: BenchmarkPageContentProps) => {
  const { testCases, aiModels, comparisonGrid, isLoading } =
    useBenchmarkPageContent(props);

  return (
    <div className="
      relative h-full min-h-screen overflow-x-hidden bg-background
    ">
      <main className="relative">
        {isLoading ? (
          <section className="
            relative bg-background px-6 pt-8 pb-16
            lg:px-12
          ">
            <div className="relative z-10 mx-auto max-w-6xl">
              <p className="font-mono text-muted-foreground">
                Loading benchmark data…
              </p>
            </div>
          </section>
        ) : (
          <section
            id="test-runs"
            className="
              relative bg-background px-6 pt-8 pb-16
              lg:px-12
            "
          >
            <div className="relative z-10 mx-auto max-w-6xl">
              <div className="mb-16">
                <span className="
                  inline-block -rotate-1 border-4 border-black bg-neon-blue px-3
                  py-1 text-xs font-bold tracking-wide text-white uppercase
                  shadow-[3px_3px_0px_#000]
                  dark:border-foreground
                ">
                  Benchmark
                </span>
                <h2 className="
                  mt-4 font-display text-4xl font-bold text-foreground uppercase
                  lg:text-5xl
                ">
                  Models Performance
                </h2>
                <p className="
                  mt-4 max-w-2xl font-mono text-base text-muted-foreground
                  lg:text-lg
                ">
                  Failure-rate snapshot across current challenge suites.
                </p>
              </div>
              <ComparisonGridSection
                tests={testCases}
                models={aiModels}
                grid={comparisonGrid}
                granularity="model"
                variant="full"
              />
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
