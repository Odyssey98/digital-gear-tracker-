import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-CN' ? 'en-US' : 'zh-CN';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
      title={i18n.language === 'zh-CN' ? 'Switch to English' : '切换到中文'}
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">
        {i18n.language === 'zh-CN' ? 'Switch to English' : '切换到中文'}
      </span>
    </button>
  );
}