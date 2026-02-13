# ADR-001: Backend and Hosting

| Field | Value |
| ----- | ----- |
| **Date** | February 2026 |
| **Status** | Accepted |

**Context**  
We needed a backend stack with database, real-time subscriptions, and deployment for the AI model limitation tracker.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Nest.js + Supabase |
| **Human alternative** | Convex and Vercel |
| **Decision** | Convex and Vercel. Chosen for built-in real-time, cron, and seamless deployment — avoids managing separate backend, DB, and scheduler. |

## Consequences

- ✅ Real-time subscriptions out of the box  
- ✅ Built-in cron/scheduling for automated tests  
- ✅ Type-safe queries and mutations  
- ⚠️ Vendor lock-in; migration path would require more effort  
