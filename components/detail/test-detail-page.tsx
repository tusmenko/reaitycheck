"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MemenessStars } from "@/components/custom/memeness-stars";
import {
  modelDetailHref,
  formatCategory,
  killRateBarColor,
} from "@/lib/model-detail-utils";
import { Check, X, Eye } from "lucide-react";

interface TestDetailPageProps {
  preloadedTest: Preloaded<typeof api.queries.getTestBySlug>;
  preloadedBreakdown: Preloaded<typeof api.queries.getTestBreakdown>;
}

export function TestDetailPage({
  preloadedTest,
  preloadedBreakdown,
}: TestDetailPageProps) {
  const test = usePreloadedQuery(preloadedTest);
  const breakdown = usePreloadedQuery(preloadedBreakdown);

  if (!test) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">Test not found.</p>
      </div>
    );
  }

  const totalModels = breakdown.length;
  const modelsCracked = breakdown.filter(
    (e) => e.latestRun && !e.latestRun.isCorrect
  ).length;
  const breakRate =
    totalModels > 0
      ? (breakdown.filter((e) => e.latestRun && !e.latestRun.isCorrect).length /
        totalModels) *
      100
      : 0;
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-10">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{formatCategory(test.category)}</Badge>
            <MemenessStars score={test.memenessScore} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            This breaker cracked {modelsCracked} out of {totalModels} top models
          </p>
          {/* Break rate (kill rate) bar */}
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Break rate
            </span>
            <div className="flex items-center gap-3">
              <div className="min-w-[120px] flex-1 max-w-xs h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(breakRate))}%`,
                    backgroundColor: killRateBarColor(breakRate),
                  }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(breakRate)}%
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-lg border bg-muted/50 p-4">
            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
              {test.prompt}
            </p>
          </div>
          {/* Why it matters: right after challenge text */}
          <div className="mt-6 rounded-lg border bg-muted/30 p-4">
            <h2 className="mb-3 text-lg font-semibold">Why It Matters</h2>
            {test.explanation && (
              <p className="mb-4 text-muted-foreground">{test.explanation}</p>
            )}
            <p className="text-sm">
              <span className="font-medium">Expected answer:</span>{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">
                {test.expectedAnswer}
              </code>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Victims</h2>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Model</TableHead>
                <TableHead className="text-center">Latest Result</TableHead>
                <TableHead className="text-center">Break Rate</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdown.map((entry) => {
                const passed = entry.latestRun?.isCorrect ?? false;
                const ratePct =
                  entry.totalRuns > 0
                    ? Math.round((1 - entry.successRate) * 100)
                    : 0;
                const modelSlug = "slug" in entry.model ? entry.model.slug : undefined;
                const href = modelDetailHref(
                  entry.model.provider,
                  modelSlug,
                  entry.model.apiIdentifier
                );
                return (
                  <TableRow key={entry.model._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={href}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {entry.model.modelName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.latestRun ? (
                        passed ? (
                          <Check className="mx-auto size-5 text-green-600 dark:text-green-500" />
                        ) : (
                          <X className="mx-auto size-5 text-destructive" />
                        )
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{ratePct}%</TableCell>
                    <TableCell>
                      {entry.latestRun?.rawResponse != null ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Eye className="size-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Raw response</DialogTitle>
                            </DialogHeader>
                            <pre className="whitespace-pre-wrap wrap-break-word rounded bg-muted p-4 text-sm">
                              {entry.latestRun.rawResponse}
                            </pre>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        "–"
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

    </div>
  );
}
