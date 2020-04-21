import i18n from 'i18next';

const en = {
  "create": {
    "placeholder": "Enter a project name or leave it empty for a random name:",
    "success": "✅ New project has been created."
  }
};

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
