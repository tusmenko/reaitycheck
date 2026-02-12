# ReAIity Checker - Implementation Plan

**Version**: 2.0
**Last Updated**: February 12, 2026
**Target Timeline**: 6-7 weeks
**Based on**: Technical Specification v1.0
**Approach**: UI-first with mock data, then progressive backend integration

---

## Table of Contents

1. [Pre-Implementation Checklist](#pre-implementation-checklist)
2. [Phase 1: Project Setup](#phase-1-project-setup-done)
3. [Phase 2: Landing Page UI (Mock Data)](#phase-2-landing-page-ui-mock-data)
4. [Phase 3: API Endpoints (Mock Data)](#phase-3-api-endpoints-mock-data)
5. [Phase 4: Database & Schema (Convex)](#phase-4-database--schema-convex)
6. [Phase 5: Wire API to Convex](#phase-5-wire-api-to-convex)
7. [Phase 6: Core Validators](#phase-6-core-validators)
8. [Phase 7: Test Execution Engine](#phase-7-test-execution-engine)
9. [Phase 8: Cron Automation](#phase-8-cron-automation)
10. [Phase 9: Detail Pages & Polish](#phase-9-detail-pages--polish)
11. [Testing Checklist](#testing-checklist)
12. [Launch Checklist](#launch-checklist)

---

## Pre-Implementation Checklist

### Accounts & Access
- [x] GitHub account ready
- [x] Vercel account created
- [x] Convex account created
- [x] API keys obtained:
  - [x] OpenRouter API key (https://openrouter.ai/keys)

### Local Environment
- [x] Node.js 18+ installed
- [x] Git installed
- [x] VS Code (or preferred editor)
- [x] pnpm installed

### Cost Planning
- [ ] Budget determined ($30-50/month recommended for MVP)
- [ ] API spending limits set with providers
- [ ] Monitoring plan established

---

## Phase 1: Project Setup (DONE)

- [x] Next.js 16 project initialized (App Router, TypeScript, Tailwind 4)
- [x] shadcn/ui installed (new-york style, all required components)
- [x] Convex initialized and connected
- [x] Dependencies installed (convex, openai, date-fns, zod, recharts)
- [x] Directory structure created
- [x] Git repository set up
- [x] tsconfig path alias fixed (`@/*` → `./*`)
- [x] `convex/schema.ts` written
- [x] App builds and runs successfully

---

## Phase 2: Landing Page UI (Mock Data)

> Build the full landing page using hardcoded mock data. No API calls, no Convex — just static UI that looks complete.

### Task 2.1: Create Mock Data File

**File**: `lib/mock-data.ts`

Define TypeScript types and hardcoded arrays for test cases, AI models, and test runs that match the Convex schema shape. Include realistic mock results so the UI looks populated.

Types needed:
```typescript
interface MockTestCase {
  _id: string;
  name: string;
  slug: string;
  category: string;
  prompt: string;
  expectedAnswer: string;
  explanation?: string;
  validationType: string;
  validationConfig?: { ... };
  memenessScore: number;
  tags: string[];
  difficulty?: string;
  isActive: boolean;
}

interface MockAIModel {
  _id: string;
  provider: string;
  modelName: string;
  modelVersion?: string;
  apiIdentifier: string;
  contextWindow?: number;
  costPer1kTokens?: number;
  isActive: boolean;
}

interface MockTestRun {
  _id: string;
  testCaseId: string;
  modelId: string;
  executedAt: number;
  status: string;
  rawResponse: string;
  parsedAnswer?: string;
  isCorrect: boolean;
  executionTimeMs: number;
  tokensUsed?: { prompt: number; completion: number; total: number };
  costUsd?: number;
  temperature: number;
  maxTokens: number;
}
```

Include all 10 test cases, all 6 AI models, and ~60 mock test runs (one per model per test) with plausible results.

### Task 2.2: Create Custom UI Components

Build reusable components that the landing page needs:

- `components/custom/MemenessStars.tsx` — Star rating display (1-5)
- `components/custom/DataFreshnessIndicator.tsx` — Shows when data was last updated
- `components/custom/TrendIndicator.tsx` — Up/down/stable trend arrow

### Task 2.3: Build Landing Page Sections

**File**: `app/page.tsx`

Build as a server component (or client component if needed for interactivity) importing mock data directly:

**Sections (top to bottom):**
1. **Hero** — Title, subtitle, key stats (models tracked, tests run, last updated)
2. **Leaderboard** — Ranked model cards with success rate, provider badge, trend
3. **Quick Comparison Grid** — Test cases × Models matrix showing pass/fail
4. **The Tests** — Card grid of all active test cases with category badge, memeness stars, difficulty
5. **Methodology** — Brief explanation of approach
6. **Footer** — Links, credits

Use shadcn components: Card, Badge, Table, Separator, Tabs.

### Task 2.4: Responsive Design & Dark Mode

Ensure all sections work on mobile and respect dark mode (Tailwind `dark:` classes).

**Checkpoint**:
- ✅ Landing page renders with realistic-looking data
- ✅ All sections present and styled
- ✅ Responsive on mobile
- ✅ No API calls — pure static/mock data
- ✅ App builds successfully

---

## Phase 3: API Endpoints (Mock Data)

> Define the API shape and return mock data. This locks in the contract between frontend and backend.

### Task 3.1: Create API Types

**File**: `lib/types.ts`

Extract shared types used by both API responses and frontend. These should match the Convex schema but without Convex-specific ID types.

### Task 3.2: Leaderboard API

**File**: `app/api/leaderboard/route.ts`

```
GET /api/leaderboard
Response: Array of { model, totalRuns, successfulRuns, successRate, avgExecutionTimeMs }
```

Returns mock leaderboard data sorted by success rate.

### Task 3.3: Test Cases API

**File**: `app/api/tests/route.ts`

```
GET /api/tests
GET /api/tests?category=character_counting&active=true
Response: Array of test cases
```

### Task 3.4: Models API

**File**: `app/api/models/route.ts`

```
GET /api/models
GET /api/models?provider=openai&active=true
Response: Array of AI models
```

### Task 3.5: Quick Comparison API

**File**: `app/api/comparison/route.ts`

```
GET /api/comparison
Response: Matrix of { testId, modelId, isCorrect, successRate }
```

### Task 3.6: Refactor Landing Page to Use API

Update `app/page.tsx` to fetch from API endpoints instead of importing mock data directly. Use `fetch()` in server components or SWR/React Query in client components.

**Checkpoint**:
- ✅ All API endpoints return well-shaped mock data
- ✅ Landing page fetches from APIs
- ✅ Same visual result as Phase 2
- ✅ API contract is locked in

---

## Phase 4: Database & Schema (Convex)

> Set up Convex schema, seed data, and queries to replace mock data.

### Task 4.1: Deploy Schema

`convex/schema.ts` is already written. Deploy it:

```bash
npx convex dev
```

### Task 4.2: Create Seed Data Files

**File**: `convex/seeds/testCases.ts` — All 10 test cases from spec (fix hallucinationValidator typo)
**File**: `convex/seeds/aiModels.ts` — All 6 AI models with OpenRouter identifiers

### Task 4.3: Create Seed Function

**File**: `convex/functions/seed.ts`

```typescript
import { mutation } from "../_generated/server";
import { testCases } from "../seeds/testCases";
import { aiModels } from "../seeds/aiModels";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    for (const testCase of testCases) {
      await ctx.db.insert("testCases", testCase);
    }
    for (const model of aiModels) {
      await ctx.db.insert("aiModels", model);
    }
    return { testCasesAdded: testCases.length, modelsAdded: aiModels.length };
  },
});
```

### Task 4.4: Create Convex Queries

**File**: `convex/functions/queries.ts`

- `getTestCases` — Filter by category, isActive
- `getTestCaseBySlug` — Single test by slug
- `getModels` — Filter by provider, isActive
- `getModelById` — Single model by ID

**File**: `convex/functions/analytics.ts`

- `getLeaderboard` — Aggregated model stats
- `getQuickComparison` — Test × Model matrix
- `getLastTestRun` — Most recent run timestamp

**File**: `convex/functions/mutations.ts`

- `createTestRun` — Store a test execution result

### Task 4.5: Seed the Database

```bash
npx convex run functions/seed:seedDatabase
```

Verify data in Convex dashboard.

**Checkpoint**:
- ✅ Schema deployed
- ✅ Seed data loaded (10 test cases, 6 models)
- ✅ Queries work in Convex dashboard
- ✅ All indexes created

---

## Phase 5: Wire API to Convex

> Replace mock data in API endpoints with real Convex queries.

### Task 5.1: Set Up ConvexHttpClient

Create a shared Convex HTTP client for use in API routes:

```typescript
import { ConvexHttpClient } from "convex/browser";
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
```

### Task 5.2: Update Each API Endpoint

Replace mock data imports with Convex queries in each route handler. The API response shape should remain identical — only the data source changes.

### Task 5.3: Seed Mock Test Runs

To keep the UI populated, create a one-time seed of mock test runs in Convex (same data that was in `lib/mock-data.ts` but inserted via mutation). This ensures the leaderboard and comparison grid have data.

### Task 5.4: Verify End-to-End

Landing page should look identical but now reads from Convex.

**Checkpoint**:
- ✅ All APIs read from Convex
- ✅ Landing page unchanged visually
- ✅ Mock test runs seeded
- ✅ Real-time updates work (if using Convex React hooks)

---

## Phase 6: Core Validators

> Implement the validation logic that checks AI model responses.

### Task 6.1: Validator Types

**File**: `lib/validators/types.ts`

```typescript
export interface ValidatorResult {
  isCorrect: boolean;
  parsedAnswer: string;
  confidence?: number;
  reasoning?: string;
  metadata?: Record<string, any>;
}

export interface ValidationConfig {
  acceptableAnswers?: string[];
  caseSensitive?: boolean;
  customValidatorName?: string;
}
```

### Task 6.2: Basic Validators

**File**: `lib/validators/index.ts`

- `exact_match` — Compare against acceptable answers
- `contains` — Check if response contains expected string
- `regex` — Match against regex pattern
- `custom` — Dispatch to custom validator by name

### Task 6.3: Custom Validators

**File**: `lib/validators/custom/index.ts`

- `hallucinationValidator` — Check if model admits lack of knowledge
- `epistemicHumilityValidator` — Check if model admits uncertainty
- `selfReferenceValidator` — Check if claimed letter count matches actual
- `instructionFollowingValidator` — Check 10 specific instruction criteria

**Checkpoint**:
- ✅ All validator types implemented
- ✅ Can validate responses independently
- ✅ Custom validators handle edge cases

---

## Phase 7: Test Execution Engine

> Connect to OpenRouter and run real tests against AI models.

### Task 7.1: OpenRouter Client

**File**: `lib/ai-providers/types.ts` — GenerateOptions, TokenUsage, AIResponse interfaces
**File**: `lib/ai-providers/openrouter.ts` — OpenRouterClient class using OpenAI SDK
**File**: `lib/ai-providers/index.ts` — Singleton factory

### Task 7.2: Test Runner

**File**: `lib/test-runner/index.ts`

Takes a model and test case, calls OpenRouter, validates response, returns result ready for Convex insertion.

### Task 7.3: Test Run API

**File**: `app/api/test/run/route.ts`

```
POST /api/test/run (requires x-api-key header)
Body: { modelId?: string }
```

Runs all active tests against specified model (or all active models). Stores results in Convex.

### Task 7.4: Status API

**File**: `app/api/test/status/route.ts`

```
GET /api/test/status
```

Returns last run timestamp and status.

### Task 7.5: First Real Test Run

Trigger a manual test run and verify results in Convex dashboard. Compare with mock data to ensure validators work correctly.

**Checkpoint**:
- ✅ OpenRouter client working
- ✅ Can run single test manually
- ✅ Results stored in Convex
- ✅ Validators working with real AI responses
- ✅ Cost calculation accurate

---

## Phase 8: Cron Automation

> Set up daily automated test runs.

### Task 8.1: Cron Endpoint

**File**: `app/api/cron/trigger-all-tests/route.ts`

```
POST /api/cron/trigger-all-tests (requires Bearer CRON_SECRET)
```

Calls the test/run endpoint for all active models.

### Task 8.2: Vercel Cron Config

**File**: `vercel.json`

```json
{
  "crons": [
    {
      "path": "/api/cron/trigger-all-tests",
      "schedule": "0 3 * * *"
    }
  ]
}
```

### Task 8.3: Delete Mock Test Runs

Once real test data is flowing, remove the seeded mock test runs from Convex.

**Checkpoint**:
- ✅ Cron endpoint responds
- ✅ Can trigger manually with curl
- ✅ vercel.json configured
- ✅ Real data replacing mock data

---

## Phase 9: Detail Pages & Polish

### Task 9.1: Test Detail Page

**File**: `app/tests/[slug]/page.tsx`

- Test description and prompt
- Pass/fail results per model
- Historical trend chart (Recharts)
- Raw response viewer

### Task 9.2: Model Detail Page

**File**: `app/models/[id]/page.tsx`

- Model info card
- Pass/fail results per test
- Overall success rate trend
- Cost tracking

### Task 9.3: Loading States

Use shadcn Skeleton components for all data-dependent sections.

### Task 9.4: SEO & Meta Tags

Proper metadata for all pages.

### Task 9.5: Error Boundaries

Error handling UI for failed data fetches.

### Task 9.6: Deploy to Vercel

```bash
git push origin main
vercel --prod
```

Set environment variables in Vercel dashboard.

**Checkpoint**:
- ✅ Detail pages working
- ✅ Charts rendering
- ✅ Loading/error states
- ✅ SEO tags
- ✅ Deployed to production
- ✅ Cron verified

---

## Testing Checklist

### Unit Tests
- [ ] Validators work correctly
- [ ] AI clients handle errors
- [ ] Cost calculation accurate

### Integration Tests
- [ ] API endpoints respond correctly
- [ ] Data flows from Convex to UI
- [ ] Cron triggers work

### E2E Tests
- [ ] Landing page loads
- [ ] Test detail pages load
- [ ] Model detail pages load
- [ ] Links work

### Manual Testing
- [ ] Mobile responsive
- [ ] Cross-browser compatible
- [ ] Fast load times
- [ ] No console errors

---

## Launch Checklist

### Pre-Launch
- [ ] All critical bugs fixed
- [ ] Performance optimized
- [ ] SEO meta tags added
- [ ] Analytics configured
- [ ] Monitoring set up

### Launch Day
- [ ] Final deployment
- [ ] Smoke tests pass
- [ ] Cron verified
- [ ] Share with small group
- [ ] Gather initial feedback

### Post-Launch
- [ ] Monitor errors
- [ ] Track costs
- [ ] Collect user feedback
- [ ] Plan improvements

---

## Estimated Time Breakdown

| Phase | Effort Level | Status |
|-------|-------------|--------|
| Phase 1: Setup | Low | DONE |
| Phase 2: Landing Page (Mock) | Medium | Next |
| Phase 3: API (Mock) | Medium | |
| Phase 4: Database (Convex) | Medium | |
| Phase 5: Wire API to Convex | Low | |
| Phase 6: Validators | High | |
| Phase 7: Test Engine | High | |
| Phase 8: Cron | Medium | |
| Phase 9: Detail Pages & Polish | Medium | |

---

## Tips for Success

1. **UI first**: Get the page looking right before worrying about data
2. **Mock everything**: Realistic mock data catches UI issues early
3. **Lock the API contract**: Once APIs are defined, frontend and backend can evolve independently
4. **Test early**: Don't wait until the end to test
5. **Monitor costs**: Check API usage daily once real tests are running
6. **Deploy early**: Deploy to staging as soon as Phase 2 is done
7. **Stay focused**: Avoid scope creep
