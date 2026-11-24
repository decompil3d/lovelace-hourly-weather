# Contributing Translations

Thank you for helping translate **Hourly Weather Card**!

Pull requests that modify or add files in `src/localize/languages/*.json` automatically run the **Validate localization files** workflow (`validate-loc`) to verify that all required files, imports, and tests are updated.

---

## Updating an Existing Language

1. Open the corresponding file in `src/localize/languages/<lang>.json` (using `src/localize/languages/en.json` as the source of truth).
2. Add any missing keys or improve existing translations.
   * **Do not** rename or translate the JSON keys (left of `:`).
   * **Do** keep placeholders (such as `{0}`, `{1}`, etc.) intact.
3. Ensure the file is valid JSON with no syntax errors or trailing commas.

---

## Adding a New Language

When adding a brand-new language file, the `validate-loc` CI workflow enforces **four required updates**. All four must be included in your pull request for checks to pass.

### 1. Create the language JSON file
* Copy `src/localize/languages/en.json` to `src/localize/languages/<lang>.json`.
* Name the file using its ISO 639-1 two-letter language code (e.g., `fr.json`, `de.json`) or hyphenated regional code (e.g., `pt-BR.json`, `zh-TW.json`).
* Translate all string values while keeping the JSON keys and placeholders unchanged.

### 2. Import and register the language in `src/localize/localize.ts`
The CI check uses strict pattern matching against `src/localize/localize.ts`. If your language code contains a hyphen (e.g., `pt-BR`), replace the hyphen with an underscore (`pt_BR`) for the JavaScript identifier:

1. **Add the import statement** at the top of `src/localize/localize.ts` in alphabetical order with the existing languages:
   ```ts
   import * as pt_BR from './languages/pt-BR.json';
   ```
   *(For non-hyphenated codes like `fr`, use `import * as fr from './languages/fr.json';`)*

2. **Add the variable to the `languages` object** in `src/localize/localize.ts` (again, preserving alphabetical order):
   ```ts
   const languages: Record<string, unknown> = {
     // ...existing languages
     pt_BR,
   };
   ```

### 3. Add the language to `.github/workflows/translate.yml` (if applicable)
* **Required** for all languages that are supported by the Google Cloud Translate API (see list [here](https://docs.cloud.google.com/translate/docs/languages)).
* **Not required** for other languages that are not supported by that API. However, it is best if you can add a mapping from another supported language. For example, if you are adding a sub-locale like `aa-BB`, and translations for `aa` exist, you should add a mapping for `aa=>aa-BB` in the next step of this workflow.
* If required, add a `to:` entry for your language code in `.github/workflows/translate.yml` matching the existing entries.

### 4. Add an E2E test expectation in `cypress/e2e/localization.cy.ts`
Add your language code and its expected translated string to the `expectedTranslations` map in `cypress/e2e/localization.cy.ts`:

```ts
const expectedTranslations = {
  // ...existing languages
  'pt-BR': 'Expected translated string here',
};
```
*(Quotes around the key are optional for non-hyphenated codes like `fr: '...'`, and required for hyphenated codes like `'pt-BR': '...'`.)*

---

## Submitting Your Pull Request

1. Fork the repository and create a new branch (e.g., `feat/add-fr-translation`).
2. Commit all modified/added files (`src/localize/languages/<lang>.json`, `src/localize/localize.ts`, `cypress/e2e/localization.cy.ts`, and `.github/workflows/translate.yml` if applicable).
3. Open a **Pull Request** against `main` and verify that the **Validate localization files** check passes once it has been approved to run.
