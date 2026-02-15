# Implementation plan: About page (Issue #5)

**Branch:** `feature/about-page`  
**Issue:** [About page](https://github.com/tusmenko/reaitycheck/issues/5)  
**Label:** enhancement

---

## Goal

Add an **About** page at `/about` that explains the project (based on README) with emphasis on **site functionality, flow, methodology**, and how it helps track AI "dominance". The page must match the existing visual style, and the About link must appear in the **navbar** and **footer**.

---

## Context

- README covers: project premise, why it exists, what it does (run prompts across models, track results, surface failures), meta-experiment (built with AI agents), core question (competence vs trust).
- Issue asks for **more focus** on: site functionality, flow, methodology, and how the site helps track AI dominance.
- Existing pages use: `bg-background`, `border-dark-200`, `bg-dark-100/80`, `font-display`, `text-white` / `text-gray-400`, max-width containers, same padding (e.g. `px-6 lg:px-12`).

---

## Current state

- No `/about` route.
- Navbar has: Models, Challenges, Benchmarks, Submit Challenge (desktop + mobile). No About.
- Footer has: copyright + GitHub link. No About.

---

## Implementation

### 1. Add About page route and content

**File:** `app/about/page.tsx` (new)

- Server component (no Convex data needed).
- Export `metadata`: title `"About — ReAIty Check"`, description for SEO.
- Content (styled like submit-challenge / landing):
  - **Brief overview** from README: what ReAIty Check is, why it exists (reaction to AI hype, testing claims against reality).
  - **Site functionality and flow:** Home (live results, leaderboard, comparison grid) → Models → Challenges (catalog, kill rates) → Benchmarks (full matrix) → Submit Challenge. How data is updated (automated runs, Convex backend).
  - **Methodology:** Same prompts across models, track pass/fail and kill rates, focus on edge cases and meme problems, not academic benchmarks.
  - **How it helps track "AI dominance":** Surfaces where models fail; progress = when agents handle simple edge cases as reliably as humans. Not anti-AI — competence check before trusting agents.
- Use existing layout patterns: `min-h-screen bg-background`, `px-6 pb-16 pt-8 lg:px-12`, `max-w-4xl` or `max-w-3xl` for prose, `rounded-3xl border border-dark-200 bg-dark-100/80` for main section, `font-display` for headings, `text-white` / `text-gray-400`.

### 2. Add About link to navbar

**File:** `components/landing/navbar.tsx`

- Add `{ href: "/about", label: "About" }` to `mobileNavLinks` (e.g. after Benchmarks or at end).
- Add desktop nav `Link` to `/about` with same styling as Models / Challenges / Benchmarks (e.g. between Benchmarks and the right-side actions).

### 3. Add About link to footer

**File:** `components/landing/footer-section.tsx`

- Add a text link "About" to `/about` in the footer (e.g. next to or before the GitHub link), same hover style as existing link.

---

## Verification

1. Visit `/about` — page renders, readable, matches site style.
2. Navbar (desktop and mobile) shows "About" and navigates to `/about`.
3. Footer shows "About" and navigates to `/about`.
4. Run `npm run type-check` and lint; fix any issues.

---

## Checklist

- [ ] Create `app/about/page.tsx` with metadata and content.
- [ ] Add About to `mobileNavLinks` and desktop nav in `navbar.tsx`.
- [ ] Add About link in `footer-section.tsx`.
