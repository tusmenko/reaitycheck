# ADR-002: AI Provider Integration

| Field | Value |
| ----- | ----- |
| **Date** | February 2026 |
| **Status** | Accepted |

**Context**  
We need to test multiple AI models (GPT, Claude, Gemini, Llama, etc.). Need to decide how to connect to providers.

## Considered alternatives

| Role | Choice |
| ---- | ------ |
| **AI proposal** | Connect to each AI provider directly |
| **Human alternative** | Use aggregator OpenRouter |
| **Decision** | OpenRouter. Single integration, one API key, consistent request format — simpler than maintaining multiple SDKs and keys. |

## Consequences

- ✅ One integration for many models  
- ✅ Easier to add new models without code changes  
- ⚠️ Additional latency from proxy layer  
- ⚠️ Dependent on OpenRouter availability and pricing  
