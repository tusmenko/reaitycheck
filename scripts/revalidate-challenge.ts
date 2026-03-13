/**
 * Re-run validation only for a specific challenge (without re-running the challenge itself).
 *
 * Usage:
 *   pnpm run revalidate <test-slug>
 *   pnpm run revalidate -- --prod <test-slug>
 *
 * Example:
 *   pnpm run revalidate strawberry-problem
 *   pnpm run revalidate self-reference-count
 */

import { ConvexHttpClient } from "convex/browser";
import { config } from "dotenv";
import { api } from "../convex/_generated/api";

const args = process.argv.slice(2);
const isProd = args.includes("--prod");
config({ path: isProd ? ".env.prod" : ".env.local" });

const testSlugArg = args.filter((a) => !a.startsWith("--")).pop();

if (!testSlugArg) {
  console.error("Usage: pnpm run revalidate <test-slug>");
  console.error("       pnpm run revalidate -- --prod <test-slug>");
  process.exit(1);
}

const testSlug: string = testSlugArg;

const deploymentUrl = isProd
  ? process.env.CONVEX_PROD_URL || process.env.NEXT_PUBLIC_CONVEX_URL
  : process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;

if (!deploymentUrl) {
  console.error("Error: CONVEX_URL not found in environment");
  console.error(
    "Make sure you have a .env.local file with CONVEX_URL or NEXT_PUBLIC_CONVEX_URL"
  );
  process.exit(1);
}

const client = new ConvexHttpClient(deploymentUrl);

type RevalidateResult = {
  testSlug: string;
  revalidated: number;
  skipped: number;
  changed: number;
  results: Array<{
    model: string;
    previousResult: boolean;
    newResult: boolean;
    changed: boolean;
  }>;
};

async function main() {
  const environment = isProd ? "PRODUCTION" : "DEVELOPMENT";
  console.log(`\nRevalidating challenge "${testSlug}" on ${environment}...`);
  console.log(`Deployment: ${deploymentUrl}\n`);

  try {
    const result = (await client.action(
      api.actions.revalidateChallenge.revalidateChallenge,
      { testSlug }
    )) as RevalidateResult;

    console.log("\nResults:");
    console.log("─".repeat(70));

    for (const r of result.results) {
      const prev = r.previousResult ? "PASS" : "FAIL";
      const next = r.newResult ? "PASS" : "FAIL";
      const marker = r.changed ? " <<< CHANGED" : "";
      console.log(`  ${r.model.padEnd(40)} ${prev} -> ${next}${marker}`);
    }

    console.log("─".repeat(70));
    console.log(`  Revalidated: ${result.revalidated}`);
    console.log(`  Skipped:     ${result.skipped}`);
    console.log(`  Changed:     ${result.changed}`);
    console.log();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("\nRevalidation failed:", errorMessage);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
