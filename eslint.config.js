import eslint from "@eslint/js"
import ts from "typescript-eslint"
import prettier from "eslint-config-prettier"
import imports from "eslint-plugin-simple-import-sort"
import { defineConfig } from "eslint/config"

export default defineConfig(
  { ignores: ["node_modules/", "dist/"] },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ts.configs.strictTypeChecked,
      ts.configs.stylisticTypeChecked,
      prettier,
    ],
    plugins: {
      imports,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "imports/imports": "warn",
      "imports/exports": "warn",
    },
  },
)
