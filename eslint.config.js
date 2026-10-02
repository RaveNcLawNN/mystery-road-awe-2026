import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/", "resources/"]),
  {
    // application code: ES modules running in the browser
    files: ["src/**/*.js"],
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
