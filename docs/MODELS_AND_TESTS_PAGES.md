# Add Test Detail + Model Detail Pages

## Context

The landing page is complete. Now we need two detail pages:

- **Test detail** (`/test/[slug]`) — test as a "Breaker" persona: how good is this test at breaking models
- **Model detail** (`/model/[provider]/[slug]`) — model resilience view: how well it withstands the breakers

The fun "Breaker" language applies only to detail pages; the landing page stays neutral.

---

## Routes

| Route | Description |
|-------|-------------|
| `/test/[slug]` | Dynamic route using `testCases.slug` (e.g. `/test/strawberry-problem`) |
| `/model/[provider]/[slug]` | Dynamic route using a slugified model identifier (e.g. `/model/meta/llama-3.3-70b-instruct-free`) |

We need a slug field on `aiModels` or derive it from `modelName`. Simplest: derive from `apiIdentifier` or add a `slug` to seed data.

---

## New Convex Queries (`convex/queries.ts`)

### `getTestBySlug`

- **Args:** `{ slug: string }`
- Uses `by_slug` index
- Returns single test case

### `getModelBySlug`

- **Args:** `{ slug: string }`
- Uses `by_slug` index (or `apiIdentifier` as fallback)
- Returns single model

### `getTestBreakdown`

- **Args:** `{ testCaseId: Id<"testCases"> }`
- For each active model: get latest run result, total runs, success rate
- **Returns:** `{ model, latestRun, totalRuns, successRate }[]`
- Sorted by success rate ASC (most broken first = "top victims")

### `getModelBreakdown`

- **Args:** `{ modelId: Id<"aiModels"> }`
- For each active test: get latest run result, total runs, success rate
- **Returns:** `{ test, latestRun, totalRuns, successRate }[]`
- Sorted by success rate ASC (hardest breakers first)

---

## Pages

### `/test/[slug]/page.tsx` — "The Breaker" page

**Hero section:**

- Test name as big heading, category badge, difficulty badge, memeness stars
- Fun subtitle: e.g. "This breaker cracked 3 out of 5 models"
- The prompt in a styled code block

**Stats row (3–4 cards):**

- **Break Rate** — % of models that failed (inverse of success rate across models)
- **Models Cracked** — count of models that failed latest run
- **Difficulty** — easy/medium/hard badge
- **Virality** — memeness score as stars

**Victims table:**

- Table of all models sorted by how badly they failed
- Columns: Model | Latest Result (pass/fail icon) | Break Rate | Raw Response (expandable/dialog)
- Link model names to `/model/[provider]/[slug]`

**"Why It Matters" section:**

- `test.explanation` text
- Expected answer shown

---

### `/model/[provider]/[slug]/page.tsx` — "Model Resilience" page

**Hero section:**

- Model name, provider badge
- Subtitle: "Survived X out of Y breakers" (resilience framing)
- Key specs: context window, cost, max tokens

**Stats row (3–4 cards):**

- **Resilience Score** — overall success rate as %
- **Tests Survived** — count of passed tests (latest run)
- **Tests Failed** — count of failed tests
- **Avg Response Time** — average execution time

**Breaker Results table:**

- All tests sorted by success rate ASC (hardest breakers first = "Top Breakers")
- Columns: Test Name | Category | Difficulty | Latest Result | Success Rate | Raw Response
- Link test names to `/test/[slug]`

**"Toughest Breakers" highlight:**

- Top 3 tests this model consistently fails at, shown as cards

---

### `/model/[provider]/page.tsx` — Provider overview

- Placeholder for now (e.g. list of models by provider, link back to home).

---

## Files to Create / Modify

### Create

- `app/test/[slug]/page.tsx` — test detail page (SSR with `preloadQuery`)
- `app/model/[provider]/page.tsx` — provider detail page (placeholder for now)
- `app/model/[provider]/[slug]/page.tsx` — model detail page (SSR with `preloadQuery`)
- `components/detail/test-detail-page.tsx` — client component
- `components/detail/model-detail-page.tsx` — client component

### Modify

- `convex/queries.ts` — add `getTestBySlug`, `getModelBySlug`, `getTestBreakdown`, `getModelBreakdown`
- `convex/schema.ts` — add `slug` field to `aiModels` (optional `v.string()`)
- `convex/seeds/aiModels.ts` — add slug values
- `convex/seed.ts` — include slug in model seeding
- `components/landing/tests-section.tsx` — link test cards to `/test/[slug]`
- `components/landing/leaderboard-section.tsx` — link model names to `/model/[provider]/[slug]`
- `components/landing/comparison-grid-section.tsx` — link test and model names

---

## Verification

1. Deploy new queries: `npx convex dev --once`
2. If schema changed, re-seed: `npx convex run seed:clearAll && npx convex run seed:seedDatabase`
3. Run dev server: `pnpm dev` — navigate to `/test/strawberry-problem` and `/model/meta/llama-3.3-70b-instruct-free`
4. Verify: data loads, links work from landing page, real-time updates work
