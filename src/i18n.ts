import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { onChangeDocumentLanguage } from './utils/language';
import translationCh from '@/i18n/ch/translation.json';
import translationEn from '@/i18n/en/translation.json';

export const resources = {
  en: {
    translation: translationEn,
  },
  ch: {
    translation: translationCh,
  },
} as const;

export const i18nkey = 'i18n';

i18n.use(initReactI18next).init({
  lng: localStorage.getItem(i18nkey) || 'en',
  resources,
});

i18n.on('languageChanged', (lang) => {
  onChangeDocumentLanguage(lang);
});

export { i18n };
