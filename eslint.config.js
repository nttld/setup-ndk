const eslint = require("@eslint/js")
const ts = require("typescript-eslint")
const prettier = require("eslint-config-prettier")
const imports = require("eslint-plugin-simple-import-sort")

module.exports = ts.config(
  { ignores: ["node_modules/", "dist/"] },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...ts.configs.strictTypeChecked,
      ...ts.configs.stylisticTypeChecked,
      prettier,
    ],
    plugins: {
      imports,
    },
    languageOptions: {
      parserOptions: {
        EXPERIMENTAL_useProjectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "imports/imports": "warn",
      "imports/exports": "warn",
    },
  },
)
