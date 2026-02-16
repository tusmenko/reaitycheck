import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

/**
 * Internal mutation to upsert a single model
 * - If model exists (by apiIdentifier): UPDATE metadata, PRESERVE isActive
 * - If model is new: INSERT with isActive=false
 */
export const upsertModel = internalMutation({
  args: {
    apiIdentifier: v.string(),
    modelName: v.string(),
    provider: v.string(),
    slug: v.string(),
    contextWindow: v.optional(v.number()),
    isFree: v.boolean(),
    inputCostPer1MTokens: v.optional(v.number()),
    outputCostPer1MTokens: v.optional(v.number()),
    maxCompletionTokens: v.optional(v.number()),
    description: v.optional(v.string()),
    openRouterCreatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Look up existing model by apiIdentifier
    const existing = await ctx.db
      .query("aiModels")
      .withIndex("by_api_identifier", (q) =>
        q.eq("apiIdentifier", args.apiIdentifier)
      )
      .first();

    const updatedAt = Date.now();

    if (existing) {
      // UPDATE: Preserve isActive, update all metadata
      await ctx.db.patch(existing._id, {
        modelName: args.modelName,
        provider: args.provider,
        slug: args.slug,
        contextWindow: args.contextWindow,
        isFree: args.isFree,
        inputCostPer1MTokens: args.inputCostPer1MTokens,
        outputCostPer1MTokens: args.outputCostPer1MTokens,
        maxCompletionTokens: args.maxCompletionTokens,
        description: args.description,
        openRouterCreatedAt: args.openRouterCreatedAt,
        syncedFromOpenRouter: true,
        updatedAt,
      });
      return { action: "updated" as const, id: existing._id };
    }

    // INSERT: New model starts as inactive
    const id = await ctx.db.insert("aiModels", {
      ...args,
      isActive: false,
      syncedFromOpenRouter: true,
      updatedAt,
    });
    return { action: "inserted" as const, id };
  },
});
