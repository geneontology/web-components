import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          // The `h` variable is Stencil's JSX factory function
          varsIgnorePattern: "^h$",
        },
      ],
    },
  },
  {
    ignores: [
      "packages/web-components/src/globals/@noctua.form/*",
      "packages/*/.stencil",
      "packages/*/dist",
      "packages/*/loader",
      "packages/*/www",
      "website/.docusaurus",
      "website/build",
    ],
  },
);
