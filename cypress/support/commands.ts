/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

import { ForecastSegment, HourlyWeatherCardConfig } from "../../src/types";
import { defaultConfig } from "../fixtures/test-utils";

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

Cypress.Commands.add('visitHarness', (windowStubFn) => {
  let visitOpts: Partial<Cypress.VisitOptions> | undefined = void 0;
  if (windowStubFn) {
    visitOpts = {
      onLoad(win) {
        windowStubFn(win);
      }
    };
  }
  cy.visit('harness.html', visitOpts);
  cy.window().should('have.property', 'appReady', true);
});

Cypress.Commands.add('configure', (config: Partial<HourlyWeatherCardConfig>, noDefaults?: boolean) => {
  const cfg = noDefaults ? config : { ...defaultConfig, ...config };
  cy.window().invoke('setHWConfig', cfg).wait(1);
});

Cypress.Commands.add('addEntity', (entities: Record<string, Cypress.WeatherEntity>) => {
  cy.window().invoke('addHWEntity', entities).wait(1);
});

Cypress.Commands.add('addForecast', (entityId: string, forecast: ForecastSegment[]) => {
  cy.window().invoke('addHWForecast', entityId, forecast).wait(1);
});

Cypress.Commands.add('enableForecastSubscriptions', () => {
  cy.window().invoke('enableHWForecastSubscriptions').wait(1);
});

Cypress.Commands.add('updateLastForecastSubscription', (forecast: ForecastSegment[]) => {
  cy.window().invoke('updateLastForecastSubscription', forecast).wait(1);
});

interface HALocale {
  language: string;
  number_format: string;
  time_format: string;
}

Cypress.Commands.add('setLocale', (locale: Partial<HALocale>) => {
  cy.window().invoke('setHWLocale', locale).wait(1);
});

Cypress.Commands.add('slotAssignedNodes', { prevSubject: true }, (subject, name) => {
  let slot: Cypress.JQueryWithSelector<HTMLSlotElement>;
  if (name) {
    slot = subject.find(`slot[name="${name}"]`) as Cypress.JQueryWithSelector<HTMLSlotElement>;
  } else {
    slot = subject.find('slot') as Cypress.JQueryWithSelector<HTMLSlotElement>;
  }
  return cy.wrap(slot.get(0).assignedNodes());
});

declare global {
  namespace Cypress {
    interface WeatherEntity {
      attributes: {
        wind_speed_unit?: string,
        forecast?: ForecastSegment[];
      };
    }
    interface Chainable {
      visitHarness(windowStubFn?: (win: Cypress.AUTWindow) => void): Chainable<Window>;
      configure(config: Partial<HourlyWeatherCardConfig>, noDefaults?: boolean): Chainable<void>;
      addEntity(entities: Record<string, WeatherEntity>): Chainable<void>;
      addForecast(entityId: string, forecast: ForecastSegment[]): Chainable<void>;
      enableForecastSubscriptions(): Chainable<void>;
      updateLastForecastSubscription(forecast: ForecastSegment[]): Chainable<void>;
      setLocale(locale: Partial<HALocale>): Chainable<void>;
      slotAssignedNodes(name?: string): Chainable<Node[]>;
    }
  }
}
