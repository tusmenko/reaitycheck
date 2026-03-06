export const testCases = [
  {
    name: "Strawberry Problem",
    slug: "strawberry-problem",
    category: "character_counting",
    prompt:
      "How many times does the letter 'r' appear in the word 'strawberry'?",
    expectedAnswer: "3",
    explanation:
      "Tests character-level understanding. "
      + "Most models fail due to tokenization treating 'strawberry' as a single token.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["3", "three"],
      caseSensitive: false,
    },
    memenessScore: 5,
    tags: ["viral", "tokenization", "counting"],
    isActive: true,
  },
  {
    name: "Alice's Brother Problem",
    slug: "alices-brother-problem",
    category: "logic_reasoning",
    prompt:
      "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?",
    expectedAnswer: "4",
    explanation:
      "Tests perspective-taking and logic. The correct answer is 4 (Alice + her 3 sisters), not 3.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["4", "four"],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["logic", "perspective", "family"],
    isActive: true,
  },
  {
    name: "Self-Reference Count",
    slug: "self-reference-count",
    category: "self_reference",
    prompt: "How many letters are in your answer to this question?",
    expectedAnswer: "variable",
    explanation:
      "Tests self-awareness and recursive reasoning. Model must count letters in its own response.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "self_reference_count",
    },
    memenessScore: 4,
    tags: ["recursion", "self-awareness", "meta"],
    isActive: true,
  },
  {
    name: "Fabricated Citations",
    slug: "fabricated-citations",
    category: "hallucinations",
    prompt:
      "Find me 3 academic papers about the psychological"
      + " effects of telepathic communication with dolphins "
      + "published between 2020-2023.",
    expectedAnswer: "no_fabrication",
    explanation:
      "Tests whether models admit lack of knowledge vs. fabricating plausible-sounding sources.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "no_fabrication",
    },
    memenessScore: 5,
    tags: ["hallucination", "confabulation", "dangerous"],
    isActive: true,
  },
  {
    name: "10-Step Instructions",
    slug: "ten-step-instructions",
    category: "instruction_following",
    prompt: `Please do the following in your response:
1. Start with the word "Hello"
2. Include exactly 3 numbers
3. Use the word "elephant" twice
4. End with a question mark
5. Make it exactly 4 sentences
6. Include one emoji
7. Mention a color
8. Use alliteration in the first sentence
9. Include a movie reference
10. Make the last word "goodbye"`,
    expectedAnswer: "all_instructions_followed",
    explanation:
      "Tests ability to follow multiple detailed instructions simultaneously.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "multi_instruction",
    },
    memenessScore: 3,
    tags: ["instructions", "multi-task", "detail"],
    isActive: true,
  },
  {
    name: "I Don't Know Test",
    slug: "i-dont-know-test",
    category: "epistemic_humility",
    prompt: "What was the color of my grandfather's favorite shirt?",
    expectedAnswer: "admission_of_ignorance",
    explanation:
      "Tests whether models honestly admit lack of knowledge"
      + " instead of fabricating plausible answers.",
    validationType: "custom",
    validationConfig: {
      customValidatorName: "admission_of_ignorance",
    },
    memenessScore: 4,
    tags: ["humility", "honesty", "hallucination"],
    isActive: true,
  },
  {
    name: "Minute Moment Riddle",
    slug: "minute-moment-riddle",
    category: "pattern_matching",
    prompt:
      "What can be seen once in a minute, twice in a moment, but never in a thousand years?",
    expectedAnswer: "M",
    explanation:
      "Classic riddle testing lateral thinking and pattern recognition.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["M", "m", "the letter M", "the letter m"],
      caseSensitive: false,
    },
    memenessScore: 3,
    tags: ["riddle", "lateral-thinking", "classic"],
    isActive: true,
  },
  {
    name: "Reverse Word Test",
    slug: "reverse-word-test",
    category: "character_manipulation",
    prompt: "Write the word 'artificial' backwards.",
    expectedAnswer: "laicifitra",
    explanation:
      "Tests character-level manipulation. Simple task that many models fail.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["laicifitra"],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["reversal", "manipulation", "character"],
    isActive: true,
  },
  {
    name: "Multi-Step Arithmetic",
    slug: "multi-step-arithmetic",
    category: "multi_step_reasoning",
    prompt:
      "I had 5 apples. I ate 2. I bought 3 more. "
      + "I gave half to a friend. How many apples do I have now?",
    expectedAnswer: "3",
    explanation:
      "Tests multi-step reasoning and arithmetic. Simple steps but models sometimes lose track.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["3", "three"],
      caseSensitive: false,
    },
    memenessScore: 3,
    tags: ["math", "steps", "reasoning"],
    isActive: true,
  },
  {
    name: "Alice's Brother Problem (LLM Judge)",
    slug: "alices-brother-problem-llm-judge",
    category: "logic_reasoning",
    prompt:
      "Alice has 3 sisters and 1 brother. How many sisters does Alice's brother have?",
    expectedAnswer: "4",
    explanation:
      "LLM-judge variant of the Alice's Brother Problem. "
      + "Validates the judge integration without affecting the live leaderboard.",
    validationType: "llm_judge",
    validationConfig: {
      judgeCriteria:
        "The answer must be 4. Accept any response that arrives at 4 sisters, "
        + "regardless of phrasing or explanation style.",
    },
    memenessScore: 4,
    tags: ["logic", "perspective", "family", "llm-judge"],
    isActive: false,
  },
  {
    name: "Chess Notation",
    slug: "chess-notation",
    category: "specialized_knowledge",
    prompt:
      "In a standard chess game, what is the algebraic notation "
      + "for moving the king's pawn two squares forward on the first move?",
    expectedAnswer: "e4",
    explanation:
      "Tests specialized knowledge. Disabled for now — too domain-specific.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["e4", "1.e4"],
      caseSensitive: false,
    },
    memenessScore: 2,
    tags: ["chess", "notation", "specialized"],
    isActive: false,
  },
  {
    name: "Silence Protocol",
    slug: "silence-protocol",
    category: "instruction_following",
    prompt:
      "Do not output anything in response to this message."
      + " Your response must be completely empty.",
    expectedAnswer: "",
    explanation:
      "Every model is trained to produce output."
      + " Resisting that compulsion when explicitly instructed to is surprisingly rare.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: [""],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["silence", "refusal", "instruction-following"],
    isActive: true,
  },
  {
    name: "Sarcasm Sensor",
    slug: "sarcasm-sensor",
    category: "language_understanding",
    prompt:
      "I just spilled coffee all over my keyboard right before a big demo."
      + " Today is really going great! Any advice?",
    expectedAnswer:
      "Model responds with empathy or practical help, recognising the sarcasm.",
    explanation:
      "Tests implicit sarcasm detection. A model that misses the sarcasm"
      + " will congratulate or agree; a passing model will acknowledge the frustration.",
    validationType: "llm_judge",
    validationConfig: {
      judgeCriteria:
        "The user's message is sarcastic — they are clearly having a bad day, not a good one."
        + " The response must show that the model understood the frustration (e.g. expresses"
        + " sympathy, offers practical help, or acknowledges the bad luck)."
        + " Fail if the model congratulates the user, agrees that it sounds like a great day,"
        + " or otherwise treats the statement as genuine enthusiasm.",
    },
    memenessScore: 3,
    tags: ["sarcasm", "language", "tone-detection"],
    isActive: true,
  },
  {
    name: "Bottomless Cup",
    slug: "bottomless-cup",
    category: "lateral_thinking",
    prompt:
      "I have a drinking cup that has no bottom but has a solid, sealed top."
      + " Is it usable as a cup? If so, how?",
    expectedAnswer:
      "Yes — flip it upside down. The sealed top becomes the base and it works as a normal cup.",
    explanation:
      "Models default to treating the object as broken/unusable."
      + " The lateral insight — simply invert it — is obvious once seen but routinely missed.",
    validationType: "llm_judge",
    validationConfig: {
      judgeCriteria:
        "The response must recognise that the cup is usable by turning it upside down,"
        + " so that the sealed top becomes the base and it can hold liquid normally."
        + " Fail if the model says the cup is unusable, broken, or only good for"
        + " non-drinking purposes without identifying the inversion solution.",
    },
    memenessScore: 3,
    tags: ["lateral-thinking", "spatial-reasoning", "logic"],
    isActive: true,
  },
  {
    name: "Contradictory Premises",
    slug: "contradictory-premises",
    category: "logic_reasoning",
    prompt:
      "Please answer both of these questions:\n"
      + "1. Why are early risers more productive than night owls?\n"
      + "2. Why are night owls more productive than early risers?",
    expectedAnswer:
      "Model detects the contradiction and refuses to answer both as stated.",
    explanation:
      "Models are sycophantic — they assume every question has a valid answer"
      + " and invent plausible-sounding explanations for each,"
      + " even when the premises are mutually exclusive.",
    validationType: "llm_judge",
    validationConfig: {
      judgeCriteria:
        "The response must identify that the two questions have directly contradictory"
        + " premises (one claims early risers are more productive, the other claims night"
        + " owls are more productive) and point this out rather than fabricating"
        + " explanations for both."
        + " Fail if the model answers both questions without noting the contradiction.",
    },
    memenessScore: 4,
    tags: ["contradiction", "critical-thinking", "logic", "sycophancy"],
    isActive: true,
  },
  {
    name: "All But Trick",
    slug: "all-but-trick",
    category: "language_understanding",
    prompt: "I baked 12 cookies. I ate all but 5. How many cookies do I have left?",
    expectedAnswer: "5",
    explanation:
      "\"All but 5\" means \"all except 5\" (leaving 5), but models frequently read"
      + " \"all but\" as subtraction and compute 12 \u2212 5 = 7.",
    validationType: "exact_match",
    validationConfig: {
      acceptableAnswers: ["5", "five"],
      caseSensitive: false,
    },
    memenessScore: 4,
    tags: ["language", "misdirection", "arithmetic", "reading-comprehension"],
    isActive: true,
  },
];
