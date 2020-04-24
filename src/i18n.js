import i18n from 'i18next';
import en from './locales/en';

const resources = {
  en: {
    translation: en
  }
};

i18n.init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
}).then();

export const _t = (k, args = {}) => {
  return i18n.t(k, args);
};
