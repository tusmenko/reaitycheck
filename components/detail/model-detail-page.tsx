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
import { Check, X, Eye, Skull, Target, Swords } from "lucide-react";

const TOUGHEST_BREAKER_RANKS = [
  { Icon: Skull, iconColor: "text-red-400" },
  { Icon: Target, iconColor: "text-orange-400" },
  { Icon: Swords, iconColor: "text-slate-400" },
] as const;

function passRateColorClass(pct: number): string {
  if (pct <= 25) return "text-red-400";
  if (pct <= 50) return "text-amber-400";
  if (pct <= 75) return "text-yellow-400";
  return "text-brand-500";
}

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
    .filter((e) => e.latestRun != null)
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
          <div
            className={`grid gap-8 ${
              toughestBreakers.length === 1
                ? "grid-cols-1"
                : toughestBreakers.length === 2
                  ? "grid-cols-1 md:grid-cols-2"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {toughestBreakers.map((entry, index) => {
              const rank = index + 1;
              const { Icon, iconColor } = TOUGHEST_BREAKER_RANKS[index];
              const passRatePct = Math.round(entry.successRate * 100);
              return (
                <Link
                  key={entry.test._id}
                  href={`/challenges/${entry.test.slug}`}
                  className="group block h-full"
                >
                  <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-dark-200 bg-dark-100 p-8 shadow-card transition-all duration-300 hover:border-dark-300 hover:shadow-hover">
                    <div
                      className={`absolute right-6 top-6 opacity-5 transition-opacity group-hover:opacity-10 ${iconColor}`}
                    >
                      <Icon className="h-24 w-24" />
                    </div>

                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-bold text-white transition-colors group-hover:text-accent-red">
                          {entry.test.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatCategory(entry.test.category)}
                        </p>
                      </div>

                      <span className="inline-flex items-center rounded-full border border-dark-300 bg-dark-200 px-2.5 py-1 text-xs font-medium text-gray-300">
                        #{rank}
                      </span>
                    </div>

                    <div className="mt-auto rounded-xl border border-dark-200 bg-dark-50 p-4">
                      <div className="mb-2 text-xs font-semibold uppercase text-gray-500">
                        Pass rate
                      </div>
                      <div className={`text-2xl font-bold ${passRateColorClass(passRatePct)}`}>
                        {passRatePct}%
                      </div>
                    </div>
                  </article>
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