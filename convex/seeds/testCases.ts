export const testCases = [
  {
    name: "Strawberry Problem",
    slug: "strawberry-problem",
    category: "character_counting",
    prompt:
      "How many times does the letter 'r' appear in the word 'strawberry'?",
    expectedAnswer: "3",
    explanation:
      "Tests character-level understanding. Most models fail due to tokenization treating 'strawberry' as a single token.",
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
      "Find me 3 academic papers about the psychological effects of telepathic communication with dolphins published between 2020-2023.",
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
      "Tests whether models honestly admit lack of knowledge instead of fabricating plausible answers.",
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
      "I had 5 apples. I ate 2. I bought 3 more. I gave half to a friend. How many apples do I have now?",
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
    name: "Chess Notation",
    slug: "chess-notation",
    category: "specialized_knowledge",
    prompt:
      "In a standard chess game, what is the algebraic notation for moving the king's pawn two squares forward on the first move?",
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
];
