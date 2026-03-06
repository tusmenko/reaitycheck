"use client";

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
import {
  ERROR_TOOLTIP,
  MODEL_ANSWER_CLASS,
  SHORT_ANSWER_CLASS,
} from "./TestRunStatusIcon.constants";
import type { TestRunStatusIconProps } from "./TestRunStatusIcon.types";

export const TestRunStatusIcon = ({ cell, expectedAnswer }: TestRunStatusIconProps) => {
  if (!cell) {
    return <span className="text-muted-foreground">–</span>;
  }

  if (cell.status === "error" || cell.status === "timeout") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="
              inline-flex cursor-help items-center justify-center
            ">
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="
            inline-flex cursor-pointer items-center justify-center rounded-sm
            p-0.5 transition-opacity
            hover:opacity-80
            focus:ring-2 focus:ring-white/50 focus:outline-none
          "
          aria-label="View model answer and expected answer"
        >
          {cell.isCorrect ? (
            <Check className="
              size-5 text-green-600
              dark:text-green-500
            " />
          ) : (
            <X className="size-5 text-destructive" />
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="
        flex max-h-[90vh] max-w-lg flex-col overflow-hidden
      ">
        <DialogHeader>
          <DialogTitle>Answer details</DialogTitle>
        </DialogHeader>
        <div className="grid min-h-0 gap-4 overflow-y-auto text-sm">
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Model answer
            </div>
            <div className={MODEL_ANSWER_CLASS}>
              {rawResponse || "—"}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Parsed answer
            </div>
            <div className={SHORT_ANSWER_CLASS}>
              {parsedAnswer || "—"}
            </div>
          </div>
          <div className="min-w-0">
            <div className="mb-1 font-medium text-gray-400">
              Expected answer
            </div>
            <div className={SHORT_ANSWER_CLASS}>
              {expected}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
