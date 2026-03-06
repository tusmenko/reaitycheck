export type Provider =
  | "openai"
  | "anthropic"
  | "google"
  | "meta"
  | "deepseek"
  | "alibaba"
  | "mistral";
export type Trend = "up" | "down" | "stable";

export interface TestCase {
  _id: string;
  name: string;
  slug: string;
  category: string;
  prompt: string;
  expectedAnswer: string;
  explanation: string;
  memenessScore: number;
  tags: string[];
  isActive: boolean;
  /** When set, actual kill rate from runs (% of models that failed). Null = no runs yet. */
  killRate?: number | null;
}

export interface AIModel {
  _id: string;
  provider: Provider;
  modelName: string;
  modelVersion: string;
  apiIdentifier: string;
  slug?: string;
  contextWindow: number;
  inputCostPer1MTokens?: number;
  outputCostPer1MTokens?: number;
  maxCompletionTokens?: number;
  isFree?: boolean;
  isActive: boolean;
}

export interface TestRun {
  _id: string;
  testCaseId: string;
  modelId: string;
  executedAt: number;
  status: "success" | "failed" | "error" | "timeout";
  rawResponse: string;
  parsedAnswer: string;
  isCorrect: boolean;
  executionTimeMs: number;
}

export interface LeaderboardEntry {
  model: AIModel;
  totalRuns: number;
  successfulRuns: number;
  successRate: number;
  trend: Trend;
  rank: number;
}

export interface ComparisonCell {
  testCaseId: string;
  modelId: string;
  isCorrect: boolean;
  successRate: number;
  status?: "success" | "failed" | "error" | "timeout";
  /** From latest run: model's extracted answer (for answer popup) */
  parsedAnswer?: string;
  /** From latest run: raw API response (optional, for answer popup) */
  rawResponse?: string;
}
