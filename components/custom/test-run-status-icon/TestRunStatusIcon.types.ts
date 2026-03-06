import type { ComparisonCell } from "@/lib/types";

export interface TestRunStatusIconProps {
  cell: ComparisonCell | undefined;
  /** Expected answer for this test (for answer popup when clicking success/failure) */
  expectedAnswer?: string;
}
