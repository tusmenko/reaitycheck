import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Trend } from "@/lib/types";

export function TrendIndicator({ trend }: { trend: Trend }) {
  switch (trend) {
    case "up":
      return (
        <span className="inline-flex items-center gap-1 text-green-600">
          <TrendingUp className="h-4 w-4" />
          Improving
        </span>
      );
    case "down":
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <TrendingDown className="h-4 w-4" />
          Declining
        </span>
      );
    case "stable":
      return (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Minus className="h-4 w-4" />
          Stable
        </span>
      );
  }
}
