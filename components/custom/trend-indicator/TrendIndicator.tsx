import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendIndicatorProps } from "./TrendIndicator.types";

export const TrendIndicator = ({ trend }: TrendIndicatorProps) => {
  switch (trend) {
    case "up":
      return (
        <span className="inline-flex items-center gap-1 text-green-600">
          <TrendingUp className="size-4" />
          Improving
        </span>
      );
    case "down":
      return (
        <span className="inline-flex items-center gap-1 text-red-600">
          <TrendingDown className="size-4" />
          Declining
        </span>
      );
    case "stable":
      return (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Minus className="size-4" />
          Stable
        </span>
      );
  }
};
