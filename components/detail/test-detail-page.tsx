"use client";

import { usePreloadedQuery, type Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Check, X, Eye } from "lucide-react";

const DIFFICULTY_STYLES = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function formatCategory(category: string) {
  return category
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function modelDetailHref(provider: string, slug: string | undefined, apiIdentifier: string) {
  const s = slug ?? apiIdentifier.split("/")[1]?.replace(/:/g, "-") ?? "";
  return `/model/${encodeURIComponent(provider)}/${encodeURIComponent(s)}`;
}

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
  const difficulty = (test.difficulty ?? "medium") as keyof typeof DIFFICULTY_STYLES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="outline">{formatCategory(test.category)}</Badge>
          <Badge variant="outline" className={DIFFICULTY_STYLES[difficulty]}>
            {difficulty}
          </Badge>
          <MemenessStars score={test.memenessScore} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{test.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          This breaker cracked {modelsCracked} out of {totalModels} models
        </p>
        <div className="mt-4 rounded-lg border bg-muted/50 p-4">
          <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {test.prompt}
          </p>
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Break Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(breakRate)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Models Cracked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{modelsCracked}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={DIFFICULTY_STYLES[difficulty]}>{difficulty}</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Virality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MemenessStars score={test.memenessScore} />
          </CardContent>
        </Card>
      </div>

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

      <section className="rounded-lg border bg-muted/30 p-6">
        <h2 className="mb-3 text-xl font-semibold">Why It Matters</h2>
        {test.explanation && (
          <p className="mb-4 text-muted-foreground">{test.explanation}</p>
        )}
        <p className="text-sm">
          <span className="font-medium">Expected answer:</span>{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">
            {test.expectedAnswer}
          </code>
        </p>
      </section>
    </div>
  );
}
