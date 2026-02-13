import type { ComparisonCell } from "@/lib/types";
import { AlertTriangle, Check, X } from "lucide-react";

interface TestRunStatusIconProps {
  cell: ComparisonCell | undefined;
}

export function TestRunStatusIcon({ cell }: TestRunStatusIconProps) {
  if (!cell) {
    return <span className="text-muted-foreground">–</span>;
  }

  if (cell.status === "error" || cell.status === "timeout") {
    return <AlertTriangle className="size-5 text-amber-500" />;
  }

  if (cell.isCorrect) {
    return (
      <Check className="size-5 text-green-600 dark:text-green-500" />
    );
  }

  return <X className="size-5 text-destructive" />;
}
