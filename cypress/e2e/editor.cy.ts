export {};

type TestHaForm = HTMLElement;
declare global {
    interface Window {
    testForm: TestHaForm;
  }
}

describe('Editor', () => {
  beforeEach(() => {
    cy.visit('editor-harness.html');
    cy.window().should('have.property', 'editorReady', true);
  });

  function getHaForm() {
    return cy.window()
    .its('testForm')
    .should('exist');
  }

  function input(name: string) {
    return getHaForm().find(`input[data-name="${name}"]`);
  }

  it('does not disable precipitation switches by default', () => {
    input('show_expected_precipitation')
      .should('not.be.disabled');

    input('show_precipitation_amounts')
      .should('not.be.disabled');

    input('show_precipitation_probability')
      .should('not.be.disabled');
  });

  it('disables both precipitation switches when expected precipitation is enabled', () => {
    input('show_expected_precipitation')
      .check();

    input('show_precipitation_amounts')
      .should('be.disabled');

    input('show_precipitation_probability')
      .should('be.disabled');
  });

  it('re-enables both precipitation switches when expected precipitation is disabled', () => {
    input('show_expected_precipitation')
      .check();

    input('show_precipitation_amounts')
      .should('be.disabled');

    input('show_precipitation_probability')
      .should('be.disabled');

    input('show_expected_precipitation')
      .uncheck();

    input('show_precipitation_amounts')
      .should('not.be.disabled');

    input('show_precipitation_probability')
      .should('not.be.disabled');
  });

  it('disables both switches when expected precipitation is initially enabled', () => {
    cy.get('hourly-weather-editor')
      .then(async ($editor) => {
        const editor = $editor[0] as HTMLElement & {
          setConfig(config: Record<string, unknown>): Promise<void>;
        };

        await editor.setConfig({
          type: 'custom:hourly-weather',
          entity: 'weather.mock',
          show_expected_precipitation: true,
          show_precipitation_amounts: false,
          show_precipitation_probability: false,
        });
      });

    input('show_precipitation_amounts')
      .should('be.disabled');

    input('show_precipitation_probability')
      .should('be.disabled');
  });
});