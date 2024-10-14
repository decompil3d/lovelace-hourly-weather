import { Condition } from "../../src/types";

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
  it('handles graceful transient error if forecast is there by attribute, but not with the right amount of segments', () => {
    cy.enableForecastSubscriptions();

    const forecast1 = [
      {
        "datetime": "2022-07-21T17:00:00+00:00",
        "precipitation": 0,
        "precipitation_probability": 0,
        "pressure": 1007,
        "wind_speed": 4.67,
        "wind_bearing": 'WSW',
        "condition": "cloudy" as Condition,
        "clouds": 60,
        "temperature": 84
      },
    ];
    cy.addEntity({
      'weather.fromSub': {
        attributes: {
          forecast: forecast1
        }
      }
    });
    cy.configure({
      entity: 'weather.fromSub',
      num_segments: '2'
    });
    cy.get('ha-card')
      .should('not.exist');

    const forecast2 = [
      {
        "datetime": "2022-07-21T17:00:00+00:00",
        "precipitation": 0,
        "precipitation_probability": 0,
        "pressure": 1007,
        "wind_speed": 4.67,
        "wind_bearing": 'WSW',
        "condition": "cloudy" as Condition,
        "clouds": 60,
        "temperature": 84
      },
      {
        "datetime": "2022-07-21T17:00:00+00:00",
        "precipitation": 0,
        "precipitation_probability": 0,
        "pressure": 1007,
        "wind_speed": 4.67,
        "wind_bearing": 'WSW',
        "condition": "cloudy" as Condition,
        "clouds": 60,
        "temperature": 84
      }
    ];
    cy.addForecast('weather.fromSub', forecast2);
    cy.updateLastForecastSubscription(forecast2);
    cy.get('ha-card')
      .should('exist');
  });
});
