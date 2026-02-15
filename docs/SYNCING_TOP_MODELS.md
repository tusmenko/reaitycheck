# Syncing Top Models from OpenRouter

This document explains how to sync the top-ranked models from OpenRouter into the Convex database.

## Overview

The ReAIity Checker tracks and benchmarks top AI models based on actual usage data from OpenRouter. This semi-automatic workflow allows you to:

1. Manually update model rankings (weekly/monthly)
2. Automatically fetch full metadata from OpenRouter API
3. Sync models to the database while preserving user preferences
4. Control costs by manually activating only desired models

## Architecture

### Files

- **`convex/config/topPaidModels.ts`** - Top-10 paid models by usage ranking
- **`convex/config/topFreeModels.ts`** - Top-10 free models (manually curated)
- **`convex/mutations/syncModels.ts`** - Database upsert mutation
- **`convex/actions/syncTopModels.ts`** - OpenRouter API sync action
- **`scripts/sync-top-models.ts`** - CLI script for running syncs

### Database Schema

New fields added to `aiModels` table:

- `updatedAt` - Unix timestamp for tracking sync freshness
- `syncedFromOpenRouter` - Flag indicating if model was synced from rankings
- `isFree` - Boolean indicating free tier (pricing.prompt == "0")
- `openRouterCreatedAt` - Model creation timestamp from OpenRouter
- `inputCostPer1MTokens` - Granular input cost
- `outputCostPer1MTokens` - Output cost
- `maxCompletionTokens` - Max completion tokens from OpenRouter
- `description` - Model capabilities summary

## Workflow

### 1. Update Rankings (Manual - Weekly/Monthly)

Visit [OpenRouter Rankings](https://openrouter.ai/rankings) and copy the current top-10 models.

Update `convex/config/topPaidModels.ts`:

```typescript
export const TOP_PAID_MODELS = [
  { apiId: "anthropic/claude-sonnet-4.5", rank: 1 },
  { apiId: "google/gemini-3-flash-preview", rank: 2 },
  // ... update based on current rankings
] as const;
```

For free models, update `convex/config/topFreeModels.ts` based on context window or capabilities.

### 2. Run Sync Script

**Development (Free Models)**
```bash
pnpm run sync-models              # Uses SYNC_MODEL_LIST env (default: free)
pnpm run sync-models -- --free    # Explicitly sync only free models
```

**Production (Paid Models)**
```bash
pnpm run sync-models:prod         # Uses SYNC_MODEL_LIST env (default: paid)
pnpm run sync-models:prod -- --paid  # Explicitly sync only paid models
```

**All Models**
```bash
pnpm run sync-models -- --all     # Sync both free and paid models
```

### 3. Activate Models (Manual - Convex Dashboard)

After sync, all new models have `isActive: false` by default.

1. Open [Convex Dashboard](https://dashboard.convex.dev)
2. Navigate to `aiModels` table
3. Find the synced models (`syncedFromOpenRouter: true`)
4. Set `isActive: true` for models you want to test
5. **Important**: Only activate models you can afford to test (all top-10 are paid!)

### 4. Verify Sync Results

The sync script outputs:

```
✅ Sync complete!
   List synced: free
   Total models: 10
   ├─ Inserted: 3 (new models)
   ├─ Updated: 7 (existing models)
   ├─ Free: 10
   ├─ Paid: 0
   └─ Errors: 0

📋 Synced models:
   [NEW] [FREE] qwen/qwen3-coder:free
   [UPD] [FREE] deepseek/deepseek-r1-0528:free
   ...
```

## Upsert Logic

The sync uses smart upsert logic:

- **New models**: Inserted with `isActive: false` (cost protection)
- **Existing models**: Metadata updated, `isActive` flag **preserved**

This ensures:
- User activation choices are never overwritten
- Fresh metadata is always synced
- No unexpected cost increases from auto-activation

## Environment Configuration

### Development (`.env.local`)

```bash
SYNC_MODEL_LIST=free  # Dev tests free models (safe, no cost)
```

### Production (`.env.prod`)

```bash
SYNC_MODEL_LIST=paid  # Prod tests top paid models (real-world benchmarking)
```

## Cost Considerations

⚠️ **CRITICAL**: All top-10 ranked models are PAID (not free tier).

- New models default to `isActive: false`
- You must manually activate models in Convex dashboard
- Monitor costs carefully when activating paid models
- Consider starting with 2-3 models, then expanding

**Example costs (per 1M input tokens):**
- Claude Sonnet 4.5: $3.00
- Gemini 3 Flash: $0.50
- DeepSeek V3.2: $0.25
- Grok Code Fast: $0.20

## Troubleshooting

### Sync Errors

**Model not found in API:**
```
qwen/model-name:free: Model not found in OpenRouter API
```
→ OpenRouter may have removed/renamed the model. Update config file.

**Validation errors:**
```
ArgumentValidationError: Value does not match validator
```
→ OpenRouter API response structure changed. Check mutation validators.

**API rate limiting:**
→ Add exponential backoff retry logic (currently not implemented)

### Environment Issues

**CONVEX_URL not found:**
→ Ensure `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
→ Script automatically loads `.env.local` using dotenv

## Future Enhancements

- [ ] Automated weekly sync via GitHub Actions
- [ ] Web scraping OpenRouter rankings (if API never becomes available)
- [ ] Historical tracking of ranking changes
- [ ] Cost budget alerts when activating expensive models
- [ ] Auto-deactivate models that drop out of top-10
- [ ] Retry logic with exponential backoff for API failures

## Example: Monthly Workflow

1. **First Monday of month:**
   - Visit OpenRouter rankings
   - Update `topPaidModels.ts` with current rankings
   - Update `topFreeModels.ts` if better free models available

2. **Run sync:**
   ```bash
   pnpm run sync-models -- --all
   ```

3. **Review in Convex Dashboard:**
   - Check new models (sorted by `updatedAt`)
   - Review model descriptions and costs
   - Activate 2-3 most interesting new models

4. **Monitor test results:**
   - Check landing page for new model performance
   - Compare against existing benchmarks
   - Adjust activation based on cost/value

## Technical Details

### OpenRouter API Structure

The sync fetches from `https://openrouter.ai/api/v1/models`:

```json
{
  "data": [
    {
      "id": "anthropic/claude-sonnet-4.5",
      "name": "Claude Sonnet 4.5",
      "context_length": 200000,
      "pricing": {
        "prompt": "0.000003",
        "completion": "0.000015"
      },
      "top_provider": {
        "max_completion_tokens": 8000
      },
      "description": "Most intelligent model...",
      "created": 1234567890
    }
  ]
}
```

### Convex Action Flow

1. **Load config** - Read `TOP_PAID_MODELS` or `TOP_FREE_MODELS`
2. **Fetch API** - GET `https://openrouter.ai/api/v1/models`
3. **For each model:**
   - Find model in API response by `apiIdentifier`
   - Extract metadata (context, pricing, etc.)
   - Call `upsertModel` mutation
4. **Return summary** - Inserted/updated/error counts

### Database Index

The `by_api_identifier` index enables efficient upsert:

```typescript
.index("by_api_identifier", ["apiIdentifier"])
```

This allows O(log n) lookup for conflict detection instead of full table scan.

## Questions?

- Check the [main README](../README.md) for general setup
- Review [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for overall architecture
- See [OPENROUTER_MODELS.md](./OPENROUTER_MODELS.md) for current model list
