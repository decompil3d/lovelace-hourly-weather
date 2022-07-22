/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { HourlyWeatherCardConfig } from "../../src/types"
import { defaultConfig } from "../fixtures/test-utils"

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('configure', (config: Partial<HourlyWeatherCardConfig>) => {
  cy.window().invoke('setHWConfig', {
    ...defaultConfig,
    ...config
  }).wait(1);
});

declare global {
  namespace Cypress {
    interface Chainable {
      configure(config: Partial<HourlyWeatherCardConfig>): Chainable<void>;
    }
  }
}
