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

  it('prepends the current weather as the first segment', () => {
    cy.window().then((win: any) => {
      cy.addEntity({
        'weather.with_current': {
          state: 'rainy',
          last_updated: '2022-07-21T17:15:00+00:00',
          attributes: {
            temperature: 12,
            wind_speed: 3,
            wind_bearing: 180,
            pressure: 1009,
            precipitation_unit: 'mm',
            forecast: win.hourlyWeather.hass.states['weather.mock'].attributes.forecast,
          },
        },
      });
    });
    cy.configure({
      entity: 'weather.with_current',
      num_segments: '2',
      label_spacing: '1',
      show_current: true,
      show_precipitation_amounts: true,
      show_precipitation_probability: true,
    });

    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.temperature')
      .then(temperatures => {
        expect(temperatures.eq(0)).to.have.text('12°');
        expect(temperatures.eq(1)).to.have.text('85°');
      });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .first()
      .should('have.attr', 'data-tippy-content', 'Rain');
    cy.get('weather-bar')
      .shadow()
      .find('div.precipitation')
      .first()
      .should('have.text', '0.35 mm75%');
  });

  it('falls back to forecast when current weather is unavailable', () => {
    cy.window().then((win: any) => {
      cy.addEntity({
        'weather.unavailable_current': {
          state: 'unavailable',
          attributes: {
            forecast: win.hourlyWeather.hass.states['weather.mock'].attributes.forecast,
          },
        },
      });
    });
    cy.configure({
      entity: 'weather.unavailable_current',
      num_segments: '1',
      label_spacing: '1',
      show_current: true,
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.temperature')
      .first()
      .should('have.text', '84°');
  });

  it('keeps current conditions out of forecast precipitation intervals', () => {
    cy.window().then((win: any) => {
      cy.addEntity({
        'weather.current_spacing': {
          state: 'cloudy',
          last_updated: '2022-07-21T16:45:00+00:00',
          attributes: {
            temperature: 12,
            precipitation_unit: 'mm',
            forecast: win.hourlyWeather.hass.states['weather.mock'].attributes.forecast,
          },
        },
      });
    });
    cy.configure({
      entity: 'weather.current_spacing',
      num_segments: '3',
      label_spacing: '2',
      show_current: true,
      show_precipitation_amounts: true,
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.temperature:not(:empty)')
      .should('have.length', 2);
    cy.get('weather-bar')
      .shadow()
      .find('div.precipitation')
      .then(values => {
        expect(values.eq(0)).to.have.text('');
        expect(values.eq(1)).to.have.text('0.7 mm');
        expect(values.eq(2)).to.have.text('');
      });
  });
});
