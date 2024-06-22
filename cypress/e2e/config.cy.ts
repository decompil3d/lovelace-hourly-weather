import type * as Sinon from "cypress/types/sinon";

describe('Config', () => {
  beforeEach(() => {
    cy.visitHarness();
  });
  it('errors for num_segments < 1', () => {
    cy.configure({
      num_segments: '0'
    });
    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'num_segments must be a positive integer');
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
  it('handles boolean values for show_wind', () => {
    cy.configure({
      show_wind: true
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.wind')
      .should('have.length', 12)
      .each((el, i) => {
        if (i % 2 === 0) {
          cy.wrap(el).should('not.be.empty');
        }
      });

    cy.configure({
      show_wind: false
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.axes > div.bar-block div.wind')
      .should('have.length', 12)
      .each((el, i) => {
        if (i % 2 === 0) {
          cy.wrap(el).should('be.empty');
        }
      });
  });
  it('errors for wind barbs when entity uses cardinal directions for wind bearing', () => {
    cy.addEntity({
      'weather.wind_bearing_string': {
        attributes: {
          forecast: [
            {
              "datetime": "2022-07-21T17:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 4.67,
              "wind_bearing": 'WSW',
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T18:00:00+00:00",
              "precipitation": 0.35,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.07,
              "wind_bearing": 'WSW',
              "condition": "cloudy",
              "clouds": 75,
              "temperature": 85,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T19:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.16,
              "wind_bearing": 'W',
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 85,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T20:00:00+00:00",
              "precipitation": 1.3,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.9,
              "wind_bearing": 'W',
              "condition": "partlycloudy",
              "clouds": 49,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T21:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.78,
              "wind_bearing": 'WNW',
              "condition": "partlycloudy",
              "clouds": 34,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T22:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1008,
              "wind_speed": 5.06,
              "wind_bearing": 'WNW',
              "condition": "partlycloudy",
              "clouds": 19,
              "temperature": 83,
              "humidity": 50
            }
          ]
        }
      }
    });

    cy.configure({
      entity: 'weather.wind_bearing_string',
      num_segments: '6',
      show_wind: 'barb'
    });

    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'Wind barbs are not supported when weather entity uses cardinal directions for wind bearing.');
  });
  it('errors for wind barbs when entity uses cardinal directions for wind bearing and bars are shown with speed', () => {
    cy.addEntity({
      'weather.wind_bearing_string': {
        attributes: {
          forecast: [
            {
              "datetime": "2022-07-21T17:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 4.67,
              "wind_bearing": 'WSW',
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T18:00:00+00:00",
              "precipitation": 0.35,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.07,
              "wind_bearing": 'WSW',
              "condition": "cloudy",
              "clouds": 75,
              "temperature": 85,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T19:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 0,
              "pressure": 1007,
              "wind_speed": 6.16,
              "wind_bearing": 'W',
              "condition": "cloudy",
              "clouds": 60,
              "temperature": 85,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T20:00:00+00:00",
              "precipitation": 1.3,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.9,
              "wind_bearing": 'W',
              "condition": "partlycloudy",
              "clouds": 49,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T21:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1007,
              "wind_speed": 5.78,
              "wind_bearing": 'WNW',
              "condition": "partlycloudy",
              "clouds": 34,
              "temperature": 84,
              "humidity": 50
            },
            {
              "datetime": "2022-07-21T22:00:00+00:00",
              "precipitation": 0,
              "precipitation_probability": 1,
              "pressure": 1008,
              "wind_speed": 5.06,
              "wind_bearing": 'WNW',
              "condition": "partlycloudy",
              "clouds": 19,
              "temperature": 83,
              "humidity": 50
            }
          ]
        }
      }
    });

    cy.configure({
      entity: 'weather.wind_bearing_string',
      num_segments: '6',
      show_wind: 'barb-and-speed'
    });

    cy.get('hui-error-card')
      .shadow()
      .find('p')
      .should('have.text', 'Wind barbs are not supported when weather entity uses cardinal directions for wind bearing.');
  });
  it('warns for invalid colors', () => {
    cy.configure({
      colors: {
        cloudy: '#FF000011', // too many digits
        partlycloudy: 'rgb(0, 255, 0, 0, 0)', // too many params
        sunny: 'foo(240, 100%, 50%)', // wrong function
        "clear-night": 'blahblah', // invalid color name
        foobar: 'rgb(0, 255, 0)', // invalid condition
        windy: {}, // empty object
        rainy: {
          // @ts-expect-error This is a test, so we're intentionally passing the wrong thing
          blah: 'blue'
        },
        fog: {
          background: 'blahblah' // invalid color name
        },
        exceptional: {
          foreground: '#12345678' // too many digits
        },
        hail: {
          background: 'foo(240, 100%, 50%)', // wrong function
          foreground: 'rgb(0, 255, 0, 0)' // too many params
        }
      }
    });
    cy.get('hui-warning')
      .shadow()
      .slotAssignedNodes()
      .should('have.length', 1)
      .its(0)
      .its('textContent')
      .should('contain', 'cloudy: "#FF000011"')
      .and('contain', 'partlycloudy: "rgb(0, 255, 0, 0, 0)"')
      .and('contain', 'sunny: "foo(240, 100%, 50%)"')
      .and('contain', 'clear-night: "blahblah"')
      .and('contain', 'foobar: "rgb(0, 255, 0)"')
      .and('contain', 'windy: {}')
      .and('contain', 'rainy: {\n  "blah": "blue"\n}')
      .and('contain', 'fog: {\n  "background": "blahblah"\n}')
      .and('contain', 'exceptional: {\n  "foreground": "#12345678"\n}')
      .and('contain', 'hail: {\n  "background": "foo(240, 100%, 50%)",\n  "foreground": "rgb(0, 255, 0, 0)"\n}');
  });
  describe('Templates', () => {
    it('supports templated name', () => {
      cy.configure({
        name: '{{ name_template }}'
      });
      cy.get('ha-card')
        .shadow()
        .find('h1')
        .should('have.text', 'TEMPLATE:name_template');
    });
    it('supports templated num_segments', () => {
      cy.visitHarness(win => {
        // @ts-expect-error accessing hourlyWeather global
        cy.stub(win.hourlyWeather.hass.connection, 'subscribeMessage').yieldsAsync({
          result: 10
        });
      });
      cy.configure({
        num_segments: '{{ num_segments_template }}'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block')
        .should('have.length', 10);
      cy.window()
        .then(win => {
          // @ts-expect-error accessing hourlyWeather global
          const stub: Sinon.SinonStub = win.hourlyWeather.hass.connection.subscribeMessage;
          expect(stub).has.been.called;
          expect(stub.lastCall.lastArg.template).eqls('{{ num_segments_template }}');
        });
    });
    it('supports templated label_spacing', () => {
      cy.visitHarness(win => {
        // @ts-expect-error accessing hourlyWeather global
        cy.stub(win.hourlyWeather.hass.connection, 'subscribeMessage').yieldsAsync({
          result: 4
        });
      });
      cy.configure({
        label_spacing: '{{ label_spacing_template }}'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour:not(:empty)')
        .should('have.length', 3);
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature:not(:empty)')
        .should('have.length', 3);
      cy.window()
        .then(win => {
          // @ts-expect-error accessing hourlyWeather global
          const stub: Sinon.SinonStub = win.hourlyWeather.hass.connection.subscribeMessage;
          expect(stub).has.been.called;
          expect(stub.lastCall.lastArg.template).eqls('{{ label_spacing_template }}');
        });
    });
    it('supports templated offset', () => {
      cy.visitHarness(win => {
        // @ts-expect-error accessing hourlyWeather global
        cy.stub(win.hourlyWeather.hass.connection, 'subscribeMessage').yieldsAsync({
          result: 2
        });
      });
      cy.configure({
        offset: '{{ offset_template }}'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .first()
        .should('have.text', '85°');
      cy.window()
        .then(win => {
          // @ts-expect-error accessing hourlyWeather global
          const stub: Sinon.SinonStub = win.hourlyWeather.hass.connection.subscribeMessage;
          expect(stub).has.been.called;
          expect(stub.lastCall.lastArg.template).eqls('{{ offset_template }}');
        });
      });
    });
  describe('Forecast events from subscription', () => {
    beforeEach(() => {
      cy.enableForecastSubscriptions();
    });

    it('uses forecast from subscription when available', () => {
      cy.addEntity({
        'weather.fromSub': {
          attributes: {
            forecast: [
              {
                "datetime": "2022-07-21T17:00:00+00:00",
                "precipitation": 0.35,
                "precipitation_probability": 75,
                "pressure": 1007,
                "wind_speed": 4.67,
                "wind_bearing": 255,
                "condition": "sunny",
                "clouds": 60,
                "temperature": 84,
                "humidity": 50
              },
              {
                "datetime": "2022-07-21T18:00:00+00:00",
                "precipitation": 0.35,
                "precipitation_probability": 75,
                "pressure": 1007,
                "wind_speed": 6.07,
                "wind_bearing": 253,
                "condition": "sunny",
                "clouds": 75,
                "temperature": 85,
                "humidity": 50
              },
              {
                "datetime": "2022-07-21T19:00:00+00:00",
                "precipitation": 1.3,
                "precipitation_probability": 100,
                "pressure": 1007,
                "wind_speed": 6.16,
                "wind_bearing": 258,
                "condition": "sunny",
                "clouds": 60,
                "temperature": 85,
                "humidity": 50
              },
              {
                "datetime": "2022-07-21T20:00:00+00:00",
                "precipitation": 1.3,
                "precipitation_probability": 100,
                "pressure": 1007,
                "wind_speed": 5.9,
                "wind_bearing": 278,
                "condition": "sunny",
                "clouds": 49,
                "temperature": 84,
                "humidity": 50
              },
              {
                "datetime": "2022-07-21T21:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 15,
                "pressure": 1007,
                "wind_speed": 5.78,
                "wind_bearing": 297,
                "condition": "sunny",
                "clouds": 34,
                "temperature": 84,
                "humidity": 50
              },
              {
                "datetime": "2022-07-21T22:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 15,
                "pressure": 1008,
                "wind_speed": 5.06,
                "wind_bearing": 293,
                "condition": "sunny",
                "clouds": 19,
                "temperature": 83,
                "humidity": 50
              }
            ]
          }
        }
      });
      cy.addForecast('weather.fromSub', [
        {
          "datetime": "2022-07-21T17:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 4.67,
          "wind_bearing": 255,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T18:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 6.07,
          "wind_bearing": 253,
          "condition": "snowy",
          "clouds": 75,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T19:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 6.16,
          "wind_bearing": 258,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T20:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 5.9,
          "wind_bearing": 278,
          "condition": "snowy",
          "clouds": 49,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T21:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1007,
          "wind_speed": 5.78,
          "wind_bearing": 297,
          "condition": "snowy",
          "clouds": 34,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T22:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1008,
          "wind_speed": 5.06,
          "wind_bearing": 293,
          "condition": "snowy",
          "clouds": 19,
          "temperature": 83,
          "humidity": 50
        }
      ]);

      cy.configure({
        entity: 'weather.fromSub',
        num_segments: '6',
      });

      // Legacy attributes will have other conditions, but the subscription-based forecast will be snowy
      cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el) => {
        cy.wrap(el).invoke('attr', 'data-tippy-content')
          .should('exist')
          .and('eq', 'Snow')
      });
    });

    it('uses forecast from subscription even when forecast attribute is not on entity', () => {
      cy.addEntity({
        'weather.fromSub': {
          attributes: {}
        }
      });
      cy.addForecast('weather.fromSub', [
        {
          "datetime": "2022-07-21T17:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 4.67,
          "wind_bearing": 255,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T18:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 6.07,
          "wind_bearing": 253,
          "condition": "snowy",
          "clouds": 75,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T19:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 6.16,
          "wind_bearing": 258,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T20:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 5.9,
          "wind_bearing": 278,
          "condition": "snowy",
          "clouds": 49,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T21:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1007,
          "wind_speed": 5.78,
          "wind_bearing": 297,
          "condition": "snowy",
          "clouds": 34,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T22:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1008,
          "wind_speed": 5.06,
          "wind_bearing": 293,
          "condition": "snowy",
          "clouds": 19,
          "temperature": 83,
          "humidity": 50
        }
      ]);

      cy.configure({
        entity: 'weather.fromSub',
        num_segments: '6',
      });

      cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el) => {
        cy.wrap(el).invoke('attr', 'data-tippy-content')
          .should('exist')
          .and('eq', 'Snow')
      });
    });

    it('handles forecast updates via subscription', () => {
      cy.addEntity({
        'weather.fromSub': {
          attributes: {}
        }
      });
      cy.addForecast('weather.fromSub', [
        {
          "datetime": "2022-07-21T17:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 4.67,
          "wind_bearing": 255,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T18:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 6.07,
          "wind_bearing": 253,
          "condition": "snowy",
          "clouds": 75,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T19:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 6.16,
          "wind_bearing": 258,
          "condition": "snowy",
          "clouds": 60,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T20:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 5.9,
          "wind_bearing": 278,
          "condition": "snowy",
          "clouds": 49,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T21:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1007,
          "wind_speed": 5.78,
          "wind_bearing": 297,
          "condition": "snowy",
          "clouds": 34,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T22:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1008,
          "wind_speed": 5.06,
          "wind_bearing": 293,
          "condition": "snowy",
          "clouds": 19,
          "temperature": 83,
          "humidity": 50
        }
      ]);

      cy.configure({
        entity: 'weather.fromSub',
        num_segments: '6',
      });

      cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el) => {
        cy.wrap(el).invoke('attr', 'data-tippy-content')
          .should('exist')
          .and('eq', 'Snow')
      });

      cy.updateLastForecastSubscription([
        {
          "datetime": "2022-07-21T17:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 4.67,
          "wind_bearing": 255,
          "condition": "rainy",
          "clouds": 60,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T18:00:00+00:00",
          "precipitation": 0.35,
          "precipitation_probability": 75,
          "pressure": 1007,
          "wind_speed": 6.07,
          "wind_bearing": 253,
          "condition": "rainy",
          "clouds": 75,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T19:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 6.16,
          "wind_bearing": 258,
          "condition": "rainy",
          "clouds": 60,
          "temperature": 85,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T20:00:00+00:00",
          "precipitation": 1.3,
          "precipitation_probability": 100,
          "pressure": 1007,
          "wind_speed": 5.9,
          "wind_bearing": 278,
          "condition": "rainy",
          "clouds": 49,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T21:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1007,
          "wind_speed": 5.78,
          "wind_bearing": 297,
          "condition": "rainy",
          "clouds": 34,
          "temperature": 84,
          "humidity": 50
        },
        {
          "datetime": "2022-07-21T22:00:00+00:00",
          "precipitation": 0,
          "precipitation_probability": 15,
          "pressure": 1008,
          "wind_speed": 5.06,
          "wind_bearing": 293,
          "condition": "rainy",
          "clouds": 19,
          "temperature": 83,
          "humidity": 50
        }
      ]);

      cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el) => {
        cy.wrap(el).invoke('attr', 'data-tippy-content')
          .should('exist')
          .and('eq', 'Rain')
      });
    });
  });
});
