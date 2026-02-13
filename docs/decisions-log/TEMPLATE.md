# ADR Template and Instructions

**Project**: ReAIity Checker  
**Location**: `docs/decisions-log/`

---

## Format

Each decision is recorded using the following structure:

| Field | Description |
| ----- | ----------- |
| **Date** | When the decision was made |
| **Status** | `Accepted` \| `Pending` \| `Superseded` \| `Deprecated` |
| **Context** | What is the issue we're addressing? |
| **AI proposal** | What the AI agent suggested |
| **Human alternative** | What the human team member proposed instead |
| **Decision** | What was picked in the end, and briefly why |
| **Consequences** | What are the results of this decision? (positive and negative) |

---

## Adding a New Decision

1. **Assign the next sequential ADR number**  
   Check existing files (`001-`, `002-`, etc.) and use the next number.

2. **Create a new file** with the naming pattern:  
   `NNN-short-title-slug.md`  
   Example: `006-api-authentication.md`

3. **Copy the template below** into the new file.

4. **Fill in all fields** with actual data.

5. **Update the index**  
   Add the new ADR to the list in `README.md`.

6. **Verify lint**  
   Run `pnpm exec markdownlint 'docs/decisions-log/**/*.md' --config docs/decisions-log/.markdownlint.json` to check formatting.

---

## Template

```markdown
# ADR-NNN: [Short Title]

| Field | Value |
| ----- | ----- |
| **Date** | YYYY-MM-DD |
| **Status** | Accepted |

**Context**  
[Describe the problem or situation we're addressing.]

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | [What the AI agent suggested] |
| **Human alternative** | [What the human proposed instead] |
| **Decision** | [What was picked and briefly why] |

## Consequences

- ✅ [Positive consequence]
- ⚠️ [Negative consequence or trade-off]
```

---

## Status Values

| Status | Meaning |
| ------ | ------- |
| `Accepted` | Decision is made and implemented (or in progress) |
| `Pending` | Decision is made but implementation is still being designed |
| `Superseded` | Replaced by a later ADR |
| `Deprecated` | No longer relevant; do not follow |
