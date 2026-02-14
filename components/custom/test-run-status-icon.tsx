"use client";

import type { ComparisonCell } from "@/lib/types";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ERROR_TOOLTIP =
  "Technical failure (e.g. timeout or API error). Not related to the model’s response.";

interface TestRunStatusIconProps {
  cell: ComparisonCell | undefined;
  /** Expected answer for this test (for answer popup when clicking success/failure) */
  expectedAnswer?: string;
}

export function TestRunStatusIcon({ cell, expectedAnswer }: TestRunStatusIconProps) {
  if (!cell) {
    return <span className="text-muted-foreground">–</span>;
  }

  if (cell.status === "error" || cell.status === "timeout") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex cursor-help items-center justify-center">
              <AlertTriangle className="size-5 text-amber-500" />
            </span>
          </TooltipTrigger>
          <TooltipContent>{ERROR_TOOLTIP}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const rawResponse = cell.rawResponse ?? "—";
  const parsedAnswer = cell.parsedAnswer ?? "—";
  const expected = expectedAnswer ?? "—";

  const baseContentClass =
    "rounded-md border border-dark-200 bg-dark-50/50 p-3 text-white whitespace-pre-wrap wrap-break-word overflow-y-auto";
  const modelAnswerClass = `${baseContentClass} max-h-64`;
  const shortAnswerClass = `${baseContentClass} max-h-32`;

  // Both success (check) and failure (X) are clickable to show answer details
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center rounded p-0.5 transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="View model answer and expected answer"
        >
          {cell.isCorrect ? (
            <Check className="size-5 text-green-600 dark:text-green-500" />
          ) : (
            <X className="size-5 text-destructive" />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>Answer details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 text-sm min-h-0 overflow-y-auto">
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Model answer
            </div>
            <div className={modelAnswerClass}>
              {rawResponse || "—"}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Parsed answer
            </div>
            <div className={shortAnswerClass}>
              {parsedAnswer || "—"}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Expected answer
            </div>
            <div className={shortAnswerClass}>
              {expected}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
