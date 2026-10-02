import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/", "resources/"]),
  {
    // application code: ES modules running in the browser
    files: ["src/**/*.{js,ts}"],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    // the project's coding rules (AGENTS.md), enforced instead of reviewed
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      eqeqeq: ["error", "always"],
      "no-console": ["error", { allow: ["warn", "error"] }],
    },
  },
  {
    // TypeScript modules: rules that use the type information (via
    // tsconfig.json), e.g. no-unsafe-* for any-typed values from library
    // APIs such as JSON.parse, and no-floating-promises. no-explicit-any is
    // included. Type errors themselves are reported by tsc, not by ESLint.
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // tool configuration files run in Node
    files: ["*.config.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  // last: turns off every rule that would conflict with Prettier's formatting
  eslintConfigPrettier,
]);
