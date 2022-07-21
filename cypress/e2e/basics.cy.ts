import { defaultConfig } from '../fixtures/test-utils';

describe('basics', () => {
  beforeEach(() => {
    cy.visit('harness.html');
    cy.window().should('have.property', 'appReady', true);
  });
  it('renders an ha-card with appropriate title', () => {
    cy.window().invoke('setHWConfig', {
      ...defaultConfig,
      name: 'Some custom name'
    }).wait(1);
    cy.get('ha-card')
      .shadow()
      .find('h1')
      .should('have.text', 'Some custom name');
  });
});
