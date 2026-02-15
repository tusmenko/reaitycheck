# Issue implementation flow

This document defines the end-to-end flow for implementing a project issue: from picking the top-priority item and creating a branch through implementation, PR, and merge. Use it so any agent (or human) can repeat the process for other issues.

---

## 1. Prerequisites (check first — exit early if not met)

Verify these **before** starting. If any check fails, stop and fix it.

| Check | Command / action | Why |
|-------|------------------|-----|
| **GitHub CLI authenticated** | `gh auth status` | Needed for listing issues, project data, creating PRs, updating project status. |
| **Repository is correct** | `git remote -v` and `gh repo view` | Ensure you're in the right repo (e.g. `tusmenko/reaitycheck`). |
| **Clean or known git state** | `git status` | Prefer clean working tree; uncommitted changes (e.g. `docs/TODO.md`) are acceptable if intentional. |
| **Default branch up to date** | `git fetch origin && git status` | Branch should be created from latest `main` (or project default). |
| **Network available** | `gh issue list --limit 1` | All `gh` and project operations need API access. |
| **jq installed** (if using manual branch + status update) | `jq --version` | Required for parsing project item ID from `gh project item-list` (see this doc §3 Step 3 or [.cursor/rules/issue-implementation-flow.mdc](../.cursor/rules/issue-implementation-flow.mdc)). |

**Example quick preflight:**

```bash
gh auth status && git remote -v && git fetch origin && git status
```

---

## 2. Pick the issue

Project issues live on **GitHub** (project board), not in the repo. Use the CLI to find what to work on.

**Filter (always apply):**

- Consider **only** issues in the **Ready** column (project Status = Ready). Ignore Backlog, In progress, In review, Done.
- Consider **only** issues that have the **`ai-friendly`** label. Ignore issues without this label.

**Selection (use one; the command or user context determines which):**

- **By order:** Among matching issues, choose the **first in order** (e.g. first in the project list or `gh issue list` output). Do not sort by Priority. (Used by e.g. `/implement-top-issue`.)
- **By priority:** Among matching issues, sort by **Priority descending** (P0 first, then P1, then P2) and choose the **first** — i.e. the highest-priority issue. Use the project board / GraphQL for the Priority field. (Used by e.g. `/implement-prio-issue`.)

1. **List open issues that have the `ai-friendly` label:**

   ```bash
   gh issue list --state open --label "ai-friendly" --json number,title,labels,url
   ```

2. **Resolve Status and Priority from the project board** (e.g. ReAItyCheck project). Query the project for items; in the result, keep only items that are **in the Ready column** and whose issue has the label `ai-friendly`. Then apply the **selection** rule (by order or by priority) to pick one.

   Example GraphQL to inspect project items and their Status/Priority (replace `tusmenko` and project number as needed):

   ```bash
   gh api graphql -f query='
   query {
     user(login: "tusmenko") {
       projectV2(number: 2) {
         items(first: 50) {
           nodes {
             id
             content { ... on Issue { number title labels(first:10) { nodes { name } } } }
             fieldValues(first: 20) { nodes { ... on ProjectV2ItemFieldSingleSelectValue { field { ... on ProjectV2SingleSelectField { name } } name } } }
           }
         }
       }
     }
   }'
   ```

   Filter to Ready + `ai-friendly`, then select one using the chosen rule (by order or by priority).

3. **Choose the issue** to implement: apply the filter, then the selection rule. Note its **number**, **title**, and **labels** (especially `enhancement` vs `bug`). If no issue matches the filter, stop and report.

---

## 3. Create the branch and set status to In progress

### Branch naming

- **Pattern:** `[feature|bugfix]/[issue-slug]`
- **Label → prefix:** `enhancement` (or similar) → `feature`; `bug` → `bugfix`.
- **Slug:** Short, lowercase, hyphenated identifier derived from the issue title (e.g. `openrouter-app-identification` for "Provide OpenRouter with app identification").

### Step 1: Create the branch via GitHub CLI (preferred)

Create the branch from the issue and check it out so the branch is **linked to the issue** on GitHub (issue Development section will show the branch):

```bash
gh issue develop <ISSUE_NUMBER> --base main -n feature/<issue-slug> --checkout
# or bugfix/<issue-slug> for bugs
```

If this **succeeds**, go to **Step 3** (set status to In progress).

### Step 2: Fallback — manual branch creation and association with issue

If **`gh issue develop` fails** (e.g. network, permissions, or CLI error):

1. Create and checkout the branch manually:

   ```bash
   git checkout main && git pull origin main
   git checkout -b feature/<issue-slug>   # or bugfix/<issue-slug>
   ```

2. Associate the branch with the issue (GitHub has no API to link an existing branch; do one or both):
   - Add a **comment on the issue** with the branch name and that a PR will follow (e.g. "Branch: `feature/<issue-slug>`. PR will link when opened with Closes #N.").
   - When opening the PR, put **`Closes #<ISSUE_NUMBER>`** in the PR body so the issue links to the PR and closes on merge.

Then proceed to **Step 3**.

### Step 3: Move the issue to In progress

**After** the branch exists (whether created via `gh issue develop` or manually), set the issue's **project Status to "In progress"** so the board reflects work started. Follow [.cursor/rules/issue-implementation-flow.mdc](../.cursor/rules/issue-implementation-flow.mdc) (section "Set issue Status to In progress"): get the project item ID for the issue, then run `gh project item-edit` with Status = "In progress".

**ReAItyCheck project IDs** (for status update):

- Project ID: `PVT_kwHOAqmy8c4BPKom`
- Status field ID: `PVTSSF_lAHOAqmy8c4BPKomzg9p7fs`
- "In progress" option ID: `47fc9ee4`

---

## 4. Implementation plan and approval

1. **Draft an implementation plan** (in `docs/implementation-plans/` or similar) that includes:
   - **Link to the GitHub issue** (e.g. in the plan header or a dedicated line: `Issue: https://github.com/owner/repo/issues/N` or `[Issue #N](https://github.com/owner/repo/issues/N)`).
   - Goal and context
   - Current state
   - Concrete implementation steps (files, changes)
   - Verification / how to test
   - Optional: checklist

2. **Get user approval** before implementing. Ask for clarification if the issue is ambiguous or dependencies are unclear.

3. **Commit the plan** in a separate commit (e.g. `docs: add implementation plan for <feature> (issue #N)`), then implement in the **next** commit(s).

---

## 5. Implement and commit

1. **If the plan has multiple implementation steps:** Implement **each step** so that after that step the codebase is in a **committable state**: it passes validation (e.g. `npm run type-check`) and tests. **Commit after each step** with a clear message (e.g. "feat(scope): implement step 1 — …"). Then proceed to the next step. Do not accumulate multiple steps into one commit unless the plan explicitly groups them.

2. **If the plan is a single implementation:** Implement the feature/fix, run type-check and lint, then commit.

3. **Always:** Run **type-check** and **lint** before every commit (e.g. `npm run type-check`, and lint-staged on commit). Fix any failures before committing.

4. **Commit sequence:** Prefer **one commit for the plan** (e.g. `docs: add implementation plan for <feature> (issue #N)`), then **one or more commits for the implementation** (one per logical step when the plan is multistep). You may include `Closes #N` in a commit message or rely on the PR body (see §6).

---

## 6. Push and open the pull request

1. **Push the branch:**

   ```bash
   git push -u origin feature/<issue-slug>
   ```

2. **Create the PR** with a **structured description** so the issue is linked and the board can auto-update (e.g. Status → In progress when PR is linked, Done when merged). Use this template:

   ```markdown
   ## Goal
   <One or two sentences on what this achieves.>

   ## Design
   - [Implementation plan](<link to plan doc on this branch>)

   ## What's implemented
   - <Bullet list of changes.>

   ## How to test
   1. <Step 1>
   2. <Step 2>
   3. <Step 3>

   ## Other notes
   - <Any caveats, optional env vars, etc.>

   Closes #<ISSUE_NUMBER>
   ```

   **Important:** The line **`Closes #<ISSUE_NUMBER>`** (e.g. `Closes #3`) must appear in the **PR body**. That:
   - Links the PR to the issue (issue shows "Linked pull requests").
   - Closes the issue when the PR is merged into the default branch.
   - Can trigger project automations (e.g. set issue Status to "In progress" when PR is linked, "Done" when merged).

   Create the PR via CLI:

   ```bash
   gh pr create --title "feat: <Short title> (Closes #N)" --body-file - << 'EOF'
   <paste the structured body including Closes #N>
   EOF
   ```

3. **If the issue does not show the PR as linked:** Ensure "Closes #N" is in the PR **body** (not only in the title). Optionally add a short comment on the issue referencing the branch and PR.

---

## 7. After merge

- The issue will **close** automatically (because of "Closes #N").
- If the project has **built-in workflows** (e.g. "When pull request is merged → set Status to Done"), the project card will move to **Done**.
- No extra steps are required unless you track something else (e.g. release notes).

---

## 8. Reference summary

| Topic | Where |
|-------|--------|
| Pick only from **Ready** column and **ai-friendly** label | This doc, §2 |
| Set issue Status to "In progress" after branch creation | [.cursor/rules/issue-implementation-flow.mdc](../.cursor/rules/issue-implementation-flow.mdc); this doc §3 Step 3 |
| Create branch from issue (try first, then fallback to manual) | This doc, §3 Steps 1–2; `gh issue develop <N> --base main -n feature/<slug> --checkout` |
| Project/Status field IDs (ReAItyCheck) | This doc, §3 Step 3 |
| Multistep implementation → commit after each step | This doc, §5 |
| PR description template | This doc, §6 |
| Implementation plan location and must include link to issue | `docs/implementation-plans/`; this doc §4 |
| Architecture decisions (when to log) | [.cursor/rules/architecture-decisions-log.mdc](../.cursor/rules/architecture-decisions-log.mdc) |

---

## 9. Notes and future improvements

- **Ready column only:** The agent picks issues only from the project **Ready** column (Status = Ready). Move issues to Ready when they are ready for implementation.
- **ai-friendly label:** Issues must have the `ai-friendly` label to be eligible for agent-driven implementation. Add this label in GitHub when an issue is ready for the agent.
- **Linking an existing branch to an issue:** GitHub has no public API for this. Use the issue’s **Development** panel in the UI to link an existing branch, or create the branch with `gh issue develop` so it’s linked from the start.
- **"When branch is created → set Status to In progress":** Not available as a built-in project workflow. Can be implemented later with a **GitHub Actions** workflow (trigger: `create` with `ref_type: branch`) that calls the Projects GraphQL API to find the issue from the branch name and set Status. Documented for later; not required for the current flow.
- **First run:** This flow was used to implement issue #3 (Provide OpenRouter with app identification): branch `feature/openrouter-app-identification`, plan + implementation commits, PR #4, merge → Done.
