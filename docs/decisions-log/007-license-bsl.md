# ADR-007: Repository License (BSL 1.1)

| Field | Value |
| ----- | ----- |
| **Date** | 2026-02-13 |
| **Status** | Accepted |

**Context**  
The repository needed a license that allows copying and non-production use (learning, evaluation, development) but restricts production/commercial use and prevents the software from being offered as a competing product or service without a commercial agreement.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Initially Commons Clause on Apache 2.0; then a custom clause limiting use to personal, non-commercial only with no public deployment. Also evaluated PolyForm Noncommercial (allows distribution and org use), PolyForm Strict (no distribution or modifications), and BSL 1.1. |
| **Human alternative** | Prefer a standard, time-limited approach: Business Source License 1.1 with a 3-year Change Date. |
| **Decision** | **Business Source License 1.1** with Change Date 2029-12-31, Additional Use Grant None, Change License Apache License Version 2.0. Allows copy, modify, redistribute, and non-production use; production use requires a commercial license or waiting until the Change Date, when the work converts to Apache 2.0. |

## Consequences

- ✅ Standard, recognized “source available” license; no custom drafting.
- ✅ Clear rules: non-production use allowed; production use requires commercial license or wait until 2029-12-31.
- ✅ Automatic conversion to Apache 2.0 after the Change Date gives long-term permissive use.
- ⚠️ MariaDB’s name and trademark appear in the license text (expected when using BSL 1.1).
- ⚠️ Companies can use the software for dev/test/eval without payment; only production use is restricted.
