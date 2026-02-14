export type Provider = "openai" | "anthropic" | "google" | "meta" | "deepseek" | "alibaba" | "mistral";
export type Difficulty = "easy" | "medium" | "hard";
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
  difficulty: Difficulty;
  isActive: boolean;
}

export interface AIModel {
  _id: string;
  provider: Provider;
  modelName: string;
  modelVersion: string;
  apiIdentifier: string;
  slug?: string;
  contextWindow: number;
  costPer1kTokens: number;
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
