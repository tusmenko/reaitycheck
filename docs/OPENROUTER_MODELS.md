# OpenRouter Model Identifiers

When using OpenRouter, update your seed data to use OpenRouter's model identifiers.

## Updated aiModels Seed Data

**File**: `convex/seeds/aiModels.ts`

```typescript
export const aiModels = [
  // OpenAI
  {
    provider: "openai",
    modelName: "GPT-4o",
    modelVersion: "2025-01-15",
    apiIdentifier: "openai/gpt-4o",  // OpenRouter format
    contextWindow: 128000,
    costPer1kTokens: 0.005,
    isActive: true,
  },
  {
    provider: "openai",
    modelName: "GPT-4o-mini",
    modelVersion: "2025-01-15",
    apiIdentifier: "openai/gpt-4o-mini",  // OpenRouter format
    contextWindow: 128000,
    costPer1kTokens: 0.00015,
    isActive: true,
  },

  // Anthropic
  {
    provider: "anthropic",
    modelName: "Claude Opus 4.5",
    modelVersion: "20251101",
    apiIdentifier: "anthropic/claude-opus-4.5",  // OpenRouter format
    contextWindow: 200000,
    costPer1kTokens: 0.015,
    isActive: true,
  },
  {
    provider: "anthropic",
    modelName: "Claude Sonnet 4.5",
    modelVersion: "20250929",
    apiIdentifier: "anthropic/claude-sonnet-4.5",  // OpenRouter format
    contextWindow: 200000,
    costPer1kTokens: 0.003,
    isActive: true,
  },

  // Google
  {
    provider: "google",
    modelName: "Gemini 2.0 Flash",
    modelVersion: "exp-0205",
    apiIdentifier: "google/gemini-2.0-flash-exp",  // OpenRouter format
    contextWindow: 1048576,
    costPer1kTokens: 0.0,  // Check OpenRouter pricing
    isActive: true,
  },

  // Meta (Llama via OpenRouter)
  {
    provider: "meta",
    modelName: "Llama 3.3 70B",
    modelVersion: "versatile",
    apiIdentifier: "meta-llama/llama-3.3-70b-instruct",  // OpenRouter format
    contextWindow: 8000,
    costPer1kTokens: 0.00059,
    isActive: true,
  },
];
```

## Key Changes

1. **Model Identifiers**: All `apiIdentifier` fields now use OpenRouter's format: `provider/model-name`

2. **Exact Model Names**: Check [OpenRouter's models page](https://openrouter.ai/models) for exact identifiers:
   - Some models may have different names than provider APIs
   - Version numbers may be included in the identifier
   - Always verify the exact string from OpenRouter docs

3. **Pricing**: OpenRouter has its own pricing which may differ from direct API pricing:
   - Check [OpenRouter pricing](https://openrouter.ai/models) for accurate costs
   - Update `costPer1kTokens` accordingly
   - Note: OpenRouter typically adds a small markup

## Benefits of OpenRouter

1. **Unified API**: Single SDK for all providers
2. **Automatic Fallbacks**: Can configure fallback models
3. **Rate Limit Handling**: Built-in retry logic
4. **Cost Tracking**: Unified billing and usage tracking
5. **Easy Model Addition**: Add new models without code changes
6. **Provider Abstraction**: No need to maintain multiple SDK integrations

## Usage in Code

With OpenRouter, your test runner becomes much simpler:

```typescript
// Single client for all models
const client = getOpenRouterClient();

// Same API for every model
const response = await client.generate(
  "openai/gpt-4o",     // Just pass the identifier
  "Your prompt here",
  { temperature: 0.7, maxTokens: 500 }
);
```

## Important Notes

1. **Model Availability**: Not all models may be available on OpenRouter at all times
2. **Rate Limits**: OpenRouter has its own rate limits separate from provider limits
3. **Pricing**: Always check current OpenRouter pricing as it can change
4. **Credits**: OpenRouter uses a credit system - make sure to add credits to your account

## Getting Started

1. Sign up at [OpenRouter](https://openrouter.ai)
2. Get your API key from [Keys page](https://openrouter.ai/keys)
3. Add credits to your account
4. Use the model identifiers from [Models page](https://openrouter.ai/models)

## Recommended Models for Testing

These models are well-supported on OpenRouter:

- `openai/gpt-4o` - Latest GPT-4o
- `anthropic/claude-3.5-sonnet` - Fast and capable
- `google/gemini-2.0-flash-exp` - Fast and cheap
- `meta-llama/llama-3.3-70b-instruct` - Open source option
- `qwen/qwen-2.5-72b-instruct` - Alternative option

Check the models page for the most current list and identifiers.
