describe('Weather bar', () => {
  beforeEach(() => {
    cy.visitHarness();
  });
  it('renders a bar element', () => {
    cy.get('weather-bar')
      .shadow()
      .find('div.bar')
      .should('exist');
  });
  it('renders an axes element', () => {
    cy.get('weather-bar')
      .shadow()
      .find('div.axes')
      .should('exist');
  });
  it('has the current number of condition blocks', () => {
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .should('have.length', 4);
  });
  const expectedConditions = [
    'Cloudy',
    'Partly cloudy',
    'Sunny',
    'Clear'
  ];
  it('has tippy tooltips on condition blocks', () => {
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el, i) => {
        cy.wrap(el).invoke('attr', 'data-tippy-content')
          .should('exist')
          .and('eq', expectedConditions[i])
      });
  });

  const expectedWidths = [
    3,
    3,
    5,
    1
  ];
  const expectedColors = [
    'rgb(119, 119, 119)',
    'rgb(179, 219, 255)',
    'rgb(144, 203, 255)',
    'rgb(17, 17, 17)'
  ];

  it('has condition blocks of the correct width and color', () => {
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el, i) => {
        const cs = window.getComputedStyle(el.get(0));
        const colEnd = parseInt(cs.gridColumnEnd, 10);
        const colStart = parseInt(cs.gridColumnStart, 10);
        const width = colEnd - colStart;
        expect(width).to.eq(expectedWidths[i]);

        expect(cs.backgroundColor).to.eq(expectedColors[i]);
      });
  });

  const expectedCustomColors = [
    'rgb(255, 0, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 0, 255)',
    'rgb(0, 255, 255)'
  ];

  it('uses custom colors when specified', () => {
    cy.configure({
      colors: {
        cloudy: '#FF0000',
        partlycloudy: 'rgb(0, 255, 0)',
        sunny: 'hsl(240, 100%, 50%)',
        "clear-night": 'cyan'
      }
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el, i) => {
        const cs = window.getComputedStyle(el.get(0));
        expect(cs.backgroundColor).to.eq(expectedCustomColors[i]);
      });
  });
  describe('Labels', () => {
    it('shows text descriptions on condition blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div > span.condition-label')
        .should('have.length', 4)
        .each((el, i) => {
          cy.wrap(el).should('have.text', expectedConditions[i]);
        });
    });
    it('hides condition labels on narrow blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .first()
        .find('span.condition-label')
        .should(label => {
          const cs = window.getComputedStyle(label.get(0));
          expect(cs.width).to.eq('0px');
        });
    });
    it('shows condition labels on wider blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .its(2)
        .find('span.condition-label')
        .should(label => {
          const cs = window.getComputedStyle(label.get(0));
          expect(cs.width).to.not.eq('0px');
        });
    });
  });
  describe('Icons', () => {
    beforeEach(() => {
      cy.configure({
        icons: true
      });
    });

    const expectedIcons = [
      'mdi:weather-cloudy',
      'mdi:weather-partly-cloudy',
      'mdi:weather-sunny',
      'mdi:weather-night'
    ];

    it('shows icons on condition blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div > span.condition-icon')
        .should('have.length', 4)
        .find('ha-icon')
        .each((el, i) => {
          cy.wrap(el).invoke('attr', 'icon')
            .should('exist')
            .and('eq', expectedIcons[i]);
        });
    });
    it('hides condition icons on narrow blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .its(3)
        .find('span.condition-icon')
        .should(icon => {
          const cs = window.getComputedStyle(icon.get(0));
          expect(cs.width).to.eq('0px');
        });
    });
    it('shows condition labels on wider blocks', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div')
        .its(2)
        .find('span.condition-icon')
        .should(icon => {
          const cs = window.getComputedStyle(icon.get(0));
          expect(cs.width).to.not.eq('0px');
        });
    });
  });
  describe('Axes', () => {
    it('shows the correct number of axes', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block')
        .should('have.length', 6);
    });

    const expectedHours = [
      '6 PM',
      '8 PM',
      '10 PM',
      '12 AM',
      '2 AM',
      '4 AM'
    ];

    it('shows hour labels on axes', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', expectedHours[i]);
        });
    });
    it('hides hours when specified in config', () => {
      cy.configure({
        hide_hours: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour')
        .should('have.length', 6)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });

    const expectedTemperatures = [
      85,
      84,
      83,
      75,
      67,
      64
    ];

    it('shows temperature labels on axes', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', expectedTemperatures[i] + '°');
        });
    });
    it('respects offset when specified config', () => {
      cy.configure({
        offset: '2',
        num_segments: '10'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 5)
        .each((el, i) => {
          cy.wrap(el).should('have.text', expectedTemperatures[i + 1] + '°');
        });
    });
    it('hides temperatures when specified in config', () => {
      cy.configure({
        hide_temperatures: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 6)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });
    it('spaces labels as specified in config', () => {
      cy.configure({
        label_spacing: '4'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour:not(:empty)')
        .should('have.length', 3);
        cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature:not(:empty)')
        .should('have.length', 3);
    });
    it('does not show wind speed/direction by default', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });

    const expectedWindSpeeds = [
      6,
      6,
      5,
      6,
      4,
      4
    ];
    const expectedWindDirections = [
      'WSW',
      'W',
      'WNW',
      'WNW',
      'WNW',
      'WNW'
    ];

    it('shows wind speed/direction if specified in config', () => {
      cy.configure({
        show_wind: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', `${expectedWindSpeeds[i]} mph${expectedWindDirections[i]}`);
        });
    });

    it('shows wind speed if specified in config', () => {
      cy.configure({
        show_wind: true,
        hide_wind_speed: false,
        hide_wind_direction: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', `${expectedWindSpeeds[i]} mph`);
        });
    });

    it('shows wind direction if specified in config', () => {
      cy.configure({
        show_wind: true,
        hide_wind_speed: true,
        hide_wind_direction: false
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', `${expectedWindDirections[i]}`);
        });
    });

    it('does not show precipitation by default', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.precipitation')
        .should('have.length', 6)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });

    const expectedPrecipitation = [
      0.35,
      1.3,
      0,
      0,
      0,
      0,
    ];

    it('shows precipitation if specified in config', () => {
      cy.configure({
        show_precipitation_amounts: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.precipitation')
        .should('have.length', 6)
        .each((el, i) => {
          if (expectedPrecipitation[i] === 0) {
            cy.wrap(el).should('be.empty');
          } else {
            cy.wrap(el).should('have.text', `${expectedPrecipitation[i]} in`);
          }
        });
    });
  });
});
