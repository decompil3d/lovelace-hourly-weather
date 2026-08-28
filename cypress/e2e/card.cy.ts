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
  it('keeps its layout while a forecast subscription is pending', () => {
    cy.enableForecastSubscriptions();

    cy.addEntity({
      'weather.fromSub': {
        attributes: {}
      }
    });
    cy.configure({
      entity: 'weather.fromSub',
      num_segments: '2'
    });
    cy.get('ha-card')
      .should('exist')
      .find('.forecast-pending')
      .should('have.attr', 'aria-busy', 'true');

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

  it('keeps the last good forecast when a subscription emits an empty refresh', () => {
    cy.enableForecastSubscriptions();
    cy.configure({ entity: 'weather.mock' });
    cy.get('weather-bar').should('exist');

    cy.updateLastForecastSubscription([]);
    cy.get('weather-bar').should('exist');
    cy.get('.forecast-pending').should('not.exist');
  });

  it('recovers a stalled subscription through weather.get_forecasts', () => {
    cy.enableForecastSubscriptions();
    cy.addEntity({
      'weather.stalled': { attributes: {} }
    });
    cy.configure({ entity: 'weather.stalled', num_segments: '1' });
    cy.get('.forecast-pending').should('exist');

    cy.window().then((win: any) => {
      cy.addFallbackForecast('weather.stalled', win.hourlyWeather.hass.states['weather.mock'].attributes.forecast);
    });
    cy.recoverForecast();

    cy.get('weather-bar').should('exist');
    cy.window().its('lastHWCallWS').should('deep.include', {
      type: 'call_service',
      domain: 'weather',
      service: 'get_forecasts',
      return_response: true,
    });
  });
});
