"use client";

import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
import { MemenessStars } from "@/components/custom/memeness-stars";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  modelDetailHref,
  formatCategory,
  killRateBarColor,
} from "@/lib/model-detail-utils";
import { type TestDetailPageProps } from "./TestDetailPage.types";
import { useTestDetailPage } from "./useTestDetailPage";

export const TestDetailPage = (props: TestDetailPageProps) => {
  const { test, breakdown, stats } = useTestDetailPage(props);

  if (!test) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">Test not found.</p>
      </div>
    );
  }

  return (
    <div className="
      mx-auto max-w-6xl px-4 py-8
      sm:px-6
      lg:px-8
    ">
      <section className="mb-10">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{formatCategory(test.category)}</Badge>
            <MemenessStars score={test.memenessScore} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            This challenge cracked {stats.modelsCracked} out of{" "}
            {stats.totalModels} top models
          </p>
          <div className="mt-3 flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Kill rate
            </span>
            <div className="flex items-center gap-3">
              <div className="
                h-2 max-w-xs min-w-[120px] flex-1 overflow-hidden rounded-full
                bg-muted
              ">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round(stats.breakRate))}%`,
                    backgroundColor: killRateBarColor(stats.breakRate),
                  }}
                />
              </div>
              <span className="text-sm font-semibold tabular-nums">
                {Math.round(stats.breakRate)}%
              </span>
            </div>
          </div>
          <div className="mt-4 rounded-lg border bg-muted/50 p-4">
            <p className="font-mono text-sm/relaxed whitespace-pre-wrap">
              {test.prompt}
            </p>
          </div>
          <div className="mt-6 rounded-lg border bg-muted/30 p-4">
            <h2 className="mb-3 text-lg font-semibold">Why It Matters</h2>
            {test.explanation && (
              <p className="mb-4 text-muted-foreground">{test.explanation}</p>
            )}
            <p className="text-sm">
              <span className="font-medium">Expected answer:</span>{" "}
              <code className="rounded-sm bg-muted px-1.5 py-0.5">
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
                const modelSlug =
                  "slug" in entry.model ? entry.model.slug : undefined;
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
                        className="
                          text-primary underline-offset-4
                          hover:underline
                        "
                      >
                        {entry.model.modelName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.latestRun ? (
                        passed ? (
                          <Check className="
                            mx-auto size-5 text-green-600
                            dark:text-green-500
                          " />
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
                          <DialogContent className="
                            max-h-[80vh] max-w-2xl overflow-y-auto
                          ">
                            <DialogHeader>
                              <DialogTitle>Raw response</DialogTitle>
                            </DialogHeader>
                            <pre className="
                              rounded-sm bg-muted p-4 text-sm wrap-break-word
                              whitespace-pre-wrap
                            ">
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
};
