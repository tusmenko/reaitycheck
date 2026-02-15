/**
 * Top 10 FREE models (by context window or usage, as available)
 * Free models have pricing.prompt == "0" in OpenRouter API
 * Last updated: 2026-02-15
 *
 * These are manually curated based on:
 * - Context window size (larger is better for complex tasks)
 * - Model capabilities (reasoning, coding, etc.)
 * - Community usage and reputation
 */
export const TOP_FREE_MODELS = [
  { apiId: "qwen/qwen3-next-80b-a3b-instruct:free", rank: 1 },
  { apiId: "qwen/qwen3-coder:free", rank: 2 },
  { apiId: "stepfun/step-3.5-flash:free", rank: 3 },
  { apiId: "nvidia/nemotron-3-nano-30b-a3b:free", rank: 4 },
  { apiId: "deepseek/deepseek-r1-0528:free", rank: 5 },
  { apiId: "arcee-ai/trinity-mini:free", rank: 6 },
  { apiId: "meta-llama/llama-3.3-70b-instruct:free", rank: 7 },
  { apiId: "google/gemma-3-27b-it:free", rank: 8 },
  { apiId: "mistralai/mistral-small-3.1-24b-instruct:free", rank: 9 },
  { apiId: "openai/gpt-oss-120b:free", rank: 10 },
] as const;
