# ADR-008: Neo-Brutalism UI Style

| Field | Value |
| ----- | ----- |
| **Date** | 2026-03 |
| **Status** | Accepted |

**Context**
The app needed a visual identity that feels playful, bold, and memorable — matching the irreverent tone of "reality-checking" AI models with meme-worthy challenges. The default shadcn/ui styling felt too generic and corporate for this purpose.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Polished dark theme with gradients and glassmorphism |
| **Human alternative** | Neo-brutalism: bold borders, solid shadows, high-contrast colors, raw aesthetic |
| **Decision** | Neo-brutalism. Chosen for its playful, unapologetic personality that matches the project's tone. Built as a customization layer on top of shadcn/ui components. |

## Consequences

- ✅ Strong visual identity that stands out and matches the project's irreverent tone
- ✅ Built on top of existing shadcn/ui — no new dependencies, just CSS and component tweaks
- ✅ Reference designs documented in `docs/neo-brutalism-references/`
- ⚠️ Bold style may not appeal to all audiences
- ⚠️ Custom CSS layer adds maintenance overhead on top of shadcn/ui defaults
