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
});
