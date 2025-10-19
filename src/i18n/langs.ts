import en from "./locales/en/common.json";
import zh from "./locales/zh/common.json";
import de from "./locales/de/common.json";
import ka from "./locales/ka/common.json";
import tr from "./locales/tr/common.json";

// const langs: any = Object.entries({en, zh}).reduce((arr, [key, value]) => {
//     return {...arr, [key] : { translation: value} }
//   }, {});

export const langs: any = {
  en: {
    nativeName: 'English',
    translation: en,
  },
  zh: {
    nativeName: '中文',
    translation: zh,
  },
  de: {
    nativeName: 'Deutsch',
    translation: de,
  },
  ka: {
    nativeName: 'ქართული',
    translation: ka,
  },
  tr: {
    nativeName: 'Türkçe',
    translation: tr,
  },
}

