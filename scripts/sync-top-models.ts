/* eslint-disable max-len */
/**
 * Sync top models from OpenRouter rankings to Convex database
 *
 * Usage:
 *   pnpm run sync-models                       # Sync based on SYNC_MODEL_LIST env (dev: free, prod: paid)
 *   pnpm run sync-models -- --free             # Sync only free models
 *   pnpm run sync-models -- --paid             # Sync only paid models
 *   pnpm run sync-models -- --all              # Sync both free and paid
 *   pnpm run sync-models -- --production       # Sync full production set (40 models)
 *   pnpm run sync-models:prod                  # Sync paid models to production Convex
 *   pnpm run sync-models:production            # Sync production model set to production Convex
 */

import { ConvexHttpClient } from "convex/browser";
import { config } from "dotenv";
import { api } from "../convex/_generated/api";

// Load environment variables — prod uses .env.prod, dev uses .env.local
const args = process.argv.slice(2);
const isProd = args.includes("--prod");
config({ path: isProd ? ".env.prod" : ".env.local" });

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

type SyncSummary = {
  listSynced: string;
  total: number;
  inserted: number;
  updated: number;
  errors: number;
  free: number;
  paid: number;
};

type SyncResponse = {
  summary: SyncSummary;
  results: SyncResult[];
};

const modelListFlag = args
  .find((arg) => ["--free", "--paid", "--all", "--production"].includes(arg))
  ?.slice(2) as "free" | "paid" | "all" | "production" | undefined;

// Determine deployment URL
const deploymentUrl = isProd
  ? process.env.CONVEX_PROD_URL || process.env.NEXT_PUBLIC_CONVEX_URL
  : process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("❌ Error: CONVEX_URL not found in environment");
  console.error(
    "Make sure you have a .env.local file with CONVEX_URL or NEXT_PUBLIC_CONVEX_URL"
  );
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

async function main() {
  const environment = isProd ? "PRODUCTION" : "DEVELOPMENT";
  console.log(`\n🔄 Syncing models to ${environment}...`);
  console.log(`   Deployment: ${deploymentUrl}\n`);

  try {
    const result = (await client.action(
      api.actions.syncTopModels.syncTopModelsFromOpenRouter,
      {
        modelList: modelListFlag,
      }
    )) as SyncResponse;

    console.log("✅ Sync complete!\n");
    console.log(`   List synced: ${result.summary.listSynced}`);
    console.log(`   Total models: ${result.summary.total}`);
    console.log(`   ├─ Inserted: ${result.summary.inserted} (new models)`);
    console.log(`   ├─ Updated: ${result.summary.updated} (existing models)`);
    console.log(`   ├─ Free: ${result.summary.free}`);
    console.log(`   ├─ Paid: ${result.summary.paid}`);
    console.log(`   └─ Errors: ${result.summary.errors}`);

    // Show error details if any
    const errors = result.results.filter(
      (r): r is SyncResultError => "error" in r
    );
    if (errors.length > 0) {
      console.log("\n❌ Errors:");
      errors.forEach((r) => {
        console.log(`   ${r.apiId}: ${r.error}`);
      });
    }

    // Show successful syncs
    if (result.summary.inserted > 0 || result.summary.updated > 0) {
      console.log("\n📋 Synced models:");
      result.results
        .filter((r): r is SyncResultSuccess => "action" in r)
        .forEach((r) => {
          const action = r.action === "inserted" ? "NEW" : "UPD";
          const cost = r.isFree ? "FREE" : "PAID";
          console.log(`   [${action}] [${cost}] ${r.apiId}`);
        });
    }

    console.log(
      "\n💡 Tip: New models are inactive by default."
      + " Activate them in Convex dashboard to include in tests.\n"
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("\n❌ Sync failed:", errorMessage);
    if (error instanceof Error && error.stack) {
      console.error("\nStack trace:", error.stack);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
