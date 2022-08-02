describe('Localization', () => {
  it('falls back to English for unknown language', () => {
    cy.visitHarness();
    cy.window().then(win => {
      win.localStorage.setItem('selectedLanguage', 'unknown');
    });
    cy.reload();
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div > span.condition-label')
      .first()
      .should('have.text', 'Cloudy');
  });
  it('uses HA server language if no user language is selected', () => {
    cy.visitHarness();
    cy.window().then(win => {
      win.localStorage.setItem('haServerLanguage', 'de');
      win.localStorage.removeItem('selectedLanguage');
    });
    cy.reload();
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div > span.condition-label')
      .first()
      .should('have.text', 'Bewölkt');
  });
  const expectedTranslations = {
    de: 'Bewölkt',
    en: 'Cloudy',
    es: 'Nublado',
    fr: 'Nuageux',
    it: 'Nuvoloso',
    nb: 'Skyet',
    nl: 'Bewolkt',
    pl: 'Pochmurnie',
    pt: 'Nublado'
  }
  Object.entries(expectedTranslations).forEach(([lang, expectedString]) => {
    it(`uses correct translation for ${lang}`, () => {
      cy.visitHarness();
      cy.window().then(win => {
        win.localStorage.setItem('selectedLanguage', lang);
      });
      cy.reload();
      cy.get('weather-bar')
        .shadow()
        .find('div.bar > div > span.condition-label')
        .first()
        .should('have.text', expectedString);
    });
  });
});
