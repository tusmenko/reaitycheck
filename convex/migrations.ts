import { mutation } from "./_generated/server";

/**
 * One-off migration: remove `difficulty` from all testCases documents.
 * Run once against production after deploying schema with difficulty optional:
 *   npx convex run migrations:removeDifficultyFromTestCases --prod
 * Then remove `difficulty` from schema and this migration, and deploy again.
 */
export const removeDifficultyFromTestCases = mutation({
  args: {},
  handler: async (ctx) => {
    const docs = await ctx.db.query("testCases").collect();
    let patched = 0;
    for (const doc of docs) {
      if ("difficulty" in doc && doc.difficulty !== undefined) {
        await ctx.db.patch(doc._id, { difficulty: undefined });
        patched++;
      }
    }
    return { message: `Removed difficulty from ${patched} of ${docs.length} test cases.` };
  },
});
