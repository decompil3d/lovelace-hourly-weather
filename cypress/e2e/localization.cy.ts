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
      win.localStorage.removeItem('selectedLanguage');
    });
    cy.reload();
    cy.setLocale({
      language: 'de'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div > span.condition-label')
      .first()
      .should('have.text', 'Bewölkt');
  });
  it('prioritizes using configured language', () => {
    cy.visitHarness();
    cy.window().then(win => {
      win.localStorage.removeItem('selectedLanguage');
    });
    cy.reload();
    cy.configure({
      language: 'es'
    });
    cy.get('weather-bar')
      .shadow()
      .find('div.bar > div > span.condition-label')
      .first()
      .should('have.text', 'Nublado');
  });
  const expectedTranslations = {
    cs: 'Oblačno',
    da: 'Skyet',
    de: 'Bewölkt',
    en: 'Cloudy',
    es: 'Nublado',
    fr: 'Nuageux',
    hu: 'Felhős',
    it: 'Nuvoloso',
    nb: 'Skyet',
    nl: 'Bewolkt',
    pl: 'Pochmurnie',
    pt: 'Nublado',
    'pt-BR': 'Nublado',
    'nn-NO': 'Skya',
    ru: 'Облачно',
    sk: 'Zamračené',
    zh: '多云'
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
