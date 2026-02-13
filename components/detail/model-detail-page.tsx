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
import { Check, X, Eye } from "lucide-react";

const PROVIDER_STYLES: Partial<Record<string, string>> = {
  openai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  anthropic: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  google: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  meta: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  deepseek: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  qwen: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  mistral: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

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

interface ModelDetailPageProps {
  preloadedModel: Preloaded<typeof api.queries.getModelBySlug>;
  preloadedBreakdown: Preloaded<typeof api.queries.getModelBreakdown>;
}

export function ModelDetailPage({
  preloadedModel,
  preloadedBreakdown,
}: ModelDetailPageProps) {
  const model = usePreloadedQuery(preloadedModel);
  const breakdown = usePreloadedQuery(preloadedBreakdown);

  if (!model) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <p className="text-muted-foreground">Model not found.</p>
      </div>
    );
  }

  const totalTests = breakdown.length;
  const testsSurvived = breakdown.filter(
    (e) => e.latestRun && e.latestRun.isCorrect
  ).length;
  const testsFailed = totalTests - testsSurvived;
  const resilienceRate =
    totalTests > 0
      ? (breakdown.filter((e) => e.latestRun && e.latestRun.isCorrect).length /
        totalTests) *
      100
      : 0;
  const runsWithTime = breakdown.filter((e) => e.latestRun);
  const avgResponseTimeMs =
    runsWithTime.length > 0
      ? Math.round(
        runsWithTime.reduce(
          (acc, e) => acc + (e.latestRun?.executionTimeMs ?? 0),
          0
        ) / runsWithTime.length
      )
      : 0;
  const toughestBreakers = [...breakdown]
    .filter((e) => e.latestRun && !e.latestRun.isCorrect)
    .sort((a, b) => a.successRate - b.successRate)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2">
          <Badge
            variant="outline"
            className={PROVIDER_STYLES[model.provider] ?? "bg-muted text-muted-foreground"}
          >
            {model.provider}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">{model.modelName}</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Survived {testsSurvived} out of {totalTests} breakers
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {model.contextWindow != null && (
            <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
          )}
          {model.costPer1kTokens != null && (
            <span>Cost: ${model.costPer1kTokens}/1k tokens</span>
          )}
          {model.maxTokens != null && (
            <span>Max tokens: {model.maxTokens}</span>
          )}
        </div>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Resilience Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{Math.round(resilienceRate)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tests Survived
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{testsSurvived}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tests Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{testsFailed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{avgResponseTimeMs} ms</p>
          </CardContent>
        </Card>
      </div>

      {toughestBreakers.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold">Toughest Breakers</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {toughestBreakers.map((entry) => {
              const difficulty = (entry.test.difficulty ?? "medium") as keyof typeof DIFFICULTY_STYLES;
              return (
                <Link
                  key={entry.test._id}
                  href={`/challenges/${entry.test.slug}`}
                  className="block"
                >
                  <Card className="transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        {entry.test.name}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {formatCategory(entry.test.category)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={DIFFICULTY_STYLES[difficulty]}
                        >
                          {difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Success rate: {Math.round(entry.successRate * 100)}%
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Breaker Results</h2>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead className="text-center">Latest Result</TableHead>
                <TableHead className="text-center">Success Rate</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {breakdown.map((entry) => {
                const passed = entry.latestRun?.isCorrect ?? false;
                const ratePct =
                  entry.totalRuns > 0
                    ? Math.round(entry.successRate * 100)
                    : 0;
                const difficulty = (entry.test.difficulty ?? "medium") as keyof typeof DIFFICULTY_STYLES;
                return (
                  <TableRow key={entry.test._id}>
                    <TableCell className="font-medium">
                      <Link
                        href={`/challenges/${entry.test.slug}`}
                        className="text-primary underline-offset-4 hover:underline"
                      >
                        {entry.test.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {formatCategory(entry.test.category)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={DIFFICULTY_STYLES[difficulty]}
                      >
                        {difficulty}
                      </Badge>
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
