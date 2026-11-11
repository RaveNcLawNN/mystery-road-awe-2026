import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist/", "resources/"]),
  {
    // application code: ES modules running in the browser
    files: ["src/**/*.{js,ts,tsx}"],
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
    // TypeScript: rules that use the type information (e.g. no-unsafe-*, no-floating-promises)
    files: ["src/**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // React: rules of hooks and complete useEffect dependency lists
    files: ["src/**/*.tsx"],
    extends: [reactHooks.configs.flat.recommended],
  },
  {
    // tool configuration files run in Node
    files: ["*.config.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    // the dev backend runs in Node; its terminal output is its only UI
    files: ["server/**/*.js"],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
  },
  // last: turns off rules that conflict with Prettier
  eslintConfigPrettier,
]);
