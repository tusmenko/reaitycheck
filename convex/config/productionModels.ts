/**
 * Production model set for ReAIity Checker benchmark runs.
 *
 * Sourced from: github.com/petergpt/bullshit-benchmark (present_in_config: true)
 * Covers frontier + APAC longtail providers as of 2026-03.
 *
 * All model IDs are OpenRouter identifiers (provider/model-name format).
 */
export const PRODUCTION_MODELS: Array<{ apiId: string }> = [
  // Anthropic
  { apiId: "anthropic/claude-3-haiku" },
  { apiId: "anthropic/claude-3.5-haiku" },
  { apiId: "anthropic/claude-3.5-sonnet" },
  { apiId: "anthropic/claude-3.7-sonnet" },
  { apiId: "anthropic/claude-3.7-sonnet:thinking" },
  { apiId: "anthropic/claude-haiku-4.5" },
  { apiId: "anthropic/claude-opus-4" },
  { apiId: "anthropic/claude-opus-4.1" },
  { apiId: "anthropic/claude-opus-4.5" },
  { apiId: "anthropic/claude-opus-4.6" },
  { apiId: "anthropic/claude-sonnet-4" },
  { apiId: "anthropic/claude-sonnet-4.5" },
  { apiId: "anthropic/claude-sonnet-4.6" },

  // OpenAI
  { apiId: "openai/gpt-5" },
  { apiId: "openai/gpt-5-chat" },
  { apiId: "openai/gpt-5-codex" },
  { apiId: "openai/gpt-5.1" },
  { apiId: "openai/gpt-5.1-chat" },
  { apiId: "openai/gpt-5.1-codex" },
  { apiId: "openai/gpt-5.2" },
  { apiId: "openai/gpt-oss-120b" },
  { apiId: "openai/o4-mini" },

  // Google
  { apiId: "google/gemini-2.0-flash-001" },
  { apiId: "google/gemini-2.5-flash" },
  { apiId: "google/gemini-2.5-pro" },
  { apiId: "google/gemini-3-flash-preview" },
  { apiId: "google/gemini-3-pro-preview" },
  { apiId: "google/gemini-3.1-pro-preview" },
  { apiId: "google/gemma-3-27b-it" },

  // Frontier / other Western labs
  { apiId: "mistralai/mistral-large-2512" },
  { apiId: "prime-intellect/intellect-3" },
  { apiId: "x-ai/grok-4.1-fast" },

  // APAC longtail
  { apiId: "baidu/ernie-4.5-300b-a47b" },
  { apiId: "bytedance-seed/seed-1.6" },
  { apiId: "deepseek/deepseek-v3.2" },
  { apiId: "minimax/minimax-m2.5" },
  { apiId: "moonshotai/kimi-k2.5" },
  { apiId: "qwen/qwen3.5-397b-a17b" },
  { apiId: "xiaomi/mimo-v2-flash" },
  { apiId: "z-ai/glm-5" },
];
