import { defineConfig } from "cypress";

export default defineConfig({
  projectId: 'o468vw',
  includeShadowDom: true,
  e2e: {
    baseUrl: 'http://localhost:8000/cypress/fixtures/'
  },
});
