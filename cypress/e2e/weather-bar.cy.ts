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
  it('hides the bar when hide_bar is set to true', () => {
    cy.configure({
      hide_bar: true
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar')
      .should('not.exist');
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
    6,
    6,
    10,
    2
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

  const expectedCustomObjectColors = [
    { bg: 'rgb(18, 52, 86)', fg: 'rgb(0, 0, 0)' },
    { bg: 'rgb(179, 219, 255)', fg: 'rgb(123, 45, 6)' },
    { bg: 'rgb(0, 255, 0)', fg: 'rgb(255, 0, 255)' },
    { bg: 'rgb(50, 205, 50)', fg: 'rgb(0, 0, 0)' }
  ];

  it('uses custom colors when specified as color objects', () => {
    cy.configure({
      colors: {
        cloudy: {
          background: '#123456'
        },
        partlycloudy: {
          foreground: 'rgb(123, 45, 6)'
        },
        sunny: {
          background: 'hsl(120, 100%, 50%)',
          foreground: 'magenta'
        },
        "clear-night": 'limegreen'
      }
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div')
      .each((el, i) => {
        const cs = window.getComputedStyle(el.get(0));
        expect(cs.backgroundColor).to.eq(expectedCustomObjectColors[i].bg);
        expect(cs.color).to.eq(expectedCustomObjectColors[i].fg);
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
        .should('have.length', 12);
    });

    const expectedHours = [
      '5 PM',
      '7 PM',
      '9 PM',
      '11 PM',
      '1 AM',
      '3 AM'
    ];

    it('shows hour labels on axes', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', expectedHours[i / 2]);
          }
        });
    });
    it('hides hours when specified in config', () => {
      cy.configure({
        hide_hours: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.hour')
        .should('have.length', 12)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });

    it('does not show date labels on axes by default', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.date:not(:empty)')
        .should('have.length', 0);
    });

    const expectedDates = [
      'Jul 21',
      'Jul 21',
      'Jul 22',
      'Jul 22',
      'Jul 22',
      'Jul 22'
    ];

    it('shows all date labels on axes when specified in config', () => {
      cy.configure({
        show_date: 'all',
        label_spacing: '6',
        num_segments: '32'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.date:not(:empty)')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.text', expectedDates[i]);
        });
    });

    const expectedBoundaryDates = [
      'Jul 21',
      'Jul 22',
      null,
      null,
      null,
      'Jul 23'
    ];

    it('shows date labels on day boundaries when specified in config', () => {
      cy.configure({
        show_date: 'boundary',
        label_spacing: '6',
        num_segments: '32',
        offset: '1'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.date:not(:empty)')
        .should('have.length', 6)
        .each((el, i) => {
          if (expectedBoundaryDates[i]) {
            cy.wrap(el).should('have.text', expectedBoundaryDates[i]);
          } else {
            cy.wrap(el).should('contain.html', '&nbsp;');
          }
        });
    });

    const expectedTemperatures = [
      84,
      85,
      84,
      79,
      70,
      65.1
    ];

    it('shows temperature labels on axes', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', expectedTemperatures[i / 2] + '°');
          }
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
        .should('have.length', 10)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', expectedTemperatures[i / 2 + 1] + '°');
          }
        });
    });
    it('hides temperatures when specified in config', () => {
      cy.configure({
        hide_temperatures: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 12)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });
    it('rounds temperatures to whole number when specified in config', () => {
      cy.configure({
        round_temperatures: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.temperature')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', Math.round(expectedTemperatures[i / 2]) + '°');
          }
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
        .should('have.length', 12)
        .each((el) => {
          cy.wrap(el).should('be.empty');
        });
    });

    const expectedWindSpeeds = [
      5,
      6,
      6,
      6,
      4,
      4
    ];
    const expectedWindDirections = [
      'WSW',
      'WSW',
      'WNW',
      'NW',
      'WNW',
      'WNW'
    ];
    const expectedWindBearings = [
      255,
      258,
      297,
      304,
      290,
      285
    ];

    it('shows wind speed/direction if specified in config', () => {
      cy.configure({
        show_wind: 'true'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedWindSpeeds[i / 2]} mph${expectedWindDirections[i / 2]}`);
          }
        });
    });

    it('shows wind speed if specified in config', () => {
      cy.configure({
        show_wind: 'speed'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedWindSpeeds[i / 2]} mph`);
          }
        });
    });

    it('shows wind direction if specified in config', () => {
      cy.configure({
        show_wind: 'direction'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedWindDirections[i / 2]}`);
          }
        });
    });

    it('shows wind barbs if specified in config', () => {
      cy.configure({
        show_wind: 'barb'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind span')
        .should('have.length', 6)
        .each((el, i) => {
          cy.wrap(el).should('have.attr', 'title', `${expectedWindSpeeds[i]} mph ${expectedWindDirections[i]}`)
            .find('svg').should('exist')
            .and('have.attr', 'style', `transform:rotate(${expectedWindBearings[i]}deg);`);
        });
    });

    it('shows wind barbs along with speed if specified in config', () => {
      cy.configure({
        show_wind: 'barb-and-speed'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('contain.text', `${expectedWindSpeeds[i / 2]}`);
          }
        })
        .find('span')
        .each((el, i) => {
          cy.wrap(el).should('have.attr', 'title', `${expectedWindSpeeds[i]} mph ${expectedWindDirections[i]}`)
            .find('svg').should('exist')
            .and('have.attr', 'style', `transform:rotate(${expectedWindBearings[i]}deg);`);
        });
    });

    it('shows wind barbs along with direction if specified in config', () => {
      cy.configure({
        show_wind: 'barb-and-direction'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('contain.text', `${expectedWindDirections[i / 2]}`);
          }
        })
        .find('span')
        .each((el, i) => {
          cy.wrap(el).should('have.attr', 'title', `${expectedWindSpeeds[i]} mph ${expectedWindDirections[i]}`)
            .find('svg').should('exist')
            .and('have.attr', 'style', `transform:rotate(${expectedWindBearings[i]}deg);`);
        });
    });

    it('shows wind barbs along with speed and direction if specified in config', () => {
      cy.configure({
        show_wind: 'barb-speed-and-direction'
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('contain.text', `${expectedWindSpeeds[i / 2]} mph${expectedWindDirections[i / 2]}`);
          }
        })
        .find('span')
        .each((el, i) => {
          cy.wrap(el).should('have.attr', 'title', `${expectedWindSpeeds[i]} mph ${expectedWindDirections[i]}`)
            .find('svg').should('exist')
            .and('have.attr', 'style', `transform:rotate(${expectedWindBearings[i]}deg);`);
        });
    });

    it('supports wind bearing specified as a string', () => {
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
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T18:00:00+00:00",
                "precipitation": 0.35,
                "precipitation_probability": 0,
                "pressure": 1007,
                "wind_speed": 6.16,
                "wind_bearing": 'W',
                "condition": "cloudy",
                "clouds": 75,
                "temperature": 85
              },
              {
                "datetime": "2022-07-21T19:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 0,
                "pressure": 1007,
                "wind_speed": 6.07,
                "wind_bearing": 'WSW',
                "condition": "cloudy",
                "clouds": 60,
                "temperature": 85
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
                "temperature": 84
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
                "temperature": 84
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
                "temperature": 83
              },
              {
                "datetime": "2022-07-21T23:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1008,
                "wind_speed": 6.39,
                "wind_bearing": 'NW',
                "condition": "sunny",
                "clouds": 4,
                "temperature": 79
              }
            ]
          }
        }
      });

      cy.configure({
        entity: 'weather.wind_bearing_string',
        num_segments: '6',
        show_wind: 'direction'
      });

      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedWindDirections[i / 2]}`);
          }
        });
    });

    it('localizes wind bearing when entity provides as a string', () => {
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
                "temperature": 84
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
                "temperature": 85
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
                "temperature": 85
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
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T21:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1007,
                "wind_speed": 5.78,
                "wind_bearing": 'ENE',
                "condition": "partlycloudy",
                "clouds": 34,
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T22:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1008,
                "wind_speed": 5.06,
                "wind_bearing": 'ENE',
                "condition": "partlycloudy",
                "clouds": 19,
                "temperature": 83
              },
              {
                "datetime": "2022-07-21T23:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1008,
                "wind_speed": 6.39,
                "wind_bearing": 'NW',
                "condition": "sunny",
                "clouds": 4,
                "temperature": 79
              }
            ]
          }
        }
      });

      cy.configure({
        entity: 'weather.wind_bearing_string',
        num_segments: '6',
        show_wind: 'direction',
        language: 'nl'
      });

      const expectedDutchWindDirections = [
        'WZW',
        'W',
        'ONO'
      ];

      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedDutchWindDirections[i / 2]}`);
          }
        });
    });

    it('falls back to string wind bearings when string is not an expected direction acronym', () => {
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
                "wind_bearing": 'ABC',
                "condition": "cloudy",
                "clouds": 60,
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T18:00:00+00:00",
                "precipitation": 0.35,
                "precipitation_probability": 0,
                "pressure": 1007,
                "wind_speed": 6.07,
                "wind_bearing": 'ABC',
                "condition": "cloudy",
                "clouds": 75,
                "temperature": 85
              },
              {
                "datetime": "2022-07-21T19:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 0,
                "pressure": 1007,
                "wind_speed": 6.16,
                "wind_bearing": 'DEF',
                "condition": "cloudy",
                "clouds": 60,
                "temperature": 85
              },
              {
                "datetime": "2022-07-21T20:00:00+00:00",
                "precipitation": 1.3,
                "precipitation_probability": 1,
                "pressure": 1007,
                "wind_speed": 5.9,
                "wind_bearing": 'DEF',
                "condition": "partlycloudy",
                "clouds": 49,
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T21:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1007,
                "wind_speed": 5.78,
                "wind_bearing": 'GHI',
                "condition": "partlycloudy",
                "clouds": 34,
                "temperature": 84
              },
              {
                "datetime": "2022-07-21T22:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1008,
                "wind_speed": 5.06,
                "wind_bearing": 'GHI',
                "condition": "partlycloudy",
                "clouds": 19,
                "temperature": 83
              },
              {
                "datetime": "2022-07-21T23:00:00+00:00",
                "precipitation": 0,
                "precipitation_probability": 1,
                "pressure": 1008,
                "wind_speed": 6.39,
                "wind_bearing": 'JKL',
                "condition": "sunny",
                "clouds": 4,
                "temperature": 79
              }
            ]
          }
        }
      });

      cy.configure({
        entity: 'weather.wind_bearing_string',
        num_segments: '6',
        show_wind: 'direction',
        language: 'nl'
      });

      const expectedFakeWindDirections = [
        'ABC',
        'DEF',
        'GHI'
      ];

      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.wind')
        .should('have.length', 6)
        .each((el, i) => {
          if (i % 2 === 0) {
            cy.wrap(el).should('have.text', `${expectedFakeWindDirections[i / 2]}`);
          }
        });
    });

    it('does not show precipitation by default', () => {
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.precipitation')
        .should('have.length', 12)
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
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            if (expectedPrecipitation[i / 2] === 0) {
              cy.wrap(el).should('be.empty');
            } else {
              cy.wrap(el).should('have.text', `${expectedPrecipitation[i / 2]} in`);
            }
          }
        });
    });

    const expectedPrecipitationProbability = [
      75,
      100,
      15,
      0,
      5,
      0,
    ];

    it('shows precipitation probability if specified in config', () => {
      cy.configure({
        show_precipitation_probability: true
      });
      cy.get('weather-bar')
        .shadow()
        .find('div.axes > div.bar-block div.precipitation')
        .should('have.length', 12)
        .each((el, i) => {
          if (i % 2 === 0) {
            if (expectedPrecipitationProbability[i / 2] === 0) {
              cy.wrap(el.text()).should('be.empty');
            } else {
              cy.wrap(el).should('have.text', `${expectedPrecipitationProbability[i / 2]}%`)
                .find('span')
                .should('have.attr', 'title', `${expectedPrecipitationProbability[i / 2]}% chance of precipitation`);
            }
          }
        });
    });
  });
});
