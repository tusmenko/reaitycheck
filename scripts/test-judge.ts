/**
 * Local smoke test for the LLM judge.
 * Usage: OPENROUTER_API_KEY=sk-... npx tsx scripts/test-judge.ts
 */
import { callModel } from "../convex/actions/openrouter";
import { validateAsync } from "../convex/actions/validators";

const apiKey = process.env.OPENROUTER_API_KEY ?? "";
if (!apiKey) {
  console.error("Set OPENROUTER_API_KEY first");
  process.exit(1);
}

const TEST_PROMPT =
  "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?";
const EXPECTED_ANSWER = "4";

async function run() {
  // Simulate what a model might answer
  const cases = [
    { label: "CORRECT response", response: "Alice's brother has 4 sisters." },
    { label: "WRONG response", response: "The answer is 3 sisters." },
    { label: "VERBOSE but correct", response: "Let me think... Alice + her 3 sisters = 4 sisters total, so the brother has 4 sisters." },
  ];

  for (const { label, response } of cases) {
    console.log(`\n--- ${label} ---`);
    console.log(`Response: "${response}"`);

    const result = await validateAsync(
      "llm_judge",
      {
        judgeCriteria:
          "The answer must be 4. Accept any response that arrives at 4 sisters, regardless of phrasing.",
      },
      TEST_PROMPT,
      EXPECTED_ANSWER,
      response,
      { callModel, apiKey }
    );

    console.log(`isCorrect:       ${result.isCorrect}`);
    console.log(`parsedAnswer:    ${result.parsedAnswer}`);
    console.log(`judgeTokensUsed: ${JSON.stringify(result.judgeTokensUsed)}`);
  }
}

run().catch(console.error);
