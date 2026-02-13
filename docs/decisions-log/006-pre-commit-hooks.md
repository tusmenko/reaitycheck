# ADR-006: Pre-commit Hooks for Build and Lint

| Field | Value |
| ----- | ----- |
| **Date** | 2026-02-13 |
| **Status** | Accepted |

**Context**  
We need to prevent committing code that fails to build or violates lint rules (errors and warnings), to keep the main branch buildable and maintain code quality.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Pre-commit hooks: lint-staged for ESLint on staged files, plus type/build validation before each commit. |
| **Human alternative** | None — approved as proposed |
| **Decision** | Pre-commit hooks with Husky; lint-staged runs lint on staged files; separate type/build check. Keeps main branch buildable and enforces code quality at commit time. |

## Consequences

- ✅ Blocks commits with lint or type/build failures
- ✅ Lint runs only on staged files for faster feedback
- ⚠️ Full build validation should run in CI before merge/deploy
