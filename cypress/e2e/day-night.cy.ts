/**
 * Day/night resolution of conditions.
 *
 * The harness forecast deliberately reports the same day/night flavour for
 * every segment, the way Home Assistant weather integrations do: `sunny` for
 * 2022-07-21T23:00Z through 2022-07-22T03:00Z and `clear-night` for
 * 2022-07-22T04:00Z, regardless of where the sun actually is. The card is
 * expected to resolve each segment against its own timestamp.
 *
 * Colombo, Sri Lanka is used as the home location. Over the twelve default
 * segments no segment sits closer than 6.3 degrees to the horizon there, so
 * the expected day/night split has plenty of margin and all three transitions
 * occur: `partlycloudy` to night, `sunny` to night, and `clear-night` to day.
 */
const COLOMBO_LAT = 6.9271;
const COLOMBO_LON = 79.8612;

describe('Day/night conditions', () => {
  beforeEach(() => {
    cy.visitHarness();
  });

  describe('without a home location', () => {
    it('renders the conditions exactly as reported', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .should('have.length', 4)
        .each((el, i) => {
          cy.wrap(el).invoke('attr', 'data-tippy-content')
            .should('eq', ['Cloudy', 'Partly cloudy', 'Sunny', 'Clear'][i]);
        });
    });
  });

  describe('with a home location', () => {
    beforeEach(() => {
      cy.setHomeLocation(COLOMBO_LAT, COLOMBO_LON);
      // A change to `hass.config` alone does not satisfy `shouldUpdate`, so
      // re-apply the config to force a render. Home Assistant always has the
      // home location in place before the card first renders.
      cy.configure({});
    });

    const expectedLabels = [
      'Cloudy',
      'Partly cloudy (night)',
      'Clear',
      'Sunny'
    ];
    const expectedWidths = [6, 6, 4, 8];
    const expectedColors = [
      'rgb(119, 119, 119)',
      'rgb(51, 51, 51)',
      'rgb(17, 17, 17)',
      'rgb(144, 203, 255)'
    ];
    const expectedIcons = [
      'mdi:weather-cloudy',
      'mdi:weather-night-partly-cloudy',
      'mdi:weather-night',
      'mdi:weather-sunny'
    ];

    it('resolves each segment against its own timestamp', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .should('have.length', 4)
        .each((el, i) => {
          cy.wrap(el).invoke('attr', 'data-tippy-content')
            .should('eq', expectedLabels[i]);
        });
    });

    it('has condition blocks of the correct width and color', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .each((el, i) => {
          const cs = window.getComputedStyle(el.get(0));
          const width = parseInt(cs.gridColumnEnd, 10) - parseInt(cs.gridColumnStart, 10);
          expect(width).to.eq(expectedWidths[i]);
          expect(cs.backgroundColor).to.eq(expectedColors[i]);
        });
    });

    it('shows the nighttime icons', () => {
      cy.configure({ icons: true });
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div > span.condition-icon')
        .should('have.length', 4)
        .find('ha-icon')
        .each((el, i) => {
          cy.wrap(el).invoke('attr', 'icon')
            .should('eq', expectedIcons[i]);
        });
    });

    it('allows night-partly-cloudy to be recolored', () => {
      cy.configure({
        colors: {
          'night-partly-cloudy': 'rgb(0, 255, 0)'
        }
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .eq(1)
        .should(el => {
          expect(window.getComputedStyle(el.get(0)).backgroundColor).to.eq('rgb(0, 255, 0)');
        });
    });

    it('allows the night-partly-cloudy icon to be overridden', () => {
      cy.configure({
        icons: true,
        icon_map: {
          'night-partly-cloudy': 'foo:bar'
        }
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .its(1)
        .find('span.condition-icon > ha-icon')
        .invoke('attr', 'icon')
        .should('eq', 'foo:bar');
    });
  });
});
