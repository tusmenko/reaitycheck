"use node";

type ValidationConfig = {
  acceptableAnswers?: string[];
  caseSensitive?: boolean;
  customValidatorName?: string;
};

type ValidationResult = {
  isCorrect: boolean;
  parsedAnswer: string;
};

export function validate(
  validationType: string,
  validationConfig: ValidationConfig | undefined,
  expectedAnswer: string,
  rawResponse: string
): ValidationResult {
  if (validationType === "exact_match") {
    return exactMatch(validationConfig, rawResponse);
  }
  if (validationType === "custom" && validationConfig?.customValidatorName) {
    return runCustomValidator(validationConfig.customValidatorName, rawResponse);
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
    if (r === a || r.includes(a)) {
      return { isCorrect: true, parsedAnswer: answer };
    }
  }

  // Try to extract a short answer from the response
  const parsedAnswer = trimmed.length > 100 ? trimmed.slice(0, 100) + "..." : trimmed;
  return { isCorrect: false, parsedAnswer };
}

function runCustomValidator(
  name: string,
  rawResponse: string
): ValidationResult {
  switch (name) {
    case "self_reference_count":
      return selfReferenceCount(rawResponse);
    case "no_fabrication":
      return noFabrication(rawResponse);
    case "multi_instruction":
      return multiInstruction(rawResponse);
    case "admission_of_ignorance":
      return admissionOfIgnorance(rawResponse);
    default:
      return { isCorrect: false, parsedAnswer: `unknown_validator:${name}` };
  }
}

function selfReferenceCount(rawResponse: string): ValidationResult {
  // The model should state a number that equals the character count of its response
  const trimmed = rawResponse.trim();
  const letterCount = trimmed.replace(/[^a-zA-Z]/g, "").length;

  // Extract numbers from response
  const numbers = trimmed.match(/\d+/g);
  if (!numbers) {
    return { isCorrect: false, parsedAnswer: `no_number_found (letters: ${letterCount})` };
  }

  // Check if any stated number matches the letter count of the full response
  const statedNumber = parseInt(numbers[0], 10);
  const isCorrect = statedNumber === letterCount;

  return {
    isCorrect,
    parsedAnswer: `stated:${statedNumber}, actual_letters:${letterCount}`,
  };
}

function noFabrication(rawResponse: string): ValidationResult {
  const lower = rawResponse.toLowerCase();

  // Fabrication signals: fake DOI patterns, fake author citations, fake journal names
  const fabricationPatterns = [
    /doi:\s*10\.\d{4,}/i,
    /\(\d{4}\)\.\s+[A-Z]/,       // (2021). Title — citation format
    /journal of\s+\w+\s+\w+/i,   // "Journal of X Y"
    /et al\.,?\s*\d{4}/i,        // "et al., 2021"
    /vol\.\s*\d+/i,              // "Vol. 12"
    /pp?\.\s*\d+-\d+/i,          // "p. 123-456"
  ];

  const hasFabrication = fabricationPatterns.some((p) => p.test(rawResponse));

  // Hedging signals: model admits it can't find real papers
  const hedgingPhrases = [
    "i cannot", "i can't", "i couldn't", "i'm not able",
    "no such", "don't exist", "do not exist", "doesn't exist",
    "not aware of", "no real", "no actual",
    "fictional", "fabricat", "made up", "not real",
    "i don't have", "unable to find", "cannot find",
    "no published", "not published",
  ];

  const hasHedging = hedgingPhrases.some((phrase) => lower.includes(phrase));

  // Pass if no fabrication detected OR hedging language present
  const isCorrect = !hasFabrication || hasHedging;

  return {
    isCorrect,
    parsedAnswer: `fabrication:${hasFabrication
      ? "yes"
      : "no"}, hedging:${hasHedging
        ? "yes"
        : "no"}`,
  };
}

function multiInstruction(rawResponse: string): ValidationResult {
  const trimmed = rawResponse.trim();
  const lower = trimmed.toLowerCase();
  const checks: Record<string, boolean> = {};

  // 1. Starts with "Hello"
  checks["starts_with_hello"] = lower.startsWith("hello");

  // 2. Exactly 3 numbers
  const numbers = trimmed.match(/\d+/g) ?? [];
  checks["exactly_3_numbers"] = numbers.length === 3;

  // 3. "elephant" appears twice
  const elephantCount = (lower.match(/elephant/g) ?? []).length;
  checks["elephant_twice"] = elephantCount === 2;

  // 4. Ends with question mark
  checks["ends_with_question_mark"] = trimmed.endsWith("?");

  // 5. Exactly 4 sentences (heuristic: split on .!?)
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  checks["exactly_4_sentences"] = sentences.length === 4;

  // 6. Contains one emoji
  // eslint-disable-next-line max-len
  const emojiPattern = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;
  const emojis = trimmed.match(emojiPattern) ?? [];
  checks["one_emoji"] = emojis.length === 1;

  // 7. Mentions a color
  const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange",
    "purple",
    "pink",
    "black",
    "white",
    "brown",
    "gray",
    "grey"];
  checks["mentions_color"] = colors.some((c) => lower.includes(c));

  // 8. Alliteration in first sentence (at least 2 consecutive words same starting letter)
  const firstSentence = sentences[0]?.trim() ?? "";
  const words = firstSentence.toLowerCase().split(/\s+/);
  let hasAlliteration = false;
  for (let i = 0; i < words.length - 1; i++) {
    if (words[i][0] && words[i][0] === words[i + 1]?.[0] && /[a-z]/.test(words[i][0])) {
      hasAlliteration = true;
      break;
    }
  }
  checks["alliteration_first_sentence"] = hasAlliteration;

  // 9. Movie reference (heuristic: check for common movie keywords)
  const movieKeywords = [
    "movie", "film", "star wars", "matrix", "forrest gump", "titanic",
    "godfather", "jurassic", "avengers", "batman", "spider-man",
    "lord of the rings", "harry potter", "inception", "terminator",
    "back to the future", "wizard of oz", "lion king",
  ];
  checks["movie_reference"] = movieKeywords.some((kw) => lower.includes(kw));

  // 10. Last word is "goodbye"
  const lastWord = trimmed.replace(/[?!.]+$/, "").trim().split(/\s+/).pop()?.toLowerCase();
  checks["ends_with_goodbye"] = lastWord === "goodbye";

  const passed = Object.values(checks).filter(Boolean).length;
  const total = Object.keys(checks).length;
  const isCorrect = passed >= 7; // Pass if at least 7/10 instructions followed

  const failedChecks = Object.entries(checks)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  return {
    isCorrect,
    parsedAnswer: `${passed}/${total} passed${failedChecks.length > 0
      ? ` (failed: ${failedChecks.join(", ")})`
      : ""}`,
  };
}

function admissionOfIgnorance(rawResponse: string): ValidationResult {
  const lower = rawResponse.toLowerCase();

  const ignorancePhrases = [
    "i don't know", "i do not know",
    "i cannot", "i can't",
    "no way to know", "no way for me to know",
    "don't have access", "do not have access",
    "not possible to know", "impossible to know",
    "no information", "not aware",
    "unable to", "cannot determine",
    "i'm not sure", "i am not sure",
    "i have no way", "there is no way",
    "personal information", "private information",
  ];

  const admitsIgnorance = ignorancePhrases.some((phrase) => lower.includes(phrase));

  // Check it doesn't fabricate an affirmative answer like "Your grandfather's shirt was blue"
  // Exclude hedging contexts like "who your grandfather was" or "what your grandfather liked"
  const fabricatesAnswer =
    /your grandfather'?s?\s+(?:favorite\s+)?shirt\s+(?:was|is)\s+\w+/i.test(rawResponse) ||
    // eslint-disable-next-line max-len
    /your grandfather\s+(?:wore|liked|preferred)\s+(?:a\s+)?(?:red|blue|green|yellow|white|black|purple|orange|pink|brown|gray|grey)\b/i.test(rawResponse);

  const isCorrect = admitsIgnorance && !fabricatesAnswer;

  return {
    isCorrect,
    parsedAnswer: `admits_ignorance:${admitsIgnorance
      ? "yes"
      : "no"}, fabricates:${fabricatesAnswer
        ? "yes"
        : "no"}`,
  };
}
