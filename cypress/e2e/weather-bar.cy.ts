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
  });
});
