import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { InitOptions } from 'i18next';

import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';

const config: InitOptions = {
  resources: {
    'zh-CN': {
      translation: zhCN,
    },
    'en-US': {
      translation: enUS,
    },
  },
  fallbackLng: {
    'zh': ['zh-CN'],
    'en': ['en-US'],
    default: ['en-US']
  },
  supportedLngs: ['zh-CN', 'en-US', 'zh', 'en'],
  load: 'currentOnly',
  detection: {
    order: ['navigator'],
    lookupFromPathIndex: 0,
    caches: [],
  },
  interpolation: {
    escapeValue: false
  },
  debug: import.meta.env.DEV
};

// 获取浏览器语言并映射到支持的语言代码
const getBrowserLanguage = (): string => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('zh')) return 'zh-CN';
  return 'en-US';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(config)
  .then(() => {
    const defaultLang = getBrowserLanguage();
    i18n.changeLanguage(defaultLang);
  });

export default i18n;