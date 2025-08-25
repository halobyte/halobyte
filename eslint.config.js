import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { includeIgnoreFile } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import eslint from "@eslint/js";
import prettier from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const base = tseslint.config(
  // Ignore files not tracked by VCS and any config files
  includeIgnoreFile(join(import.meta.dirname, ".gitignore")),
  { ignores: ["**/*.config.*"] },

  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],
  },

  ...compat.config({
    plugins: ["import"],
  }),

  {
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unnecessary-condition": [
        "error",
        {
          allowConstantLoopConditions: true,
        },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",
      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
    },
  },

  {
    linterOptions: { reportUnusedDisableDirectives: true },
    languageOptions: { parserOptions: { projectService: true } },
  },
);

/** @type {Awaited<import('typescript-eslint').Config>} */
const react = [
  { files: ["**/*.ts", "**/*.tsx"], plugins: { react: reactPlugin } },
  ...compat.config({
    plugins: ["react", "react-compiler", "react-hooks"],
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      "react-compiler/react-compiler": "error",
    },
    globals: {
      React: "writable",
    },
  }),
];

/** @type {Awaited<import('typescript-eslint').Config>} */
const next = [
  { files: ["**/*.ts", "**/*.tsx"] },
  ...compat.extends(
    "plugin:@next/next/recommended",
    "plugin:@next/next/core-web-vitals",
  ),
  {
    rules: {
      // TypeError: context.getAncestors is not a function
      "@next/next/no-duplicate-head": "off",
    },
  },
];

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...react,
  ...next,
  ...base,
  prettier,
];
