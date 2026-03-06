"use node";

type ValidationConfig = {
  acceptableAnswers?: string[];
  caseSensitive?: boolean;
  judgeModel?: string;
  judgePromptTemplate?: string;
  judgeCriteria?: string;
};

type TokenUsage = { prompt: number; completion: number; total: number };

type ValidationResult = {
  isCorrect: boolean;
  parsedAnswer: string;
  judgeTokensUsed?: TokenUsage;
};

type CallModelFn = (
  apiKey: string,
  apiIdentifier: string,
  prompt: string,
  options: { temperature: number; maxTokens: number },
  messages?: Array<{ role: "system" | "user" | "assistant"; content: string }>
) => Promise<{ content: string; tokensUsed: TokenUsage; executionTimeMs: number }>;

type JudgeOptions = { callModel: CallModelFn; apiKey: string };

const DEFAULT_JUDGE_MODEL = "openai/gpt-4o-mini";
const JUDGE_MAX_TOKENS = 256;
const JUDGE_TEMPERATURE = 0;

const DEFAULT_JUDGE_SYSTEM_PROMPT =
  "You are a strict but fair answer evaluator. Focus on substance, not phrasing.\n" +
  "Respond ONLY in this format:\n" +
  "VERDICT: PASS\n" +
  "REASONING: <one sentence>";

const SIMPLE_JUDGE_SYSTEM_PROMPT =
  "Evaluate the answer. Reply with exactly: VERDICT: PASS or VERDICT: FAIL";

function buildJudgeMessages(
  config: ValidationConfig,
  testPrompt: string,
  expectedAnswer: string,
  rawResponse: string,
  systemPromptOverride?: string
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  const systemPrompt =
    systemPromptOverride ?? config.judgePromptTemplate ?? DEFAULT_JUDGE_SYSTEM_PROMPT;

  const criteria = config.judgeCriteria
    ? `\n\nAdditional criteria: ${config.judgeCriteria}`
    : "";

  const userMessage =
    `Question: ${testPrompt}\n\n` +
    `Expected answer: ${expectedAnswer}\n\n` +
    `Model response: ${rawResponse}${criteria}`;

  return [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];
}

export function parseJudgeVerdict(response: string): "PASS" | "FAIL" | null {
  const match = /VERDICT:\s*(PASS|FAIL)/i.exec(response);
  if (!match) return null;
  return match[1].toUpperCase() as "PASS" | "FAIL";
}

async function runLlmJudge(
  config: ValidationConfig,
  testPrompt: string,
  expectedAnswer: string,
  rawResponse: string,
  judgeOptions: JudgeOptions
): Promise<ValidationResult> {
  const judgeModel = config.judgeModel ?? DEFAULT_JUDGE_MODEL;
  const { callModel, apiKey } = judgeOptions;

  let judgeResult: { content: string; tokensUsed: TokenUsage };
  try {
    const messages = buildJudgeMessages(config, testPrompt, expectedAnswer, rawResponse);
    judgeResult = await callModel(apiKey, judgeModel, "", {
      temperature: JUDGE_TEMPERATURE,
      maxTokens: JUDGE_MAX_TOKENS,
    }, messages);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { isCorrect: false, parsedAnswer: `judge_error: ${msg}` };
  }

  let verdict = parseJudgeVerdict(judgeResult.content);

  if (verdict === null) {
    // Retry once with a simpler prompt
    try {
      const retryMessages = buildJudgeMessages(
        config,
        testPrompt,
        expectedAnswer,
        rawResponse,
        SIMPLE_JUDGE_SYSTEM_PROMPT
      );
      const retryResult = await callModel(apiKey, judgeModel, "", {
        temperature: JUDGE_TEMPERATURE,
        maxTokens: JUDGE_MAX_TOKENS,
      }, retryMessages);
      verdict = parseJudgeVerdict(retryResult.content);
      if (verdict === null) {
        return {
          isCorrect: false,
          parsedAnswer: `judge_parse_error: ${retryResult.content.slice(0, 100)}`,
          judgeTokensUsed: judgeResult.tokensUsed,
        };
      }
      // Use combined tokens from both calls
      judgeResult = {
        content: retryResult.content,
        tokensUsed: {
          prompt: judgeResult.tokensUsed.prompt + retryResult.tokensUsed.prompt,
          completion: judgeResult.tokensUsed.completion + retryResult.tokensUsed.completion,
          total: judgeResult.tokensUsed.total + retryResult.tokensUsed.total,
        },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return {
        isCorrect: false,
        parsedAnswer: `judge_error: ${msg}`,
        judgeTokensUsed: judgeResult.tokensUsed,
      };
    }
  }

  const reasoning = judgeResult.content.match(/REASONING:\s*(.+)/i)?.[1]?.trim() ?? "";
  return {
    isCorrect: verdict === "PASS",
    parsedAnswer: reasoning || verdict,
    judgeTokensUsed: judgeResult.tokensUsed,
  };
}

export async function validateAsync(
  validationType: string,
  validationConfig: ValidationConfig | undefined,
  testPrompt: string,
  expectedAnswer: string,
  rawResponse: string,
  judgeOptions?: JudgeOptions
): Promise<ValidationResult> {
  if (validationType === "llm_judge") {
    if (!judgeOptions) {
      return { isCorrect: false, parsedAnswer: "judge_error: judgeOptions required for llm_judge" };
    }
    return runLlmJudge(
      validationConfig ?? {}, testPrompt, expectedAnswer, rawResponse, judgeOptions
    );
  }
  return validate(validationType, validationConfig, expectedAnswer, rawResponse);
}

export function validate(
  validationType: string,
  validationConfig: ValidationConfig | undefined,
  expectedAnswer: string,
  rawResponse: string
): ValidationResult {
  if (validationType === "exact_match") {
    return exactMatch(validationConfig, rawResponse);
  }
  return { isCorrect: false, parsedAnswer: "unknown_validation_type" };
}

function exactMatch(
  config: ValidationConfig | undefined,
  rawResponse: string
): ValidationResult {
  const acceptable = config?.acceptableAnswers ?? [];
  const caseSensitive = config?.caseSensitive ?? false;
  const trimmed = rawResponse.trim();

  for (const answer of acceptable) {
    const a = caseSensitive ? answer : answer.toLowerCase();
    const r = caseSensitive ? trimmed : trimmed.toLowerCase();
    // Check if the response contains the acceptable answer
    if (r === a || (a.length > 0 && r.includes(a))) {
      return { isCorrect: true, parsedAnswer: answer };
    }
  }

  // Try to extract a short answer from the response
  const parsedAnswer = trimmed.length > 100 ? trimmed.slice(0, 100) + "..." : trimmed;
  return { isCorrect: false, parsedAnswer };
}

