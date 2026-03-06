import type { TestCase, AIModel, ComparisonCell } from "@/lib/types";

export interface ComparisonGridSectionProps {
  tests: TestCase[];
  models: AIModel[];
  grid: ComparisonCell[];
  /** "provider" = columns are providers (aggregated failure rate). 
   * "model" = columns are models (per-model failure rate). */
  granularity?: "provider" | "model";
  /** When "full", show all providers/models and tests and a "Back to overview" footer. 
   * When "preview" (default), show first 6 providers or 4 models and 8 tests with 
   * "Full benchmark" link. */
  variant?: "preview" | "full";
}
