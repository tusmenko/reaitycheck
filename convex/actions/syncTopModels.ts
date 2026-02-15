"use node";

import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { TOP_PAID_MODELS } from "../config/topPaidModels";
import { TOP_FREE_MODELS } from "../config/topFreeModels";

/**
 * Helper function to extract provider from API identifier
 * Format: "provider/model-name" -> "provider"
 */
function extractProvider(apiIdentifier: string): string {
  const parts = apiIdentifier.split("/");
  return parts[0] || "unknown";
}

/**
 * Helper function to generate slug from API identifier
 * Format: "provider/model-name:free" -> "provider-model-name-free"
 * Example: "meta-llama/llama-3.3-70b-instruct:free" -> "meta-llama-llama-3-3-70b-instruct-free"
 */
function generateSlug(apiIdentifier: string): string {
  return apiIdentifier
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Parse API pricing/value to a finite number. Returns undefined for missing,
 * empty, or invalid data so we never store NaN in the database.
 */
function parseFiniteNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }
  const n = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Type definitions for sync results
 */
type SyncResultSuccess = {
  apiId: string;
  rank: number;
  isFree: boolean;
  action: "inserted" | "updated";
  id: unknown;
};

type SyncResultError = {
  apiId: string;
  error: string;
};

type SyncResult = SyncResultSuccess | SyncResultError;

/**
 * Public action to sync top models from OpenRouter API
 * Fetches full metadata and upserts to database
 */
export const syncTopModelsFromOpenRouter = action({
  args: {
    modelList: v.optional(
      v.union(v.literal("free"), v.literal("paid"), v.literal("all"))
    ),
  },
  handler: async (ctx, args) => {
    // Determine which models to sync
    const listToSync =
      args.modelList ??
      (process.env.SYNC_MODEL_LIST as "free" | "paid" | "all" | undefined) ??
      "all";

    let modelsToSync: Array<{ apiId: string; rank: number }> = [];
    if (listToSync === "free") {
      modelsToSync = [...TOP_FREE_MODELS];
    } else if (listToSync === "paid") {
      modelsToSync = [...TOP_PAID_MODELS];
    } else {
      modelsToSync = [...TOP_FREE_MODELS, ...TOP_PAID_MODELS];
    }

    console.log(
      `Syncing ${modelsToSync.length} models (list: ${listToSync})...`
    );

    // Fetch all models from OpenRouter API
    let apiData;
    try {
      const response = await fetch("https://openrouter.ai/api/v1/models");
      if (!response.ok) {
        throw new Error(
          `OpenRouter API error: ${response.status} ${response.statusText}`
        );
      }
      apiData = await response.json();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return {
        summary: {
          listSynced: listToSync,
          total: 0,
          inserted: 0,
          updated: 0,
          errors: modelsToSync.length,
          free: 0,
          paid: 0,
        },
        results: modelsToSync.map((m) => ({
          apiId: m.apiId,
          error: `Failed to fetch from OpenRouter API: ${errorMessage}`,
        })),
      };
    }

    // Sync each model in the list
    const results: SyncResult[] = [];
    for (const topModel of modelsToSync) {
      const model = apiData.data.find(
        (m: { id: string }) => m.id === topModel.apiId
      );

      if (!model) {
        results.push({
          apiId: topModel.apiId,
          error: "Model not found in OpenRouter API",
        });
        continue;
      }

      try {
        const inputCostPerToken = parseFiniteNumber(
          model.pricing?.prompt ?? model.pricing?.input
        );
        const outputCostPerToken = parseFiniteNumber(
          model.pricing?.completion ?? model.pricing?.output
        );
        const isFree = (inputCostPerToken ?? 0) === 0;
        const provider = extractProvider(model.id);
        const slug = generateSlug(model.id);

        const result = await ctx.runMutation(
          internal.mutations.syncModels.upsertModel,
          {
            apiIdentifier: model.id,
            modelName: model.name,
            provider,
            slug,
            contextWindow: model.context_length || undefined,
            isFree,
            inputCostPer1MTokens:
              inputCostPerToken != null
                ? inputCostPerToken * 1_000_000
                : undefined,
            outputCostPer1MTokens:
              outputCostPerToken != null
                ? outputCostPerToken * 1_000_000
                : undefined,
            maxCompletionTokens:
              model.top_provider?.max_completion_tokens ?? undefined,
            description: model.description || undefined,
            openRouterCreatedAt: model.created
              ? new Date(model.created * 1000).getTime()
              : undefined,
          }
        );

        results.push({
          apiId: topModel.apiId,
          rank: topModel.rank,
          isFree,
          ...result,
        });
      } catch (error: unknown) {
        results.push({
          apiId: topModel.apiId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Calculate summary statistics
    const summary = {
      listSynced: listToSync,
      total: results.length,
      inserted: results.filter(
        (r): r is SyncResultSuccess => "action" in r && r.action === "inserted"
      ).length,
      updated: results.filter(
        (r): r is SyncResultSuccess => "action" in r && r.action === "updated"
      ).length,
      errors: results.filter((r): r is SyncResultError => "error" in r).length,
      free: results.filter(
        (r): r is SyncResultSuccess => "isFree" in r && r.isFree === true
      ).length,
      paid: results.filter(
        (r): r is SyncResultSuccess => "isFree" in r && r.isFree === false
      ).length,
    };

    console.log("Sync complete:", summary);

    return { summary, results };
  },
});
