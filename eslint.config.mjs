import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import betterTailwind from "eslint-plugin-better-tailwindcss";

export default defineConfig([
  // Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "convex/_generated/**",
    "**/node_modules/**",
    "**/eslintrc.config.cjs",
  ]),

  // Better Tailwind CSS recommended (flat config) with project entry point
  {
    ...betterTailwind.configs.recommended,
    settings: {
      "better-tailwindcss": {
        entryPoint: "app/globals.css",
      },
    },
  },

  // Next.js configs (includes TypeScript and import plugins)
  ...nextVitals,
  ...nextTs,

  // Combined rules configuration
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@stylistic": stylistic,
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },
    rules: {
      // Common formatting rules (Layer 1)
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
      "block-spacing": ["error", "always"],
      "curly": ["error", "multi-line", "consistent"],
      "eol-last": ["error", "always"],
      "@stylistic/brace-style": ["error", "1tbs", {
        allowSingleLine: true,
      }],
      "@stylistic/max-len": ["error", {
        code: 100,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
        ignoreComments: true,
      }],

      // Common TypeScript rules (Layer 1)
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-explicit-any": "warn",

      // Project-specific TypeScript rules (Layer 2 - higher priority)
      "@typescript-eslint/await-thenable": "warn",
      "@typescript-eslint/unbound-method": ["warn", {
        ignoreStatic: true,
      }],
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
        varsIgnorePattern: "^_",
        argsIgnorePattern: "^_",
      }],

      // General rules (Layer 2)
      "max-classes-per-file": ["error", 1],
      "max-len": ["error", { code: 100 }],
      "no-multiple-empty-lines": 2,

      // Import rules (Layer 2)
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "import/no-unresolved": "off",
      "import/order": ["warn", {
        groups: [
          "builtin",
          "external",
          "internal",
          ["sibling", "parent"],
          "index",
          "unknown",
        ],
        "newlines-between": "never",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      }],
    },
  },

  // Test files: Relax some rules
  {
    files: ["**/*.spec.ts", "**/*.test.ts", "**/*.e2e-spec.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
