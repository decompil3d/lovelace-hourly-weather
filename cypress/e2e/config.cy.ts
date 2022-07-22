describe('Config', () => {
  beforeEach(() => {
    cy.visitHarness();
  });
  it('errors for num_segments < 2', () => {
    cy.configure({
      num_segments: '1'
    });
    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'num_segments must be an even integer greater than or equal to 2');
  });
  it('errors for offset < 0', () => {
    cy.configure({
      offset: '-1'
    });
    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'offset must be a positive integer');
  });
  it('errors for num_segments > forecast length', () => {
    cy.configure({
      num_segments: '50'
    });
    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'Too many forecast segments requested in num_segments. Must be <= number of segments in forecast entity.');
  });
  it('errors for num_segments > forecast length - offset', () => {
    cy.configure({
      num_segments: '12',
      offset: '50'
    });
    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'Too many forecast segments requested in num_segments. Must be <= number of segments in forecast entity.');
  });
  it('warns for daily forecasts', () => {
    cy.addEntity({
      'weather.daily': {
        attributes: {
          forecast: [{
            clouds: 100,
            condition: 'cloudy',
            datetime: '2022-06-03T22:00:00+00:00',
            precipitation: 0,
            precipitation_probability: 85,
            pressure: 1007,
            temperature: 61,
            wind_bearing: 153,
            wind_speed: 3.06
          }, {
            clouds: 100,
            condition: 'cloudy',
            datetime: '2022-06-04T22:00:00+00:00',
            precipitation: 0,
            precipitation_probability: 85,
            pressure: 1007,
            temperature: 61,
            wind_bearing: 153,
            wind_speed: 3.06
          }, {
            clouds: 100,
            condition: 'cloudy',
            datetime: '2022-06-05T22:00:00+00:00',
            precipitation: 0,
            precipitation_probability: 85,
            pressure: 1007,
            temperature: 61,
            wind_bearing: 153,
            wind_speed: 3.06
          }]
        }
      }
    });
    cy.configure({
      entity: 'weather.daily',
      num_segments: '3'
    });
    cy.get('hui-warning')
      .shadow()
      .slotAssignedNodes()
      .should('have.length', 1)
      .its(0)
      .its('textContent')
      .should('eq', 'The selected weather entity seems to provide daily forecasts. Consider switching to an hourly entity.');
  });
});
