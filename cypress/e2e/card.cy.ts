describe('Card', () => {
  beforeEach(() => {
    cy.visitHarness();
  });
  it('shows appropriate title', () => {
    cy.get('ha-card')
      .shadow()
      .find('h1')
      .should('have.text', 'Hourly Weather');
    cy.configure({
      name: 'Some custom name'
    });
    cy.get('ha-card')
      .shadow()
      .find('h1')
      .should('have.text', 'Some custom name');
  });
  it('renders a graceful message when forecast is missing', () => {
    cy.addEntity({
      'weather.no_forecast': {
        // @ts-expect-error testing behavior with no forecast attribute
        attributes: {}
      }
    });
    cy.configure({
      entity: 'weather.no_forecast'
    });
    cy.get('ha-card')
      .find('h3')
      .should('have.text', 'Forecast not available');
    cy.get('ha-card')
      .find('p')
      .should('have.text', 'Check the configured forecast entity.');
  });
  it('renders a graceful message when forecast is empty', () => {
    cy.addEntity({
      'weather.empty_forecast': {
        attributes: {
          forecast: []
        }
      }
    });
    cy.configure({
      entity: 'weather.empty_forecast'
    });
    cy.get('ha-card')
      .find('h3')
      .should('have.text', 'Forecast not available');
    cy.get('ha-card')
      .find('p')
      .should('have.text', 'Check the configured forecast entity.');
  });
});
