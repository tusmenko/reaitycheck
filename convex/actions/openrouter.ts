"use node";

import OpenAI from "openai";

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const REQUEST_TIMEOUT_MS = 30_000;

const OPENROUTER_APP_TITLE = "ReAIity Check";
const OPENROUTER_APP_URL = "https://www.reaitycheck.com/";

function getClient(apiKey: string) {
  return new OpenAI({
    baseURL: OPENROUTER_BASE_URL,
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": process.env.OPENROUTER_APP_URL ?? OPENROUTER_APP_URL,
      "X-Title": process.env.OPENROUTER_APP_TITLE ?? OPENROUTER_APP_TITLE,
    },
  });
}

export async function callModel(
  apiKey: string,
  apiIdentifier: string,
  prompt: string,
  options: { temperature: number; maxTokens: number }
): Promise<{
  content: string;
  tokensUsed: { prompt: number; completion: number; total: number };
  executionTimeMs: number;
}> {
  const client = getClient(apiKey);
  const start = Date.now();

  const response = await client.chat.completions.create(
    {
      model: apiIdentifier,
      messages: [{ role: "user", content: prompt }],
      temperature: options.temperature,
      max_tokens: options.maxTokens,
    },
    { timeout: REQUEST_TIMEOUT_MS }
  );

  const executionTimeMs = Date.now() - start;
  const message = response.choices?.[0]?.message;
  // Reasoning models (e.g. DeepSeek R1) put chain-of-thought in reasoning_content
  // and may return empty content if they exhaust max_tokens on thinking
  const reasoningContent = (message as unknown as { reasoning_content?: string })?.reasoning_content;
  const content: string = message?.content || reasoningContent || "";
  const usage = response.usage;

  return {
    content,
    tokensUsed: {
      prompt: usage?.prompt_tokens ?? 0,
      completion: usage?.completion_tokens ?? 0,
      total: usage?.total_tokens ?? 0,
    },
    executionTimeMs,
  };
}
