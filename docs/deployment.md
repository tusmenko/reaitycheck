# Deployment

## Why production Convex schema didn’t update

Convex **validates all existing documents** when you push a schema. If any document doesn’t match the new schema, **the push fails** and production is not updated.

So when we removed the `difficulty` column from `testCases` in code:

1. CI ran `npx convex deploy` on push to `main`.
2. Convex tried to apply the new schema (no `difficulty`) to the production deployment.
3. Production still had documents with a `difficulty` field → validation failed → **deploy step failed**.
4. Production schema (and backend) stayed on the old version.

The app build can also fail if it or Convex codegen ever validates against the deployed schema; the root cause is still that **production was never updated** because the deploy step failed.

## What was missing in the process

1. **Schema migrations are not automatic**  
   Pushing a breaking schema change (like removing a required/used field) without migrating existing data will cause `convex deploy` to fail. Production only updates when deploy **succeeds**.

2. **Deploy failure must be visible**  
   In CI, the `deploy-production` job runs in parallel with `lint-typecheck-build-test`. If `npx convex deploy` fails, that job fails; the workflow may still be red from the build job. Ensure the **Deploy Convex to Production** step is required and that you check its logs when the workflow fails.

3. **Safe way to remove a field** (Convex docs):
   - Make the field **optional** in the schema and deploy (existing data still valid).
   - Run a **one-off migration** that removes the field from all documents (e.g. `ctx.db.patch(id, { field: undefined })`).
   - **Remove the field** from the schema and deploy again.

## Unblocking production: `difficulty` migration

We’ve added back `difficulty` as **optional** in `convex/schema.ts` and a one-off migration in `convex/migrations.ts`.

**Steps:**

1. **Deploy current code (schema with optional `difficulty`)**  
   Push to `main` and let CI run, or run locally:
   ```bash
   npx convex deploy --cmd-url-env-var CONVEX_DEPLOYMENT
   ```
   (Use your production deploy key / env so it targets production.)

2. **Run the migration once against production**  
   From the repo root, with production Convex env (e.g. `CONVEX_DEPLOY_KEY` or prod deployment selected):
   ```bash
   npx convex run migrations:removeDifficultyFromTestCases --prod
   ```

3. **Remove `difficulty` from the schema again**  
   In `convex/schema.ts`, delete the `difficulty: v.optional(v.number())` line (and the comment above it).

4. **Deploy again**  
   Push to `main` (or run `npx convex deploy` to production). Schema push will succeed because no document has `difficulty` anymore.

5. **Optional cleanup**  
   Remove or comment out `removeDifficultyFromTestCases` from `convex/migrations.ts` so it isn’t run again.

## CI: Convex deploy on `main`

- **Secret**: `CONVEX_DEPLOY_KEY` (repository secret).  
  Create in [Convex dashboard](https://dashboard.convex.dev) → your production deployment → Deployment Settings → Deploy key.

- **Variable**: `CONVEX_DEPLOYMENT` (optional; can be set in the Production environment for the deploy job).

- The `deploy-production` job in [.github/workflows/ci.yml](../.github/workflows/ci.yml) runs only on **push to `main`** and runs `npx convex deploy`.  
  Production schema and functions update **only when this step succeeds**.

## Checklist for future schema changes

- **Adding a field**: Usually safe; add as optional if existing rows might not have it, then backfill and optionally make required.
- **Removing a field**: Make it optional → deploy → migrate (remove from all documents) → remove from schema → deploy.
- **Changing a field type**: Use the same kind of multi-step process (e.g. add new optional field, migrate, then remove old field).
- After any such change, confirm in the Convex dashboard that the production deployment’s schema and data look correct.
