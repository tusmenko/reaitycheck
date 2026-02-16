import { mutation } from "./_generated/server";

/**
 * One-off migrations live here. Run each migration once per deployment (dev and prod)
 * that has old data, then remove or comment out when no longer needed.
 * See docs/deployment.md for schema change process.
 */

/** Remove `difficulty` from all testCases. 
 * Run once per env: npx convex run migrations:removeDifficultyFromTestCases (dev) 
 * or ... --prod (prod). */
export const removeDifficultyFromTestCases = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("testCases").collect();
    let patched = 0;
    for (const doc of docs) {
      if ("difficulty" in doc && doc.difficulty !== undefined) {
        await ctx.db.patch(doc._id, { difficulty: undefined } as Record<string, undefined>);
        patched++;
      }
    }
    return { message: `Removed difficulty from ${patched} of ${docs.length} test cases.` };
  },
});

/** Remove legacy `costPer1kTokens` and `maxTokens` fields from aiModels. 
 * Run once per env: npx convex run migrations:removeLegacyCostFields (dev) or ... --prod (prod). */
export const removeLegacyCostFields = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("aiModels").collect();
    let patched = 0;
    for (const doc of docs) {
      const needsPatch =
        ("costPer1kTokens" in doc && doc.costPer1kTokens !== undefined) ||
        ("maxTokens" in doc && doc.maxTokens !== undefined);

      if (needsPatch) {
        await ctx.db.patch(doc._id, {
          costPer1kTokens: undefined,
          maxTokens: undefined,
        } as Record<string, undefined>);
        patched++;
      }
    }
    return {
      message: `Removed legacy cost fields from ${patched} of ${docs.length} AI models.`,
    };
  },
});
