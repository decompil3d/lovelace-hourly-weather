describe('Internationalization', () => {
  it('formats times correctly for 12 hour', () => {
    cy.visitHarness();
    cy.setLocale({
      language: 'en',
      number_format: 'language',
      time_format: '12'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.hour')
      .first()
      .should('have.text', '5 PM');
  });

  it('formats times correctly for 24 hour', () => {
    cy.visitHarness();
    cy.setLocale({
      language: 'en',
      number_format: 'language',
      time_format: '24'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.hour')
      .first()
      .should('have.text', '17:00');
  });

  it('formats times correctly for 24 hour with configuration hide_minutes as true', () => {
    cy.visitHarness();
    cy.configure({
      hide_minutes: true,
    });
    cy.setLocale({
      language: 'en',
      number_format: 'language',
      time_format: '24',
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.hour')
      .first()
      .should('have.text', '17');
  });

  it('defaults to 12 hour for en', () => {
    cy.visitHarness();
    cy.setLocale({
      language: 'en',
      number_format: 'language',
      time_format: 'language'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.hour')
      .first()
      .should('have.text', '5 PM');
  });

  it('defaults to 24 hour for fr', () => {
    cy.visitHarness();
    cy.setLocale({
      language: 'fr',
      number_format: 'language',
      time_format: 'language'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.hour')
      .first()
      .should('have.text', '17:00');
  });

  describe('Number formatting', () => {
    beforeEach(() => {
      cy.visitHarness();
      cy.addEntity({
        'weather.fractional': {
          attributes: {
            forecast: [
            {
              "datetime": "2022-07-21T17:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 4.67,
              "wind_bearing": 255,
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 83.6
            },
            {
              "datetime": "2022-07-21T18:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.07,
              "wind_bearing": 253,
              "condition": "cloudy",
              "clouds": 75,
              "temperature": 85.6
            },
            {
              "datetime": "2022-07-21T19:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.16,
              "wind_bearing": 258,
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 85.6
            },
            {
              "datetime": "2022-07-21T20:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.9,
              "wind_bearing": 278,
              "condition": "partlycloudy",
              "clouds": 49,
              "temperature": 84.0
            },
            {
              "datetime": "2022-07-21T21:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.78,
              "wind_bearing": 297,
              "condition": "partlycloudy",
              "clouds": 34,
              "temperature": 84.1
            },
            {
              "datetime": "2022-07-21T22:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1008,
              "wind_speed": 5.06,
              "wind_bearing": 293,
              "condition": "partlycloudy",
              "clouds": 19,
              "temperature": 83.8
            }
          ]}
        }
      });
      cy.configure({
        entity: 'weather.fractional',
        num_segments: '6'
      });
    });

    it('uses dot as decimal separator when specified', () => {
      cy.setLocale({
        number_format: 'comma_decimal'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .first()
        .should('have.text', '83.6°');
    });
    it('uses comma as decimal separator when specified as decimal_comma', () => {
      cy.setLocale({
        number_format: 'decimal_comma'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .first()
        .should('have.text', '83,6°');
    });
    it('uses comma as decimal separator when specified as space_comma', () => {
      cy.setLocale({
        number_format: 'space_comma'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .first()
        .should('have.text', '83,6°');
    });
    it('rounds properly when number format uses a comma', () => {
      cy.configure({
        entity: 'weather.fractional',
        num_segments: '6',
        round_temperatures: true,
      });
      cy.setLocale({
        number_format: 'decimal_comma'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .first()
        .should('have.text', '84°');
    });
  });
});
