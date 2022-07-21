import { defineConfig } from "cypress";

export default defineConfig({
  includeShadowDom: true,
  e2e: {
    baseUrl: 'http://localhost:8000/cypress/fixtures/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
