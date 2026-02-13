# ReAIity Checker - Technical Specification v1.0

**Date**: February 12, 2026  
**Status**: MVP Specification  
**Project**: AI Model Limitation Tracker

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Features Specification](#features-specification)
7. [Seed Data Structure](#seed-data-structure)
8. [UI Components](#ui-components)
9. [Development Roadmap](#development-roadmap)
10. [Deployment](#deployment)

---

## Project Overview

### Purpose

ReAIity Checker is a transparency tool that tracks real-world AI model limitations through daily automated testing of viral failure cases.

### Core Principles

- **Focus on memetic failures**: Tests based on well-known AI failure modes
- **Daily automated testing**: Consistent, unbiased evaluation
- **Full transparency**: Show raw responses, not just scores
- **Version tracking**: Monitor if models improve/regress over time

### Target Audience

- Developers choosing AI models for projects
- ML engineers tracking industry progress
- Researchers studying AI limitations
- AI enthusiasts and transparency advocates

---

## Tech Stack

### Frontend & Backend

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: shadcn/ui charts (Recharts wrapper)

### Database & Backend Services

- **Database**: Convex
  - Real-time subscriptions
  - TypeScript-native queries
  - Built-in scheduling support

### Deployment

- **Hosting**: Vercel
- **Cron Jobs**: Vercel Cron
- **Database**: Convex (managed)

### AI Provider SDKs

- OpenAI SDK (GPT-4o, GPT-4o-mini)
- Anthropic SDK (Claude Opus 4.5, Claude Sonnet 4.5)
- Google Generative AI SDK (Gemini 2.0 Flash)
- Groq SDK or Together AI (Llama 3.3 70B)

---

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Hosting                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              Next.js Application                │    │
│  │                                                 │    │
│  │  Frontend (React):                              │    │
│  │  ├─ / (Landing page - one-pager)               │    │
│  │  ├─ /tests/[slug] (Test detail)                │    │
│  │  ├─ /models/[id] (Model detail)                │    │
│  │  └─ Uses Convex useQuery hooks (real-time)     │    │
│  │                                                 │    │
│  │  Backend (API Routes):                          │    │
│  │  ├─ /api/cron/trigger-all-tests                │    │
│  │  ├─ /api/test/run (with optional modelId)      │    │
│  │  ├─ /api/test/status (public)                  │    │
│  │  └─ Calls AI provider APIs                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  Vercel Cron (Daily 3am UTC)                            │
│  └─> Triggers /api/cron/trigger-all-tests               │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Convex Client SDK
                          │
┌─────────────────────────▼───────────────────────────────┐
│                   Convex Database                        │
│                                                          │
│  Tables:                                                 │
│  ├─ testCases                                           │
│  ├─ aiModels                                            │
│  └─ testRuns                                            │
│                                                          │
│  Functions:                                              │
│  ├─ Queries (read data)                                 │
│  ├─ Mutations (write data)                              │
│  └─ Actions (external API calls)                        │
└──────────────────────────────────────────────────────────┘
```

### Data Flow: Daily Test Execution

```
1. Vercel Cron (3am UTC)
   ↓
2. POST /api/cron/trigger-all-tests
   ↓
3. For each active model:
   ├─ POST /api/test/run { modelId: "gpt-4o" }
   ├─ Load all active test cases from Convex
   ├─ For each test:
   │  ├─ Call AI provider API with prompt
   │  ├─ Get response
   │  ├─ Validate answer
   │  └─ Store result in Convex (testRuns table)
   └─ Return summary
   ↓
4. Frontend auto-updates via Convex real-time subscriptions
```

---

## Database Schema

### Convex Tables

#### Table: `testCases`

```typescript
{
  _id: Id<"testCases">,
  _creationTime: number,
  
  // Identification
  name: string,              // "Strawberry Problem"
  slug: string,              // "strawberry-problem" (unique)
  category: string,          // "character_counting" | "logic_reasoning" | etc.
  
  // Test content
  prompt: string,            // The actual question to ask the AI
  expectedAnswer: string,    // What the correct answer is
  explanation?: string,      // Why this test matters
  
  // Validation
  validationType: string,    // "exact_match" | "contains" | "regex" | "custom"
  validationConfig?: {       // Configuration for validation
    acceptableAnswers?: string[],
    caseSensitive?: boolean,
    customValidatorName?: string,
  },
  
  // Metadata
  memenessScore: number,     // 1-5 (how viral/famous this failure is)
  tags: string[],            // ["viral", "tokenization", "counting"]
  difficulty?: string,       // "easy" | "medium" | "hard"
  isActive: boolean,         // Whether to run this test
}
```

**Indexes:**

- `by_slug` on `slug` (unique)
- `by_category` on `category`
- `by_active` on `isActive`

---

#### Table: `aiModels`

```typescript
{
  _id: Id<"aiModels">,
  _creationTime: number,
  
  // Identification
  provider: string,          // "openai" | "anthropic" | "google" | "meta"
  modelName: string,         // "GPT-4o"
  modelVersion?: string,     // "2025-01-15"
  apiIdentifier: string,     // "gpt-4o" (what to pass to API)
  
  // Specifications
  contextWindow?: number,    // 128000
  costPer1kTokens?: number,  // 0.005 (in USD)
  
  // Configuration
  isActive: boolean,         // Whether to test this model
  
  // API Configuration (stored securely in env vars, not here)
  // providerApiKey is in environment variables
}
```

**Indexes:**

- `by_provider` on `provider`
- `by_active` on `isActive`
- `by_provider_and_name` on `(provider, modelName)`

---

#### Table: `testRuns`

```typescript
{
  _id: Id<"testRuns">,
  _creationTime: number,
  
  // References
  testCaseId: Id<"testCases">,
  modelId: Id<"aiModels">,
  
  // Execution details
  executedAt: number,        // timestamp
  status: string,            // "success" | "failed" | "error" | "timeout"
  
  // Results
  rawResponse: string,       // The actual AI response
  parsedAnswer?: string,     // Extracted answer from response
  isCorrect: boolean,        // Did it pass validation?
  
  // Performance metrics
  executionTimeMs: number,   // How long the API call took
  tokensUsed?: {
    prompt: number,
    completion: number,
    total: number,
  },
  costUsd?: number,          // Calculated cost
  
  // Error handling
  errorMessage?: string,     // If status === "error"
  
  // Test parameters
  temperature: number,       // 0.7 (what we used)
  maxTokens: number,         // 500 (what we used)
}
```

**Indexes:**

- `by_test_case` on `testCaseId`
- `by_model` on `modelId`
- `by_executed_at` on `executedAt`
- `by_test_and_model` on `(testCaseId, modelId)`

---

### Convex Queries

#### `getTestCases`

```typescript
export const getTestCases = query({
  args: { 
    category?: v.optional(v.string()),
    isActive?: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("testCases");
    
    if (args.category) {
      query = query.filter(q => q.eq(q.field("category"), args.category));
    }
    if (args.isActive !== undefined) {
      query = query.filter(q => q.eq(q.field("isActive"), args.isActive));
    }
    
    return await query.collect();
  },
});
```

#### `getTestCaseBySlug`

```typescript
export const getTestCaseBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testCases")
      .withIndex("by_slug", q => q.eq("slug", args.slug))
      .unique();
  },
});
```

#### `getModels`

```typescript
export const getModels = query({
  args: { 
    provider?: v.optional(v.string()),
    isActive?: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("aiModels");
    
    if (args.provider) {
      query = query.filter(q => q.eq(q.field("provider"), args.provider));
    }
    if (args.isActive !== undefined) {
      query = query.filter(q => q.eq(q.field("isActive"), args.isActive));
    }
    
    return await query.collect();
  },
});
```

#### `getTestRunsForTest`

```typescript
export const getTestRunsForTest = query({
  args: { 
    testCaseId: v.id("testCases"),
    limit?: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("testRuns")
      .withIndex("by_test_case", q => q.eq("testCaseId", args.testCaseId))
      .order("desc") // newest first
      .take(args.limit || 50);
    
    // Hydrate with model info
    return Promise.all(runs.map(async run => ({
      ...run,
      model: await ctx.db.get(run.modelId),
    })));
  },
});
```

#### `getTestRunsForModel`

```typescript
export const getTestRunsForModel = query({
  args: { 
    modelId: v.id("aiModels"),
    limit?: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const runs = await ctx.db
      .query("testRuns")
      .withIndex("by_model", q => q.eq("modelId", args.modelId))
      .order("desc")
      .take(args.limit || 50);
    
    // Hydrate with test case info
    return Promise.all(runs.map(async run => ({
      ...run,
      testCase: await ctx.db.get(run.testCaseId),
    })));
  },
});
```

#### `getLeaderboard`

```typescript
export const getLeaderboard = query({
  handler: async (ctx) => {
    const models = await ctx.db.query("aiModels")
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
    
    const stats = await Promise.all(models.map(async model => {
      const runs = await ctx.db
        .query("testRuns")
        .withIndex("by_model", q => q.eq("modelId", model._id))
        .filter(q => q.neq(q.field("status"), "error"))
        .collect();
      
      const totalRuns = runs.length;
      const successfulRuns = runs.filter(r => r.isCorrect).length;
      const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
      
      return {
        model,
        totalRuns,
        successfulRuns,
        successRate,
        avgExecutionTimeMs: runs.reduce((sum, r) => sum + r.executionTimeMs, 0) / totalRuns,
      };
    }));
    
    return stats.sort((a, b) => b.successRate - a.successRate);
  },
});
```

#### `getTestStatistics`

```typescript
export const getTestStatistics = query({
  args: { testCaseId: v.id("testCases") },
  handler: async (ctx, args) => {
    const models = await ctx.db.query("aiModels")
      .filter(q => q.eq(q.field("isActive"), true))
      .collect();
    
    const stats = await Promise.all(models.map(async model => {
      const runs = await ctx.db
        .query("testRuns")
        .withIndex("by_test_and_model", q => 
          q.eq("testCaseId", args.testCaseId).eq("modelId", model._id)
        )
        .filter(q => q.neq(q.field("status"), "error"))
        .collect();
      
      const totalRuns = runs.length;
      const successfulRuns = runs.filter(r => r.isCorrect).length;
      const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
      const latestRun = runs[0]; // assuming sorted by date desc
      
      return {
        model,
        totalRuns,
        successRate,
        latestRun,
      };
    }));
    
    return stats;
  },
});
```

---

### Convex Mutations

#### `createTestRun`

```typescript
export const createTestRun = mutation({
  args: {
    testCaseId: v.id("testCases"),
    modelId: v.id("aiModels"),
    status: v.string(),
    rawResponse: v.string(),
    parsedAnswer: v.optional(v.string()),
    isCorrect: v.boolean(),
    executionTimeMs: v.number(),
    tokensUsed: v.optional(v.object({
      prompt: v.number(),
      completion: v.number(),
      total: v.number(),
    })),
    costUsd: v.optional(v.number()),
    errorMessage: v.optional(v.string()),
    temperature: v.number(),
    maxTokens: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testRuns", {
      ...args,
      executedAt: Date.now(),
    });
  },
});
```

---

## API Endpoints

### Public Endpoints

#### `GET /api/test/status`

**Description**: Get current testing status and recent results

**Response**:

```typescript
{
  lastRunAt: string | null,           // ISO timestamp
  currentlyRunning: boolean,
  modelsInProgress: string[],         // ["gpt-4o", "claude-opus-4.5"]
  lastRunResults: {
    modelId: string,
    modelName: string,
    testsRun: number,
    successes: number,
    failures: number,
    errors: number,
  }[],
}
```

**Example**:

```bash
curl https://realitychecker.vercel.app/api/test/status
```

---

### Protected Endpoints (API Key Required)

#### `POST /api/test/run`

**Description**: Run tests for a specific model or all models

**Headers**:

```
x-api-key: <YOUR_SECRET_API_KEY>
```

**Request Body**:

```typescript
{
  modelId?: string,  // Optional: if provided, test only this model
}
```

**Response**:

```typescript
{
  success: boolean,
  message: string,
  results: {
    modelId: string,
    modelName: string,
    testsRun: number,
    successes: number,
    failures: number,
    errors: number,
    executionTimeMs: number,
  }[],
}
```

**Example**:

```bash
# Test all models
curl -X POST https://realitychecker.vercel.app/api/test/run \
  -H "x-api-key: secret123"

# Test specific model
curl -X POST https://realitychecker.vercel.app/api/test/run \
  -H "x-api-key: secret123" \
  -H "Content-Type: application/json" \
  -d '{"modelId":"gpt-4o"}'
```

---

### Cron Endpoints (Vercel Cron Only)

#### `POST /api/cron/trigger-all-tests`

**Description**: Triggered daily by Vercel Cron to run all tests

**Authorization**: Vercel Cron Secret (automatic)

**Logic**:

1. Get all active models from Convex
2. For each model, call `/api/test/run` with that modelId
3. Return summary

**Response**:

```typescript
{
  success: boolean,
  modelsProcessed: number,
  totalTests: number,
  timestamp: string,
}
```

---

## Features Specification

### Feature 1: Test Case Library

**Pages**:

- Embedded in landing page (scrollable section)
- Individual test pages: `/tests/[slug]`

**Components**:

#### Test Card Component

```tsx
interface TestCardProps {
  test: {
    name: string;
    slug: string;
    category: string;
    memenessScore: number;
    prompt: string;
  };
}

// Displays:
// - Test name
// - Category badge
// - Memeness stars (⭐⭐⭐⭐⭐)
// - Brief preview of prompt
// - Click → navigate to /tests/[slug]
```

#### Test Grid/List

```tsx
// On landing page
<section id="tests">
  <h2>The Tests</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {tests.map(test => <TestCard key={test.slug} test={test} />)}
  </div>
</section>
```

---

### Feature 2: Model Registry

**Display**: Shown on landing page and model detail pages

**Components**:

#### Model Card Component

```tsx
interface ModelCardProps {
  model: {
    provider: string;
    modelName: string;
    modelVersion?: string;
    contextWindow?: number;
    costPer1kTokens?: number;
  };
}

// Displays:
// - Provider logo/badge
// - Model name + version
// - Quick specs (context window, cost)
// - Click → navigate to /models/[id]
```

#### Models Section on Landing Page

```tsx
<section id="models">
  <h2>Models Tested</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
    {models.map(model => <ModelCard key={model._id} model={model} />)}
  </div>
</section>
```

---

### Feature 3: Automated Daily Testing

**Implementation**:

#### Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/trigger-all-tests",
      "schedule": "0 3 * * *"
    }
  ]
}
```

#### Test Execution Logic

```typescript
// app/api/test/run/route.ts
export async function POST(request: Request) {
  // 1. Verify API key
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.API_SECRET_KEY) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // 2. Parse request
  const { modelId } = await request.json();
  
  // 3. Get models to test
  const models = modelId 
    ? [await convex.query(api.models.getById, { id: modelId })]
    : await convex.query(api.models.getModels, { isActive: true });
  
  // 4. Get active test cases
  const testCases = await convex.query(api.tests.getTestCases, { isActive: true });
  
  // 5. Run tests
  const results = [];
  for (const model of models) {
    const modelResults = await runTestsForModel(model, testCases);
    results.push(modelResults);
  }
  
  return Response.json({ success: true, results });
}

async function runTestsForModel(model, testCases) {
  const results = {
    modelId: model._id,
    modelName: model.modelName,
    testsRun: 0,
    successes: 0,
    failures: 0,
    errors: 0,
  };
  
  for (const testCase of testCases) {
    try {
      const startTime = Date.now();
      
      // Call AI API
      const response = await callAIProvider(model, testCase.prompt);
      
      const executionTimeMs = Date.now() - startTime;
      
      // Validate response
      const { isCorrect, parsedAnswer } = validateResponse(
        response.content,
        testCase.expectedAnswer,
        testCase.validationType,
        testCase.validationConfig
      );
      
      // Store result in Convex
      await convex.mutation(api.testRuns.createTestRun, {
        testCaseId: testCase._id,
        modelId: model._id,
        status: 'success',
        rawResponse: response.content,
        parsedAnswer,
        isCorrect,
        executionTimeMs,
        tokensUsed: response.usage,
        costUsd: calculateCost(response.usage, model.costPer1kTokens),
        temperature: 0.7,
        maxTokens: 500,
      });
      
      results.testsRun++;
      if (isCorrect) results.successes++;
      else results.failures++;
      
    } catch (error) {
      // Store error result
      await convex.mutation(api.testRuns.createTestRun, {
        testCaseId: testCase._id,
        modelId: model._id,
        status: 'error',
        rawResponse: '',
        isCorrect: false,
        executionTimeMs: 0,
        errorMessage: error.message,
        temperature: 0.7,
        maxTokens: 500,
      });
      
      results.errors++;
    }
  }
  
  return results;
}
```

#### AI Provider Client Factory

```typescript
// lib/ai-providers/factory.ts
export function getAIClient(model: AIModel) {
  switch (model.provider) {
    case 'openai':
      return new OpenAIClient(process.env.OPENAI_API_KEY!, model.apiIdentifier);
    case 'anthropic':
      return new AnthropicClient(process.env.ANTHROPIC_API_KEY!, model.apiIdentifier);
    case 'google':
      return new GoogleClient(process.env.GOOGLE_API_KEY!, model.apiIdentifier);
    case 'meta':
      return new GroqClient(process.env.GROQ_API_KEY!, model.apiIdentifier);
    default:
      throw new Error(`Unknown provider: ${model.provider}`);
  }
}

async function callAIProvider(model: AIModel, prompt: string) {
  const client = getAIClient(model);
  return await client.generate(prompt, {
    temperature: 0.7,
    maxTokens: 500,
  });
}
```

#### Validation Functions

```typescript
// lib/validators/index.ts
export function validateResponse(
  response: string,
  expectedAnswer: string,
  validationType: string,
  config?: ValidationConfig
): { isCorrect: boolean; parsedAnswer: string } {
  switch (validationType) {
    case 'exact_match':
      return exactMatchValidator(response, expectedAnswer, config);
    case 'contains':
      return containsValidator(response, expectedAnswer, config);
    case 'regex':
      return regexValidator(response, expectedAnswer, config);
    case 'custom':
      return customValidator(response, expectedAnswer, config);
    default:
      throw new Error(`Unknown validation type: ${validationType}`);
  }
}

function exactMatchValidator(
  response: string,
  expected: string,
  config?: ValidationConfig
) {
  const acceptableAnswers = config?.acceptableAnswers || [expected];
  const caseSensitive = config?.caseSensitive ?? false;
  
  const normalizedResponse = caseSensitive 
    ? response.trim() 
    : response.toLowerCase().trim();
  
  const isCorrect = acceptableAnswers.some(answer => {
    const normalizedAnswer = caseSensitive 
      ? answer.trim() 
      : answer.toLowerCase().trim();
    return normalizedResponse.includes(normalizedAnswer);
  });
  
  return {
    isCorrect,
    parsedAnswer: normalizedResponse,
  };
}

function containsValidator(response: string, expected: string) {
  const isCorrect = response.toLowerCase().includes(expected.toLowerCase());
  return { isCorrect, parsedAnswer: response.trim() };
}

function regexValidator(response: string, pattern: string) {
  const regex = new RegExp(pattern, 'i');
  const isCorrect = regex.test(response);
  return { isCorrect, parsedAnswer: response.trim() };
}

function customValidator(
  response: string,
  expected: string,
  config?: ValidationConfig
) {
  // Load custom validator function by name
  const validatorName = config?.customValidatorName;
  if (!validatorName) {
    throw new Error('Custom validator requires customValidatorName');
  }
  
  // Import custom validators
  const customValidators = require('./custom');
  const validator = customValidators[validatorName];
  
  if (!validator) {
    throw new Error(`Custom validator not found: ${validatorName}`);
  }
  
  return validator(response, expected, config);
}
```

---

### Feature 4: Landing Page (One-Pager)

**Route**: `/`

**Sections** (scrollable):

#### Section 1: Hero + Methodology

```tsx
<section className="hero py-20">
  <h1 className="text-5xl font-bold">
    ReAIity Check: See Where AI Actually Fails
  </h1>
  
  <div className="methodology mt-8 prose">
    <h2>Why This Exists</h2>
    <p>
      AI benchmarks tell you where models excel. 
      We show you where they consistently fail.
    </p>
    
    <h3>Our Approach</h3>
    <ul>
      <li>Test on viral failure cases that matter in practice</li>
      <li>Automated daily testing (no cherry-picking)</li>
      <li>Full transparency (see raw responses)</li>
      <li>Track improvements/regressions over time</li>
    </ul>
    
    <p>
      No hype. No marketing. Just honest data.
    </p>
  </div>
</section>
```

#### Section 2: Quick Comparison Grid

```tsx
<section className="quick-comparison py-16">
  <h2 className="text-3xl font-bold mb-8">The Reality Check</h2>
  
  <ComparisonGrid 
    tests={topMemematicTests}  // 3-5 tests
    models={popularModels}     // 4-6 models
  />
</section>

// ComparisonGrid component
interface ComparisonGridProps {
  tests: TestCase[];
  models: AIModel[];
}

function ComparisonGrid({ tests, models }: ComparisonGridProps) {
  const results = useQuery(api.analytics.getQuickComparison, { 
    testIds: tests.map(t => t._id),
    modelIds: models.map(m => m._id),
  });
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th>Test</th>
            {models.map(model => (
              <th key={model._id}>{model.modelName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tests.map(test => (
            <tr key={test._id}>
              <td className="font-medium">{test.name}</td>
              {models.map(model => {
                const result = results?.find(
                  r => r.testId === test._id && r.modelId === model._id
                );
                return (
                  <td key={model._id} className="text-center">
                    {result?.isCorrect ? '✅' : '❌'}
                    <span className="text-sm text-gray-500 ml-2">
                      {result?.successRate ? 
                        `${(result.successRate * 100).toFixed(0)}%` : 
                        '-'
                      }
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

#### Section 3: Full Comparison Table

```tsx
<section className="full-comparison py-16">
  <h2 className="text-3xl font-bold mb-8">Complete Results</h2>
  
  <FullComparisonTable 
    tests={allTests}
    models={allModels}
  />
</section>

// Interactive table with:
// - Sortable columns
// - Filter by category
// - Click test name → /tests/[slug]
// - Click model name → /models/[id]
```

#### Section 4: About the Tests

```tsx
<section className="about-tests py-16">
  <h2 className="text-3xl font-bold mb-8">The Tests</h2>
  
  <div className="grid md:grid-cols-2 gap-6">
    {testsByCategory.map(category => (
      <CategoryCard key={category.name} category={category} />
    ))}
  </div>
  
  <p className="mt-8 text-center">
    <a href="#tests">View all test details below ↓</a>
  </p>
</section>
```

#### Section 5: Test Details

```tsx
<section id="tests" className="test-details py-16">
  <h2 className="text-3xl font-bold mb-8">Test Details</h2>
  
  <div className="space-y-12">
    {allTests.map(test => (
      <TestDetailCard key={test._id} test={test} />
    ))}
  </div>
</section>

// TestDetailCard shows:
// - Test name, category, memeness score
// - The prompt (with copy button)
// - Expected answer
// - Why it matters
// - Quick model performance preview
// - Link to full test page
```

#### Section 6: Methodology & Data

```tsx
<section className="methodology-data py-16">
  <h2 className="text-3xl font-bold mb-8">How It Works</h2>
  
  <div className="prose max-w-none">
    <h3>Testing Process</h3>
    <ul>
      <li>Tests run automatically every day at 3am UTC</li>
      <li>Each model receives identical prompts</li>
      <li>Responses validated against expected answers</li>
      <li>Results stored with full transparency</li>
    </ul>
    
    <h3>Data Freshness</h3>
    <DataFreshnessIndicator />
    
    <h3>Source Code</h3>
    <p>
      This project is open source. 
      <a href="https://github.com/yourusername/reality-checker">
        View on GitHub
      </a>
    </p>
  </div>
</section>
```

---

### Feature 5: Test Detail Page

**Route**: `/tests/[slug]`

**Layout**:

```tsx
export default function TestDetailPage({ params }: { params: { slug: string } }) {
  const test = useQuery(api.tests.getTestCaseBySlug, { slug: params.slug });
  const statistics = useQuery(api.analytics.getTestStatistics, { 
    testCaseId: test?._id 
  });
  const recentRuns = useQuery(api.testRuns.getTestRunsForTest, { 
    testCaseId: test?._id,
    limit: 20,
  });
  
  if (!test) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto py-12">
      {/* Test Info Section */}
      <TestInfoCard test={test} />
      
      {/* Model Performance Table */}
      <ModelPerformanceTable statistics={statistics} />
      
      {/* Historical Trend Chart */}
      <HistoricalTrendChart testCaseId={test._id} />
      
      {/* Recent Runs */}
      <RecentRunsTimeline runs={recentRuns} />
    </div>
  );
}
```

**Components**:

#### TestInfoCard

```tsx
function TestInfoCard({ test }: { test: TestCase }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{test.name}</CardTitle>
            <Badge>{test.category}</Badge>
          </div>
          <MemenessStars score={test.memenessScore} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">The Prompt</h3>
            <div className="bg-gray-100 p-4 rounded relative">
              <pre className="whitespace-pre-wrap">{test.prompt}</pre>
              <CopyButton text={test.prompt} />
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Expected Answer</h3>
            <p className="text-green-600 font-mono">{test.expectedAnswer}</p>
          </div>
          
          {test.explanation && (
            <div>
              <h3 className="font-semibold mb-2">Why This Matters</h3>
              <p className="text-gray-700">{test.explanation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

#### ModelPerformanceTable

```tsx
function ModelPerformanceTable({ statistics }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Model Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Model</TableHead>
              <TableHead>Latest Result</TableHead>
              <TableHead>Success Rate (7d)</TableHead>
              <TableHead>Total Runs</TableHead>
              <TableHead>Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {statistics?.map(stat => (
              <TableRow key={stat.model._id}>
                <TableCell>
                  <Link href={`/models/${stat.model._id}`}>
                    {stat.model.modelName}
                  </Link>
                </TableCell>
                <TableCell>
                  {stat.latestRun?.isCorrect ? '✅' : '❌'}
                </TableCell>
                <TableCell>
                  {(stat.successRate * 100).toFixed(1)}%
                </TableCell>
                <TableCell>{stat.totalRuns}</TableCell>
                <TableCell>
                  <TrendIndicator trend={stat.trend} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

#### HistoricalTrendChart

```tsx
function HistoricalTrendChart({ testCaseId }) {
  const data = useQuery(api.analytics.getTestTrendData, { testCaseId });
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Success Rate Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {data?.models.map(model => (
              <Line 
                key={model.id}
                type="monotone" 
                dataKey={`model_${model.id}`}
                name={model.name}
                stroke={model.color}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

#### RecentRunsTimeline

```tsx
function RecentRunsTimeline({ runs }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Test Runs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {runs?.map(run => (
            <div key={run._id} className="border-l-4 border-gray-200 pl-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {run.isCorrect ? '✅' : '❌'}
                  </span>
                  <div>
                    <p className="font-medium">{run.model.modelName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(run.executedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Response
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Raw Response</DialogTitle>
                    </DialogHeader>
                    <div className="bg-gray-100 p-4 rounded">
                      <pre className="whitespace-pre-wrap text-sm">
                        {run.rawResponse}
                      </pre>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm">
                        <strong>Parsed Answer:</strong> {run.parsedAnswer}
                      </p>
                      <p className="text-sm">
                        <strong>Execution Time:</strong> {run.executionTimeMs}ms
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

---

### Feature 6: Model Detail Page

**Route**: `/models/[id]`

**Layout**:

```tsx
export default function ModelDetailPage({ params }: { params: { id: string } }) {
  const model = useQuery(api.models.getById, { id: params.id });
  const stats = useQuery(api.analytics.getModelStatistics, { 
    modelId: params.id 
  });
  const testResults = useQuery(api.testRuns.getTestRunsForModel, { 
    modelId: params.id 
  });
  
  if (!model) return <div>Loading...</div>;
  
  return (
    <div className="container mx-auto py-12">
      {/* Model Info Section */}
      <ModelInfoCard model={model} />
      
      {/* Overall Statistics */}
      <OverallStatsCard stats={stats} />
      
      {/* Performance by Test Table */}
      <TestPerformanceTable results={testResults} />
      
      {/* Category Breakdown (optional) */}
      <CategoryBreakdownChart stats={stats} />
      
      {/* Historical Trend Chart */}
      <ModelHistoricalChart modelId={model._id} />
    </div>
  );
}
```

**Components**:

#### ModelInfoCard

```tsx
function ModelInfoCard({ model }: { model: AIModel }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{model.modelName}</CardTitle>
            <p className="text-gray-500">{model.provider}</p>
          </div>
          <Badge variant={model.isActive ? "default" : "secondary"}>
            {model.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {model.modelVersion && (
            <div>
              <p className="text-sm text-gray-500">Version</p>
              <p className="font-mono">{model.modelVersion}</p>
            </div>
          )}
          
          {model.contextWindow && (
            <div>
              <p className="text-sm text-gray-500">Context Window</p>
              <p className="font-mono">
                {model.contextWindow.toLocaleString()} tokens
              </p>
            </div>
          )}
          
          {model.costPer1kTokens && (
            <div>
              <p className="text-sm text-gray-500">Cost per 1K tokens</p>
              <p className="font-mono">${model.costPer1kTokens}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-500">API Identifier</p>
            <p className="font-mono text-sm">{model.apiIdentifier}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### OverallStatsCard

```tsx
function OverallStatsCard({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {(stats?.overallSuccessRate * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Runs</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.totalRuns}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Avg Execution Time</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            {stats?.avgExecutionTimeMs.toFixed(0)}ms
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Total Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">
            ${stats?.totalCostUsd.toFixed(4)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

#### TestPerformanceTable

```tsx
function TestPerformanceTable({ results }) {
  // Group by test
  const byTest = results?.reduce((acc, run) => {
    if (!acc[run.testCase._id]) {
      acc[run.testCase._id] = {
        testCase: run.testCase,
        runs: [],
      };
    }
    acc[run.testCase._id].runs.push(run);
    return acc;
  }, {});
  
  const stats = Object.values(byTest || {}).map(({ testCase, runs }) => {
    const totalRuns = runs.length;
    const successfulRuns = runs.filter(r => r.isCorrect).length;
    const successRate = totalRuns > 0 ? successfulRuns / totalRuns : 0;
    const latestRun = runs[0];
    
    return {
      testCase,
      totalRuns,
      successRate,
      latestRun,
    };
  });
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Performance by Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Latest Result</TableHead>
              <TableHead>Success Rate</TableHead>
              <TableHead>Total Runs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stats.map(stat => (
              <TableRow key={stat.testCase._id}>
                <TableCell>
                  <Link href={`/tests/${stat.testCase.slug}`}>
                    {stat.testCase.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{stat.testCase.category}</Badge>
                </TableCell>
                <TableCell>
                  {stat.latestRun?.isCorrect ? '✅' : '❌'}
                </TableCell>
                <TableCell>
                  {(stat.successRate * 100).toFixed(1)}%
                </TableCell>
                <TableCell>{stat.totalRuns}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
```

---

## Seed Data Structure

### File Organization

```
convex/
├── schema.ts
├── seeds/
│   ├── index.ts
│   ├── testCases.ts
│   └── aiModels.ts
└── functions/
    └── seed.ts
```

### testCases.ts

```typescript
// convex/seeds/testCases.ts
export const testCases = [
  {
    name: "Strawberry Problem",
    slug: "strawberry-problem",
    category: "character_counting",
    prompt: "How many times does the letter 'r' appear in the word 'strawberry'?",
    expectedAnswer: "3",
    explanation: "Tests character-level understanding. Most models fail due to tokenization treating 'strawberry' as a single token.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["3", "three", "Three"],
      caseSensitive: false,
    },
    memenessScore: 5,
    tags: ["viral", "tokenization", "counting"],
    difficulty: "easy",
    isActive: true,
  },
  
  {
    name: "Alice's Brother Problem",
    slug: "alices-brother-problem",
    category: "logic_reasoning",
    prompt: "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?",
    expectedAnswer: "4",
    explanation: "Tests perspective-taking and logic. The correct answer is 4 (Alice + her 3 sisters), not 3.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["4", "four", "Four"],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["logic", "perspective", "family"],
    difficulty: "medium",
    isActive: true,
  },
  
  {
    name: "Self-Reference Count",
    slug: "self-reference-count",
    category: "self_reference",
    prompt: "How many letters are in your answer to this question?",
    expectedAnswer: "variable",
    explanation: "Tests self-awareness and recursive reasoning. Model must count letters in its own response.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "selfReferenceValidator",
    },
    memenessScore: 4,
    tags: ["recursion", "self-awareness", "meta"],
    difficulty: "hard",
    isActive: true,
  },
  
  {
    name: "Fabricated Citations",
    slug: "fabricated-citations",
    category: "hallucinations",
    prompt: "Find me 3 academic papers about the psychological effects of telepathic communication with dolphins published between 2020-2023.",
    expectedAnswer: "no_fabrication",
    explanation: "Tests whether models admit lack of knowledge vs. fabricating plausible-sounding sources.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "hallucinationValidator",
    },
    memenessScore: 5,
    tags: ["hallucination", "confabulation", "dangerous"],
    difficulty: "hard",
    isActive: true,
  },
  
  {
    name: "10-Step Instructions",
    slug: "ten-step-instructions",
    category: "instruction_following",
    prompt: `Please do the following in your response:
1. Start with the word "Hello"
2. Include exactly 3 numbers
3. Use the word "elephant" twice
4. End with a question mark
5. Make it exactly 4 sentences
6. Include one emoji
7. Mention a color
8. Use alliteration in the first sentence
9. Include a movie reference
10. Make the last word "goodbye"`,
    expectedAnswer: "all_instructions_followed",
    explanation: "Tests ability to follow multiple detailed instructions simultaneously.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "instructionFollowingValidator",
    },
    memenessScore: 3,
    tags: ["instructions", "multi-task", "detail"],
    difficulty: "hard",
    isActive: true,
  },
  
  {
    name: "I Don't Know Test",
    slug: "i-dont-know-test",
    category: "epistemic_humility",
    prompt: "What was the color of my grandfather's favorite shirt?",
    expectedAnswer: "admission_of_ignorance",
    explanation: "Tests whether models honestly admit lack of knowledge instead of fabricating plausible answers.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "epistemicHumilityValidator",
    },
    memenessScore: 4,
    tags: ["humility", "honesty", "hallucination"],
    difficulty: "medium",
    isActive: true,
  },
  
  {
    name: "Minute Moment Riddle",
    slug: "minute-moment-riddle",
    category: "pattern_matching",
    prompt: "What can be seen once in a minute, twice in a moment, but never in a thousand years?",
    expectedAnswer: "M",
    explanation: "Classic riddle testing lateral thinking and pattern recognition.",
    validationType: "contains",
    validationConfig: {
      acceptableAnswers: ["M", "letter M", "the letter M"],
      caseSensitive: false,
    },
    memenessScore: 3,
    tags: ["riddle", "lateral-thinking", "classic"],
    difficulty: "easy",
    isActive: true,
  },
  
  {
    name: "Chess Game Tracking",
    slug: "chess-game-tracking",
    category: "state_tracking",
    prompt: "Let's play chess. I'll be black, you be white. Make your first move in standard algebraic notation.",
    expectedAnswer: "valid_first_move",
    explanation: "Tests state tracking across multiple turns. Most models make invalid moves after 5-7 turns.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "chessValidator",
    },
    memenessScore: 3,
    tags: ["chess", "state", "rules"],
    difficulty: "hard",
    isActive: false, // Disabled for MVP (requires multi-turn interaction)
  },
  
  {
    name: "Reverse Word Test",
    slug: "reverse-word-test",
    category: "character_manipulation",
    prompt: "Write the word 'artificial' backwards.",
    expectedAnswer: "laicifitra",
    explanation: "Tests character-level manipulation. Simple task that many models fail.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["laicifitra"],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["reversal", "manipulation", "character"],
    difficulty: "easy",
    isActive: true,
  },
  
  {
    name: "Multi-Step Arithmetic",
    slug: "multi-step-arithmetic",
    category: "multi_step_reasoning",
    prompt: "I had 5 apples. I ate 2. I bought 3 more. I gave half to a friend. How many apples do I have now?",
    expectedAnswer: "3",
    explanation: "Tests multi-step reasoning and arithmetic. Simple steps but models sometimes lose track.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["3", "three", "Three apples"],
      caseSensitive: false,
    },
    memenessScore: 3,
    tags: ["math", "steps", "reasoning"],
    difficulty: "easy",
    isActive: true,
  },
];
```

### aiModels.ts

```typescript
// convex/seeds/aiModels.ts
export const aiModels = [
  // OpenAI
  {
    provider: "openai",
    modelName: "GPT-4o",
    modelVersion: "2025-01-15",
    apiIdentifier: "gpt-4o",
    contextWindow: 128000,
    costPer1kTokens: 0.005,
    isActive: true,
  },
  {
    provider: "openai",
    modelName: "GPT-4o-mini",
    modelVersion: "2025-01-15",
    apiIdentifier: "gpt-4o-mini",
    contextWindow: 128000,
    costPer1kTokens: 0.00015,
    isActive: true,
  },
  
  // Anthropic
  {
    provider: "anthropic",
    modelName: "Claude Opus 4.5",
    modelVersion: "20251101",
    apiIdentifier: "claude-opus-4-5-20251101",
    contextWindow: 200000,
    costPer1kTokens: 0.015,
    isActive: true,
  },
  {
    provider: "anthropic",
    modelName: "Claude Sonnet 4.5",
    modelVersion: "20250929",
    apiIdentifier: "claude-sonnet-4-5-20250929",
    contextWindow: 200000,
    costPer1kTokens: 0.003,
    isActive: true,
  },
  
  // Google
  {
    provider: "google",
    modelName: "Gemini 2.0 Flash",
    modelVersion: "exp-0205",
    apiIdentifier: "gemini-2.0-flash-exp-0205",
    contextWindow: 1048576,
    costPer1kTokens: 0.0,
    isActive: true,
  },
  
  // Meta (via Groq)
  {
    provider: "meta",
    modelName: "Llama 3.3 70B",
    modelVersion: "versatile",
    apiIdentifier: "llama-3.3-70b-versatile",
    contextWindow: 8000,
    costPer1kTokens: 0.00059,
    isActive: true,
  },
];
```

### Seed Script

```typescript
// convex/functions/seed.ts
import { mutation } from "./_generated/server";
import { testCases } from "../seeds/testCases";
import { aiModels } from "../seeds/aiModels";

export const seedDatabase = mutation({
  handler: async (ctx) => {
    // Clear existing data (optional, use with caution)
    // const existingTests = await ctx.db.query("testCases").collect();
    // for (const test of existingTests) {
    //   await ctx.db.delete(test._id);
    // }
    
    // Insert test cases
    console.log("Seeding test cases...");
    for (const testCase of testCases) {
      await ctx.db.insert("testCases", testCase);
    }
    
    // Insert AI models
    console.log("Seeding AI models...");
    for (const model of aiModels) {
      await ctx.db.insert("aiModels", model);
    }
    
    console.log("Seed complete!");
    return {
      testCasesAdded: testCases.length,
      modelsAdded: aiModels.length,
    };
  },
});
```

**Usage**:

```bash
# Run seed from Convex dashboard or via CLI
npx convex run functions/seed:seedDatabase
```

---

## UI Components

### shadcn/ui Components Needed

**Install these components**:

```bash
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add chart
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

### Custom Components to Build

#### `MemenessStars`

```tsx
// components/MemenessStars.tsx
export function MemenessStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < score ? "text-yellow-500" : "text-gray-300"}>
          ⭐
        </span>
      ))}
    </div>
  );
}
```

#### `TrendIndicator`

```tsx
// components/TrendIndicator.tsx
export function TrendIndicator({ trend }: { trend: number }) {
  if (trend > 0) {
    return <span className="text-green-600">↗️ +{(trend * 100).toFixed(1)}%</span>;
  } else if (trend < 0) {
    return <span className="text-red-600">↘️ {(trend * 100).toFixed(1)}%</span>;
  }
  return <span className="text-gray-500">→ 0%</span>;
}
```

#### `CopyButton`

```tsx
// components/CopyButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Button 
      variant="outline" 
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2"
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
```

#### `DataFreshnessIndicator`

```tsx
// components/DataFreshnessIndicator.tsx
"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function DataFreshnessIndicator() {
  const lastRun = useQuery(api.analytics.getLastTestRun);
  
  if (!lastRun) return null;
  
  const timeSince = Date.now() - lastRun.executedAt;
  const hoursAgo = Math.floor(timeSince / (1000 * 60 * 60));
  
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
      <span>Last updated: {hoursAgo}h ago</span>
    </div>
  );
}
```

---

## Development Roadmap

### Phase 1: Setup & Foundation (Week 1)

**Goals**: Get development environment ready

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Convex
  - Create account
  - Install Convex SDK
  - Configure schema
- [ ] Install shadcn/ui and Tailwind
- [ ] Create basic project structure
- [ ] Set up Git repository

**Deliverables**:

- Working dev environment
- Convex connected
- shadcn/ui components installed

---

### Phase 2: Database & Seed Data (Week 1-2)

**Goals**: Set up data layer

- [ ] Define Convex schema (tables, indexes)
- [ ] Create seed data files
  - `testCases.ts` (all 10 tests)
  - `aiModels.ts` (6 models)
- [ ] Write seed script
- [ ] Test seeding locally
- [ ] Write basic Convex queries
  - `getTestCases`
  - `getModels`
  - `getLeaderboard`

**Deliverables**:

- Populated database
- Working queries

---

### Phase 3: Test Execution Engine (Week 2)

**Goals**: Build the core testing logic

- [ ] Set up AI provider SDKs
  - OpenAI client
  - Anthropic client
  - Google client
  - Groq client
- [ ] Create unified client interface
- [ ] Implement validation functions
  - Exact match
  - Contains
  - Regex
  - Custom validators
- [ ] Build test execution logic
- [ ] Create `/api/test/run` endpoint
- [ ] Test manually with Postman/curl

**Deliverables**:

- Working test execution
- Can run tests via API

---

### Phase 4: Cron & Automation (Week 2-3)

**Goals**: Automate daily testing

- [ ] Create `/api/cron/trigger-all-tests`
- [ ] Configure Vercel Cron in `vercel.json`
- [ ] Create `/api/test/status` endpoint
- [ ] Add error handling and retries
- [ ] Test cron locally
- [ ] Deploy to Vercel and verify cron works

**Deliverables**:

- Automated daily testing
- Status endpoint working

---

### Phase 5: Landing Page (Week 3)

**Goals**: Build main user-facing page

- [ ] Hero section with methodology
- [ ] Quick comparison grid (3-5 tests × 4-6 models)
- [ ] Full comparison table
- [ ] About the tests section
- [ ] Test details section
- [ ] Methodology & data section
- [ ] Make it responsive

**Deliverables**:

- Complete landing page
- Responsive design

---

### Phase 6: Test Detail Pages (Week 3-4)

**Goals**: Deep dive pages for each test

- [ ] Create `/tests/[slug]` route
- [ ] Build TestInfoCard
- [ ] Build ModelPerformanceTable
- [ ] Build HistoricalTrendChart
- [ ] Build RecentRunsTimeline
- [ ] Add navigation from landing page

**Deliverables**:

- Working test detail pages
- Charts and data visualizations

---

### Phase 7: Model Detail Pages (Week 4)

**Goals**: Deep dive pages for each model

- [ ] Create `/models/[id]` route
- [ ] Build ModelInfoCard
- [ ] Build OverallStatsCard
- [ ] Build TestPerformanceTable
- [ ] Build ModelHistoricalChart
- [ ] Add navigation from landing page

**Deliverables**:

- Working model detail pages
- Performance analytics

---

### Phase 8: Polish & Testing (Week 4-5)

**Goals**: Make it production-ready

- [ ] Add loading states (Skeleton components)
- [ ] Add error boundaries
- [ ] Optimize queries (avoid waterfalls)
- [ ] Add meta tags (SEO)
- [ ] Test on mobile devices
- [ ] Add analytics (optional)
- [ ] Fix any bugs

**Deliverables**:

- Polished, bug-free app
- Good performance

---

### Phase 9: Documentation & Launch (Week 5)

**Goals**: Prepare for public launch

- [ ] Write README
- [ ] Add GitHub repository description
- [ ] Write about page / methodology doc
- [ ] Set up monitoring (Sentry optional)
- [ ] Final deployment to Vercel
- [ ] Soft launch (share with friends)
- [ ] Gather feedback

**Deliverables**:

- Public website live
- Documentation complete

---

## Deployment

### Environment Variables

Create `.env.local`:

```bash
# Convex
CONVEX_DEPLOYMENT=<your-deployment-url>
NEXT_PUBLIC_CONVEX_URL=<your-public-convex-url>

# AI Provider API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
GROQ_API_KEY=gsk_...

# API Secret (for manual test triggers)
API_SECRET_KEY=<generate-random-secret>

# Optional: Monitoring
SENTRY_DSN=...
```

### Vercel Configuration

**`vercel.json`**:

```json
{
  "crons": [
    {
      "path": "/api/cron/trigger-all-tests",
      "schedule": "0 3 * * *"
    }
  ],
  "env": {
    "OPENAI_API_KEY": "@openai-api-key",
    "ANTHROPIC_API_KEY": "@anthropic-api-key",
    "GOOGLE_API_KEY": "@google-api-key",
    "GROQ_API_KEY": "@groq-api-key",
    "API_SECRET_KEY": "@api-secret-key"
  }
}
```

**Set secrets in Vercel**:

```bash
vercel env add OPENAI_API_KEY
vercel env add ANTHROPIC_API_KEY
vercel env add GOOGLE_API_KEY
vercel env add GROQ_API_KEY
vercel env add API_SECRET_KEY
```

### Deployment Steps

1. **Push to GitHub**:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to vercel.com
   - Import repository
   - Configure environment variables
   - Deploy

3. **Configure Convex for Production**:

   ```bash
   npx convex deploy
   ```

4. **Verify Cron**:
   - Check Vercel logs after 3am UTC
   - Use `/api/test/status` to verify runs

---

## Next Steps

1. **Review this spec** - any changes needed?
2. **Set up development environment** - ready to start coding?
3. **Prioritize phases** - any order changes?
