const firstHour = () => cy.get('weather-bar').shadow().find('.hour').first();

describe('Time zone preference', () => {
  beforeEach(() => {
    cy.visitHarness();
    cy.setServerTimeZone('America/New_York');
    cy.setLocale({ time_format: '24', time_zone: 'server' });
  });

  it('shows forecast hours in the server time zone', () => {
    firstHour().should('have.text', '13:00');
  });

  it('keeps browser-local hours when selected', () => {
    cy.setLocale({ time_zone: 'local' });
    firstHour().should('have.text', '17:00');
  });

  it('updates an existing card when the user changes time zone preference', () => {
    cy.setLocale({ time_zone: 'local' });
    firstHour().should('have.text', '17:00');
    cy.setLocale({ time_zone: 'server' });
    firstHour().should('have.text', '13:00');
    cy.setLocale({ time_zone: 'local' });
    firstHour().should('have.text', '17:00');
  });

  it('preserves 12-hour formatting', () => {
    cy.setLocale({ time_format: '12' });
    firstHour().should('have.text', '1 PM');
  });

  it('preserves hidden minutes', () => {
    cy.configure({ hide_minutes: true });
    firstHour().should('have.text', '13');
  });

  it('uses the same time zone for dates across midnight', () => {
    cy.setServerTimeZone('Asia/Tokyo');
    cy.configure({ show_date: 'all' });
    firstHour().should('have.text', '02:00');
    cy.get('weather-bar').shadow().find('.date').first().should('have.text', 'Jul 22');
  });

  it('supports time zones with half-hour offsets', () => {
    cy.setServerTimeZone('Asia/Kolkata');
    cy.configure({});
    firstHour().should('have.text', '22:30');
  });

  it('formats both sides of a daylight-saving transition', () => {
    cy.addEntity({
      'weather.dst': {
        attributes: {
          forecast: ['2022-11-06T05:00:00Z', '2022-11-06T06:00:00Z'].map(datetime => ({
            datetime, condition: 'cloudy', temperature: 20,
            precipitation: 0, precipitation_probability: 0,
            pressure: 1000, wind_speed: 0, wind_bearing: 0, clouds: 100,
          })),
        },
      },
    });
    cy.configure({ entity: 'weather.dst', num_segments: '2', label_spacing: '1' });
    cy.get('weather-bar').shadow().find('.hour')
      .should('have.length', 2)
      .each(hour => cy.wrap(hour).should('have.text', '01:00'));
  });

  it('formats the current-conditions timestamp in the server time zone', () => {
    cy.window().then(win => {
      // @ts-expect-error accessing hourlyWeather global
      const forecast = win.hourlyWeather.hass.states['weather.mock'].attributes.forecast;
      cy.addEntity({
        'weather.current': {
          state: 'cloudy',
          last_updated: '2022-07-21T17:15:00Z',
          attributes: { temperature: 20, forecast },
        },
      });
    });
    cy.configure({ entity: 'weather.current', show_current: true });
    cy.get('weather-bar').shadow().find('.current-time').should('have.attr', 'title', '13:15');
  });
});
