# Implementation plan: Provide OpenRouter with app identification (Issue #3)

**Branch:** `feature/openrouter-app-identification`  
**Label:** enhancement  
**Goal:** For better logging and credits management on OpenRouter (per [TODO](docs/TODO.md)).

---

## Context

OpenRouter supports [App Attribution Headers](https://openrouter.ai/docs/app-attribution):

- **`HTTP-Referer`** — App URL (primary identifier for rankings).
- **`X-Title`** — App display name (for analytics and rankings).

Including these lets the app appear in OpenRouter rankings and improves usage/credits visibility. The OpenAI-compatible client used in this repo supports `defaultHeaders`.

---

## Current state

- [convex/actions/openrouter.ts](convex/actions/openrouter.ts) creates an OpenAI client with only `baseURL` and `apiKey`; no attribution headers.
- All OpenRouter traffic is triggered from Convex actions (e.g. [runTests.ts](convex/actions/runTests.ts) → `callModel`).

---

## Implementation

### 1. Add attribution headers in the OpenRouter client

**File:** [convex/actions/openrouter.ts](convex/actions/openrouter.ts)

- Define constants (or read from env) for app name and site URL:
  - **App name:** `ReAIity Check` (matches [app/layout.tsx](app/layout.tsx) title).
  - **Site URL:** `https://www.reaitycheck.com/` (production; matches [README](README.md)).
- Pass `defaultHeaders` into the OpenAI constructor:
  - `HTTP-Referer`: site URL.
  - `X-Title`: app name.

**Optional:** Support override via Convex env vars (e.g. `OPENROUTER_APP_URL`, `OPENROUTER_APP_TITLE`) for staging or alternate deployments. Default to the constants above if unset.

### 2. No changes elsewhere

- `callModel` signature stays the same; callers ([runTests.ts](convex/actions/runTests.ts)) do not need changes.
- No new Convex env vars required if using constants only.

---

## Verification

- After deploy, run a challenge that triggers OpenRouter (e.g. run scheduled tests or trigger from dashboard).
- In OpenRouter dashboard / rankings, confirm the app appears under the chosen title and URL (may take some time to show).

---

## Checklist

- [ ] Add `OPENROUTER_APP_TITLE` and `OPENROUTER_APP_URL` constants (or env) in `openrouter.ts`.
- [ ] Pass `defaultHeaders: { "HTTP-Referer": url, "X-Title": title }` into the OpenAI client in `getClient()`.
- [ ] (Optional) Document env vars in [DEVELOPMENT.md](DEVELOPMENT.md) if using env override.
- [ ] Run type-check and lint; ensure existing tests still pass.
