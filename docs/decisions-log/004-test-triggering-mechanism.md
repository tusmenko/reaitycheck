# ADR-004: Test Triggering Mechanism

| Field | Value |
| ----- | ----- |
| **Date** | February 2026 |
| **Status** | Accepted |

**Context**  
We need a way to trigger test runs — manually and/or on schedule.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Add ADMIN panel to run tests, and admin API (no auth proposed) |
| **Human alternative** | Use cron job; do manual runs via Convex UI |
| **Decision** | Cron job for schedule; manual runs via Convex UI. Simpler than building auth and admin UI — Convex dashboard is sufficient for MVP. |

## Consequences

- ✅ No auth/admin surface to build or secure  
- ✅ Convex cron handles scheduling  
- ⚠️ Manual runs require Convex dashboard access  
- ⚠️ No self-service API for triggering tests  
