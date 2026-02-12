"use client";

import { formatDistanceToNow } from "date-fns";

export function DataFreshnessIndicator({ lastUpdated }: { lastUpdated: Date }) {
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      <span className="text-muted-foreground">
        Last updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
      </span>
    </div>
  );
}
