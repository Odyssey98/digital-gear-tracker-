import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export function useTypedTranslation() {
  const { t, i18n } = useTranslation();

  const mapLanguageCode = (lang: string): string => {
    const lowerLang = lang.toLowerCase();
    if (lowerLang.startsWith('zh')) return 'zh-CN';
    if (lowerLang.startsWith('en')) return 'en-US';
    return 'en-US';
  };

  useEffect(() => {
    const browserLang = navigator.language;
    const mappedLang = mapLanguageCode(browserLang);
    
    if (i18n.language !== mappedLang) {
      i18n.changeLanguage(mappedLang);
    }
  }, [i18n]);

  const tArray = (key: string) => {
    return t(key, { returnObjects: true }) as string[];
  };

  return {
    t,
    i18n,
    tArray
  };
}