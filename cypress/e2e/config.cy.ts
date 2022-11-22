import type * as Sinon from "cypress/types/sinon";

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
        .should('have.length', 5);
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
        .should('have.text', '84°');
      cy.window()
        .then(win => {
          // @ts-expect-error accessing hourlyWeather global
          const stub: Sinon.SinonStub = win.hourlyWeather.hass.connection.subscribeMessage;
          expect(stub).has.been.called;
          expect(stub.lastCall.lastArg.template).eqls('{{ offset_template }}');
        });
      });
    });
});
