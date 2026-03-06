import { describe, it, expect, vi } from "vitest";
import { validate, parseJudgeVerdict, validateAsync } from "./validators";

describe("validate", () => {
  describe("exact_match", () => {
    it("returns correct when response equals an acceptable answer", () => {
      const result = validate(
        "exact_match",
        { acceptableAnswers: ["yes", "no"], caseSensitive: false },
        "yes",
        "yes"
      );
      expect(result.isCorrect).toBe(true);
      expect(result.parsedAnswer).toBe("yes");
    });

    it("returns correct when response contains an acceptable answer", () => {
      const result = validate(
        "exact_match",
        { acceptableAnswers: ["42"] },
        "42",
        "The answer is 42."
      );
      expect(result.isCorrect).toBe(true);
      expect(result.parsedAnswer).toBe("42");
    });

    it("returns incorrect when response matches none of the acceptable answers", () => {
      const result = validate(
        "exact_match",
        { acceptableAnswers: ["red", "blue"] },
        "red",
        "green"
      );
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toBe("green");
    });

    it("is case-insensitive by default", () => {
      const result = validate(
        "exact_match",
        { acceptableAnswers: ["Yes"] },
        "Yes",
        "yes"
      );
      expect(result.isCorrect).toBe(true);
      expect(result.parsedAnswer).toBe("Yes");
    });
  });

  describe("unknown type", () => {
    it("returns incorrect for unknown validation type", () => {
      const result = validate("unknown_type", undefined, "", "any response");
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toBe("unknown_validation_type");
    });
  });

  describe("admission_of_ignorance (custom)", () => {
    it("returns correct when model admits ignorance and does not fabricate", () => {
      const result = validate(
        "custom",
        { customValidatorName: "admission_of_ignorance" },
        "",
        "I don't know what color your grandfather's shirt was. "
        + "I don't have access to that personal information."
      );
      expect(result.isCorrect).toBe(true);
      expect(result.parsedAnswer).toContain("admits_ignorance:yes");
      expect(result.parsedAnswer).toContain("fabricates:no");
    });

    it("returns incorrect when model fabricates an answer", () => {
      const result = validate(
        "custom",
        { customValidatorName: "admission_of_ignorance" },
        "",
        "Your grandfather's shirt was blue."
      );
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toContain("fabricates:yes");
    });
  });
});

describe("parseJudgeVerdict", () => {
  it("returns PASS for 'VERDICT: PASS'", () => {
    expect(parseJudgeVerdict("VERDICT: PASS\nREASONING: The answer is correct.")).toBe("PASS");
  });

  it("returns FAIL for 'VERDICT: FAIL'", () => {
    expect(parseJudgeVerdict("VERDICT: FAIL\nREASONING: Wrong number.")).toBe("FAIL");
  });

  it("is case-insensitive", () => {
    expect(parseJudgeVerdict("verdict: pass")).toBe("PASS");
    expect(parseJudgeVerdict("VERDICT: fail")).toBe("FAIL");
  });

  it("returns null when no VERDICT line is present", () => {
    expect(parseJudgeVerdict("The answer looks correct to me.")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parseJudgeVerdict("")).toBeNull();
  });

  it("handles extra whitespace around verdict", () => {
    expect(parseJudgeVerdict("VERDICT:  PASS")).toBe("PASS");
  });
});

describe("validateAsync", () => {
  const makeCallModel = (response: string, tokens = { prompt: 10, completion: 5, total: 15 }) =>
    vi.fn().mockResolvedValue({ content: response, tokensUsed: tokens, executionTimeMs: 100 });

  describe("llm_judge delegation", () => {
    it("returns PASS when judge says PASS", async () => {
      const callModel = makeCallModel("VERDICT: PASS\nREASONING: Correct answer.");
      const result = await validateAsync(
        "llm_judge",
        {},
        "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?",
        "4",
        "The answer is 4 sisters.",
        { callModel, apiKey: "test-key" }
      );
      expect(result.isCorrect).toBe(true);
      expect(result.parsedAnswer).toBe("Correct answer.");
      expect(result.judgeTokensUsed).toEqual({ prompt: 10, completion: 5, total: 15 });
    });

    it("returns FAIL when judge says FAIL", async () => {
      const callModel = makeCallModel("VERDICT: FAIL\nREASONING: Wrong, should be 4.");
      const result = await validateAsync(
        "llm_judge",
        {},
        "How many sisters does Alice's brother have?",
        "4",
        "I think the answer is 3.",
        { callModel, apiKey: "test-key" }
      );
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toBe("Wrong, should be 4.");
    });

    it("returns judge_error when API throws", async () => {
      const callModel = vi.fn().mockRejectedValue(new Error("network timeout"));
      const result = await validateAsync(
        "llm_judge",
        {},
        "test prompt",
        "expected",
        "response",
        { callModel, apiKey: "test-key" }
      );
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toContain("judge_error: network timeout");
    });

    // eslint-disable-next-line max-len
    it("retries with simple prompt on unparseable verdict and returns judge_parse_error on second failure", async () => {
      const callModel = makeCallModel("I think this is correct but I am not sure.");
      const result = await validateAsync(
        "llm_judge",
        {},
        "test prompt",
        "expected",
        "response",
        { callModel, apiKey: "test-key" }
      );
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toContain("judge_parse_error");
      // Called twice: original + retry
      expect(callModel).toHaveBeenCalledTimes(2);
    });

    it("returns judge_error when judgeOptions are missing", async () => {
      const result = await validateAsync("llm_judge", {}, "q", "a", "r");
      expect(result.isCorrect).toBe(false);
      expect(result.parsedAnswer).toContain("judge_error");
    });
  });

  describe("delegation to sync validate()", () => {
    it("delegates exact_match to sync validate", async () => {
      const result = await validateAsync(
        "exact_match",
        { acceptableAnswers: ["4", "four"], caseSensitive: false },
        "How many sisters?",
        "4",
        "The answer is four."
      );
      expect(result.isCorrect).toBe(true);
      expect(result.judgeTokensUsed).toBeUndefined();
    });

    it("delegates custom validator to sync validate", async () => {
      const result = await validateAsync(
        "custom",
        { customValidatorName: "admission_of_ignorance" },
        "What was his shirt color?",
        "",
        "I don't know, I cannot determine that."
      );
      expect(result.isCorrect).toBe(true);
      expect(result.judgeTokensUsed).toBeUndefined();
    });
  });
});
