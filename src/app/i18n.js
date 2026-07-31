import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { getLanguage, DEFAULT_LANGUAGE } from "@src/config/locale";
import fa from "@src/locales/fa/common.json";
import en from "@src/locales/en/common.json";

// Language is fixed for the lifetime of a page load (changes go through a full
// reload — see the Settings toggle), so `lng` is read once at init and we never
// call changeLanguage() at runtime.
i18next.use(initReactI18next).init({
  resources: {
    fa: { common: fa },
    en: { common: en },
  },
  lng: getLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18next;
