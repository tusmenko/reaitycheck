/**
 * Top 10 most-used PAID models from OpenRouter rankings
 * Updated from: https://openrouter.ai/rankings
 * Last updated: 2026-02-15
 *
 * These models are ranked by actual usage (tokens processed).
 * Update this file when rankings change (recommended: weekly/monthly).
 */
export const TOP_PAID_MODELS = [
  { apiId: "anthropic/claude-sonnet-4.5", rank: 1 },
  { apiId: "google/gemini-3-flash-preview", rank: 2 },
  { apiId: "moonshotai/kimi-k2.5", rank: 3 },
  { apiId: "deepseek/deepseek-v3.2", rank: 4 },
  { apiId: "google/gemini-2.5-flash-preview-09-2025", rank: 5 },
  { apiId: "x-ai/grok-code-fast-1", rank: 6 },
  { apiId: "x-ai/grok-4.1-fast", rank: 7 },
  { apiId: "anthropic/claude-opus-4.5", rank: 8 },
  { apiId: "google/gemini-2.5-flash-lite", rank: 9 },
  { apiId: "minimax/minimax-m2.1", rank: 10 },
] as const;
