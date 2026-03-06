"use client";

import { formatDistanceToNow } from "date-fns";
import type { DataFreshnessIndicatorProps } from "./DataFreshnessIndicator.types";

export const DataFreshnessIndicator = ({ lastUpdated }: DataFreshnessIndicatorProps) => {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="relative flex size-2">
        <span className="
          absolute inline-flex size-full animate-ping rounded-full bg-green-400
          opacity-75
        " />
        <span className="relative inline-flex size-2 rounded-full bg-green-500" />
      </span>
      <span className="text-muted-foreground">
        Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
      </span>
    </div>
  );
};
