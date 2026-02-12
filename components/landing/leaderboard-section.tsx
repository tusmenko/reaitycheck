import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendIndicator } from "@/components/custom/trend-indicator";
import type { LeaderboardEntry, Provider } from "@/lib/types";
import { Trophy } from "lucide-react";

const PROVIDER_STYLES: Record<Provider, string> = {
  openai: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  anthropic:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  google: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  meta: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

const RANK_STYLES: Record<number, string> = {
  1: "border-yellow-400 dark:border-yellow-500",
  2: "border-gray-300 dark:border-gray-500",
  3: "border-amber-600 dark:border-amber-700",
};

interface LeaderboardSectionProps {
  leaderboard: LeaderboardEntry[];
}

export function LeaderboardSection({ leaderboard }: LeaderboardSectionProps) {
  return (
    <section className="py-16">
      <div className="mb-8 flex items-center gap-2">
        <Trophy className="h-6 w-6" />
        <h2 className="text-3xl font-bold tracking-tight">Leaderboard</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {leaderboard.map((entry) => (
          <Card
            key={entry.model.id}
            className={`relative ${RANK_STYLES[entry.rank] ? `border-2 ${RANK_STYLES[entry.rank]}` : ""}`}
          >
            {entry.rank <= 3 && (
              <div className="absolute -top-3 left-4">
                <Badge
                  variant="default"
                  className={
                    entry.rank === 1
                      ? "bg-yellow-500 text-black"
                      : entry.rank === 2
                        ? "bg-gray-400 text-black"
                        : "bg-amber-700 text-white"
                  }
                >
                  #{entry.rank}
                </Badge>
              </div>
            )}

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {entry.model.modelName}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={PROVIDER_STYLES[entry.model.provider]}
                >
                  {entry.model.provider}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {Math.round(entry.successRate * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {entry.successfulRuns}/{entry.totalRuns} passed
                  </p>
                </div>
                <TrendIndicator trend={entry.trend} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
