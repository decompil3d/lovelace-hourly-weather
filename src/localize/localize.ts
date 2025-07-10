import * as bg from './languages/bg.json';
import * as cs from './languages/cs.json';
import * as da from './languages/da.json';
import * as de from './languages/de.json';
import * as en from './languages/en.json';
import * as es from './languages/es.json';
import * as fr from './languages/fr.json';
import * as hu from './languages/hu.json';
import * as it from './languages/it.json';
import * as nb from './languages/nb.json';
import * as nn_NO from './languages/nn-NO.json';
import * as nl from './languages/nl.json';
import * as pl from './languages/pl.json';
import * as pt from './languages/pt.json';
import * as pt_BR from './languages/pt-BR.json';
import * as ru from './languages/ru.json';
import * as sk from './languages/sk.json';
import * as tr from './languages/tr.json';
import * as uk from './languages/uk.json';
import * as zh from './languages/zh.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  bg,
  cs,
  da,
  de,
  en,
  es,
  fr,
  hu,
  it,
  nb,
  nn_NO,
  nl,
  pl,
  pt,
  pt_BR,
  ru,
  sk,
  tr,
  uk,
  zh,
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
    } catch {
      translated = string.split('.').reduce((o, i) => o[i], languages['en']);
    }

    if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

    if (search !== '' && replace !== '') {
      translated = translated.replace(search, replace);
    }
    return translated;
  };
}
