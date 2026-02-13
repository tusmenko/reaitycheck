import { describe, it, expect } from "vitest";
import { validate } from "./validators";

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

  describe("admission_of_ignorance (custom)", () => {
    it("returns correct when model admits ignorance and does not fabricate", () => {
      const result = validate(
        "custom",
        { customValidatorName: "admission_of_ignorance" },
        "",
        "I don't know what color your grandfather's shirt was. I don't have access to that personal information."
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
