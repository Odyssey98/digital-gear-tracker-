import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { UserProvider } from './context/UserContext';
import AppContent from './components/AppContent';
import { useTranslation } from 'react-i18next';

// 简单的调试组件
function I18nDebug() {
  const { i18n } = useTranslation();
  
  if (!import.meta.env.DEV) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg space-y-2">
      <div>当前语言: {i18n.language}</div>
      <div className="flex space-x-2">
        <button 
          onClick={() => i18n.changeLanguage('zh-CN')}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          中文
        </button>
        <button 
          onClick={() => i18n.changeLanguage('en-US')}
          className="px-2 py-1 bg-blue-500 text-white rounded"
        >
          English
        </button>
      </div>
    </div>
  );
}

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // 简单的语言初始化
    const lang = navigator.language.startsWith('zh') ? 'zh-CN' : 'en-US';
    i18n.changeLanguage(lang);
  }, [i18n]);

  return (
    <UserProvider>
      <AppContent />
      <Toaster position="top-center" />
      {import.meta.env.DEV && <I18nDebug />}
    </UserProvider>
  );
}

export default App;