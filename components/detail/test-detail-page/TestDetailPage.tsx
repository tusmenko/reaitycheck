"use client";

import { Check, X, Eye } from "lucide-react";
import Link from "next/link";
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

  const killPct = Math.min(100, Math.round(stats.breakRate));

  return (
    <div className="
      mx-auto max-w-6xl px-4 py-8
      sm:px-6
      lg:px-8
    ">
      <section className="mb-12">
        <div className="min-w-0">
          <h1 className="
            font-display text-3xl font-bold tracking-tight text-foreground
            uppercase
            lg:text-4xl
          ">
            {test.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="
              border-2 border-black bg-muted px-3 py-1 text-xs font-bold
              tracking-wide text-muted-foreground uppercase
              dark:border-foreground
            ">
              {formatCategory(test.category)}
            </span>
          </div>

          <p className="mt-2 font-mono text-lg text-muted-foreground">
            This challenge cracked {stats.modelsCracked} out of{" "}
            {stats.totalModels} top models
          </p>

          <div className="mt-4 max-w-sm">
            <div className="mb-2 flex items-center justify-between">
              <span className="
                text-xs font-bold text-muted-foreground uppercase
              ">
                Kill Rate
              </span>
              <span className="font-mono text-sm font-bold text-neon-pink">
                {killPct}%
              </span>
            </div>
            <div className="
              h-4 w-full border-2 border-black bg-muted
              dark:border-foreground
            ">
              <div
                className="h-full bg-neon-pink"
                style={{ width: `${killPct}%` }}
              />
            </div>
          </div>

          <div className="
            mt-6 border-4 border-black bg-muted/50 p-4
            dark:border-foreground
          ">
            <p className="font-mono text-sm/relaxed whitespace-pre-wrap">
              {test.prompt}
            </p>
          </div>

          <div className="
            mt-6 border-4 border-black bg-card p-4
            dark:border-foreground
          ">
            <h2 className="mb-3 text-lg font-bold text-foreground uppercase">
              Why It Matters
            </h2>
            {test.explanation && (
              <p className="mb-4 font-mono text-muted-foreground">
                {test.explanation}
              </p>
            )}
            <p className="text-sm">
              <span className="font-bold uppercase">Expected answer:</span>{" "}
              <code className="
                border-2 border-black bg-muted px-1.5 py-0.5 font-mono
                dark:border-foreground
              ">
                {test.expectedAnswer}
              </code>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-foreground uppercase">
          Victims
        </h2>
        <div className="
          overflow-x-auto border-4 border-black
          dark:border-foreground
        ">
          <Table>
            <TableHeader>
              <TableRow className="
                border-b-4 border-black bg-muted
                dark:border-foreground
              ">
                <TableHead className="font-bold uppercase">Model</TableHead>
                <TableHead className="text-center font-bold uppercase">
                  Latest Result
                </TableHead>
                <TableHead className="text-center font-bold uppercase">
                  Break Rate
                </TableHead>
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
                  <TableRow
                    key={entry.model._id}
                    className="
                      border-b-2 border-black
                      dark:border-foreground
                    "
                  >
                    <TableCell className="font-bold">
                      <Link
                        href={href}
                        className="
                          text-foreground underline-offset-4
                          hover:text-neon-pink hover:underline
                        "
                      >
                        {entry.model.modelName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      {entry.latestRun ? (
                        <span className={`
                          mx-auto inline-flex size-8 items-center justify-center
                          border-2 border-black
                          dark:border-foreground
                          ${passed
                            ? `
                              bg-neon-green shadow-[1px_1px_0px_#000]
                              dark:shadow-[1px_1px_0px_#f5f5f0]
                            `
                            : `
                              bg-neon-pink shadow-[1px_1px_0px_#000]
                              dark:shadow-[1px_1px_0px_#f5f5f0]
                            `
                          }
                        `}>
                          {passed ? (
                            <Check className="size-5 stroke-3 text-black" />
                          ) : (
                            <X className="size-5 stroke-3 text-white" />
                          )}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">–</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-mono font-bold">
                      {ratePct}%
                    </TableCell>
                    <TableCell>
                      {entry.latestRun?.rawResponse != null ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="
                                cursor-pointer border-2 border-black
                                dark:border-foreground
                              "
                            >
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
                              border-2 border-black bg-muted p-4 text-sm
                              wrap-break-word whitespace-pre-wrap
                              dark:border-foreground
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
