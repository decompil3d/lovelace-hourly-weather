import * as de from './languages/de.json';
import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as it from './languages/it.json';
import * as nb from './languages/nb.json';
import * as nl from './languages/nl.json';
import * as pl from './languages/pl.json';
import * as pt from './languages/pt.json';
import * as pt_BR from './languages/pt-BR.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  de,
  en,
  es,
  fr,
  it,
  nb,
  nl,
  pl,
  pt,
  pt_BR
};

export function getLocalizer(configuredLanguage: string | undefined, haServerLanguage: string | undefined) {
  return function localize(string: string, search = '', replace = ''): string {
    const lang = (configuredLanguage ||
                  localStorage.getItem('selectedLanguage') ||
                  haServerLanguage ||
                  'en').replace(/['"]+/g, '').replace('-', '_');

    let translated: string;

    try {
      translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
    } catch (e) {
      translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

    if (search !== '' && replace !== '') {
      translated = translated.replace(search, replace);
    }
    return translated;
  };
}
