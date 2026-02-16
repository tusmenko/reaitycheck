# Issue implementation flow

This document defines the end-to-end flow for implementing a project issue: from picking the top-priority item and creating a branch through implementation, PR, and merge. Use it so any agent (or human) can repeat the process for other issues.

---

## 1. Prerequisites (check first — exit early if not met)

Verify these **before** starting. If any check fails, stop and fix it. This flow uses the **GitHub MCP server** for all GitHub API operations (issues, project board, branches, PRs). Ensure [GitHub MCP is configured](github-mcp-setup.md) and the **`projects`** toolset is enabled for project board read/update.

| Check | Action | Why |
|-------|--------|-----|
| **GitHub MCP authenticated** | Use **`get_me`** | Verify the authenticated user and that MCP can reach GitHub. |
| **Repository known** | `git remote -v`; optionally **`get_file_contents`** or **`list_branches`** (owner, repo) | Confirm you're in the right repo (e.g. `tusmenko/reaitycheck`) and API access works. |
| **Clean or known git state** | `git status` | Prefer clean working tree; uncommitted changes (e.g. `docs/TODO.md`) are acceptable if intentional. |
| **Default branch up to date** | `git fetch origin && git status` | Branch should be created from latest `main` (or project default). |

**Example quick preflight:**

- **Git:** `git remote -v && git fetch origin && git status`
- **GitHub:** Call **`get_me`** to confirm MCP authentication.

---

## 2. Pick the issue

Project issues live on **GitHub** (project board), not in the repo. Use **GitHub MCP** tools to find what to work on.

**Alternative (GitHub MCP):** If the [GitHub MCP server](github-mcp-setup.md) is configured in Cursor, the agent can use MCP tools to list issues and read project board data instead of running `gh` in the execution environment. Useful when `gh` is not authenticated in the agent’s environment (e.g. sandbox).

**Filter (always apply):**

- Consider **only** issues in the **Ready** column (project Status = Ready). Ignore Backlog, In progress, In review, Done.
- Consider **only** issues that have the **`ai-friendly`** label. Ignore issues without this label.

**Selection (use one; the command or user context determines which):**

- **By order:** Among matching issues, choose the **first in order** (e.g. first in the project list). Do not sort by Priority. (Used by e.g. `/implement-top-issue`.)
- **By priority:** Among matching issues, sort by **Priority descending** (P0 first, then P1, then P2) and choose the **first** — i.e. the highest-priority issue. (Used by e.g. `/implement-prio-issue`.)

1. **List open issues that have the `ai-friendly` label**  
   Use **`list_issues`** (owner, repo, state: open, labels: `["ai-friendly"]`). Note number, title, and labels for each.

2. **Resolve Status and Priority from the project board** (e.g. ReAIty Check project)  
   Use the **Projects toolset**: list project items for the project and read each item's **Status** and **Priority** field values. Keep only items that are **in the Ready column** and whose linked issue has the label `ai-friendly`. Apply the **selection** rule (by order or by priority) to pick one issue.

3. **Choose the issue** to implement: apply the filter, then the selection rule. Note its **number**, **title**, and **labels** (especially `enhancement` vs `bug`). If no issue matches the filter, stop and report.

---

## 3. Create the branch and set status to In progress

### Branch naming

- **Pattern:** `[feature|bugfix]/[issue-slug]`
- **Label → prefix:** `enhancement` (or similar) → `feature`; `bug` → `bugfix`.
- **Slug:** Short, lowercase, hyphenated identifier derived from the issue title (e.g. `openrouter-app-identification` for "Provide OpenRouter with app identification").

### Step 1: Create the branch (GitHub MCP + git)

1. Create the branch on GitHub using **`create_branch`** (owner, repo, branch name, from_branch: main). Use `feature/<issue-slug>` or `bugfix/<issue-slug>` per the branch naming rules above.
2. Check out the branch locally:

   ```bash
   git fetch origin && git checkout feature/<issue-slug>
   ```

   (or `bugfix/<issue-slug>` for bugs)

3. Optionally add a comment on the issue via **`add_issue_comment`** (e.g. "Branch `feature/<issue-slug>` created; PR will follow with Closes #N.") so the issue documents the branch. The PR body with `Closes #N` will link the PR to the issue when you open it.

### Step 2: Fallback — local branch only

If **`create_branch`** is unavailable or fails:

1. Create and checkout the branch locally only:

   ```bash
   git checkout main && git pull origin main
   git checkout -b feature/<issue-slug>
   ```

2. Add a **comment on the issue** via **`add_issue_comment`** with the branch name and that a PR will follow. When opening the PR, put **`Closes #<ISSUE_NUMBER>`** in the PR body. Push the branch before creating the PR: `git push -u origin feature/<issue-slug>`.

### Step 3: Set the issue Status to "In progress"

**Required** whether the branch was created via Step 1 or Step 2. Set the issue's **project Status to "In progress"**. Use the **Projects toolset**: update the project item's Status field to **"In progress"** for the chosen issue. If the Projects tool is unavailable, add an issue comment: "Branch created; please move this issue to **In progress** on the project board."

**ReAIty Check project IDs** (if the MCP tool requires them):

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

1. **Push the branch:** `git push -u origin feature/<issue-slug>`. If push fails with credential errors (e.g. "could not read Username", "Device not configured"), tell the user to run that command locally or use the IDE's Publish, then create the PR once the branch exists on the remote.

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

   Create the PR using **`create_pull_request`** (owner, repo, title, head: branch name, base: main, body: the structured description above). Ensure the body includes **`Closes #<ISSUE_NUMBER>`**.

3. **If the issue does not show the PR as linked:** Ensure "Closes #N" is in the PR **body** (not only in the title). Optionally use **`add_issue_comment`** to reference the branch and PR on the issue.

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
| Create branch (MCP + git) | This doc, §3 Steps 1–2; **`create_branch`** then `git fetch` / `git checkout` |
| Project/Status field IDs (ReAIty Check) | This doc, §3 Step 3 |
| Multistep implementation → commit after each step | This doc, §5 |
| PR description template | This doc, §6 |
| Implementation plan location and must include link to issue | `docs/implementation-plans/`; this doc §4 |
| Architecture decisions (when to log) | [.cursor/rules/architecture-decisions-log.mdc](../.cursor/rules/architecture-decisions-log.mdc) |

---

## 9. Notes and future improvements

- **Ready column only:** The agent picks issues only from the project **Ready** column (Status = Ready). Move issues to Ready when they are ready for implementation.
- **ai-friendly label:** Issues must have the `ai-friendly` label to be eligible for agent-driven implementation. Add this label in GitHub when an issue is ready for the agent.
- **Linking an existing branch to an issue:** GitHub has no public API for this. Use the issue’s **Development** panel in the UI to link an existing branch, or rely on the PR with `Closes #N` to link once the PR is opened.
- **"When branch is created → set Status to In progress":** Not available as a built-in project workflow. Can be implemented later with a **GitHub Actions** workflow (trigger: `create` with `ref_type: branch`) that calls the Projects GraphQL API to find the issue from the branch name and set Status. Documented for later; not required for the current flow.
- **First run:** This flow was used to implement issue #3 (Provide OpenRouter with app identification): branch `feature/openrouter-app-identification`, plan + implementation commits, PR #4, merge → Done.
