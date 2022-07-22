describe('Card', () => {
  beforeEach(() => {
    cy.visit('harness.html');
    cy.window().should('have.property', 'appReady', true);
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
});
